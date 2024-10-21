import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { useApolloClients, useChain } from '@azuro-org/sdk';
import { GAMES_LIST_QUERY } from '@/lib/gql/queries';
import type { GameStatus, GameQuery, Market } from '@azuro-org/toolkit';
import type { GameCardProps } from '@/types/global.types';
import { useMemo } from 'react';
import { useGamesMarkets } from './useGamesMarkets';

type DateFilter = {
  startsAt_gte?: number;
  startsAt_lte?: number;
};

type UseGamesProps = {
  searchTerm?: string;
  filterType: string;
  selectedSports: string[];
  limit?: number;
};

const getDateRange = (filterType: string, isChiliz: boolean): DateFilter => {
  const now = dayjs();
  const timeSub = now.unix();
  const filters: Record<string, () => DateFilter> = {
    All: () => ({
      startsAt_gte: isChiliz ? timeSub : now.startOf('day').unix(),
    }),
    Live: () => ({ startsAt_lte: now.unix() }),
    Today: () => ({
      startsAt_gte: isChiliz ? timeSub : now.startOf('day').unix(),
      startsAt_lte: now.endOf('day').unix(),
    }),
    Tomorrow: () => ({
      startsAt_gte: now.add(1, 'day').startOf('day').unix(),
      startsAt_lte: now.add(1, 'day').endOf('day').unix(),
    }),
    Week: () => ({
      startsAt_gte: isChiliz ? timeSub : now.startOf('week').unix(),
      startsAt_lte: now.endOf('week').unix(),
    }),
    Month: () => ({
      startsAt_gte: isChiliz ? timeSub : now.startOf('month').unix(),
      startsAt_lte: now.endOf('month').unix(),
    }),
  };

  return filters[filterType]?.() || {};
};

const createGameCard = (
  game: GameQuery['games'][0],
  isLive: boolean,
  markets: Market[]
): GameCardProps => ({
  id: game.gameId,
  title: game.title || '',
  sport: game.sport.name,
  league: game.league.name,
  country: game.league.country.name,
  status: game.status as unknown as GameStatus,
  dateTime: dayjs(Number(game.startsAt) * 1000).format('DD MMM HH:mm'),
  teamImage: game.participants.map(
    (participant: GameQuery['games'][0]['participants'][0]) =>
      participant.image || '/svg/no-opponent.svg'
  ),
  startsAt: game.startsAt,
  sportSlug: game.sport.slug,
  isLive,
  markets, // Include the markets data
  participants: game.participants.map((participant) => participant.name),
});

const filterGamesByDate = (
  games: GameCardProps[],
  filterType: string
): GameCardProps[] => {
  const now = dayjs();
  const filters: Record<string, (game: GameCardProps) => boolean> = {
    Today: (game) => dayjs(Number(game.startsAt) * 1000).isSame(now, 'day'),
    Tomorrow: (game) =>
      dayjs(Number(game.startsAt) * 1000).isSame(now.add(1, 'day'), 'day'),
    Week: (game) => dayjs(Number(game.startsAt) * 1000).isSame(now, 'week'),
    Month: (game) => dayjs(Number(game.startsAt) * 1000).isSame(now, 'month'),
  };

  return filters[filterType] ? games.filter(filters[filterType]) : games;
};

export const useGames = ({
  searchTerm = '',
  filterType,
  selectedSports,
  limit = 500,
}: UseGamesProps) => {
  const { prematchClient, liveClient } = useApolloClients();
  const { appChain } = useChain();
  const isChiliz = appChain.id === 88888;

  if (isChiliz && filterType === 'Live') {
    filterType = 'All';
  }

  // Adjust limit for 'Hot' filter type
  const queryLimit = filterType === 'Hot' ? 100 : limit;

  const where = useMemo(() => {
    const andConditions: Array<Record<string, unknown>> = [
      { hasActiveConditions: true },
      { status: 'Created' as const },
    ];

    if (selectedSports.length > 0 && !selectedSports.includes('All')) {
      andConditions.push({ sport_: { slug_in: selectedSports } });
    }

    const dateRange = getDateRange(filterType, isChiliz);
    if (Object.keys(dateRange).length > 0) {
      andConditions.push(dateRange);
    }

    const orConditions = searchTerm
      ? [
          { title_contains_nocase: searchTerm },
          { sport_: { name_contains_nocase: searchTerm } },
          { league_: { name_contains_nocase: searchTerm } },
        ]
      : [];

    return {
      and: [
        ...(orConditions.length > 0 ? [{ or: orConditions }] : []),
        ...andConditions,
      ],
    };
  }, [searchTerm, selectedSports, filterType, isChiliz]);

  const variables = useMemo(
    () => ({
      limit: queryLimit,
      where: where,
    }),
    [where, queryLimit]
  );

  const { data: prematchData, loading: prematchLoading } = useQuery(
    GAMES_LIST_QUERY,
    {
      variables: variables,
      client: prematchClient,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    }
  );

  const { data: liveData, loading: liveLoading } = useQuery(GAMES_LIST_QUERY, {
    variables: variables,
    client: liveClient,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    pollInterval: 30000, // Poll every 30 seconds for live games
    skip: isChiliz, // Skip this query if not on Polygon chain
  });

  const liveGames = useMemo(
    () => (liveData?.games || []) as GameQuery['games'],
    [liveData?.games]
  );

  const prematchGames = useMemo(
    () => (prematchData?.games || []) as GameQuery['games'],
    [prematchData?.games]
  );

  const liveGameIds = useMemo(
    () => liveGames.map((game) => game.gameId),
    [liveGames]
  );
  const prematchGameIds = useMemo(
    () => prematchGames.map((game) => game.gameId),
    [prematchGames]
  );
  const prematchGameStatuses = useMemo(
    () =>
      prematchGames.reduce(
        (acc, game) => {
          acc[game.gameId] = false;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    [prematchGames]
  );
  const liveGameStatuses = useMemo(
    () =>
      prematchGames.reduce(
        (acc, game) => {
          acc[game.gameId] = true;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    [prematchGames]
  );

  const { gamesMarkets: liveGamesMarkets, loading: liveMarketsLoading } =
    useGamesMarkets({
      gameIds: liveGameIds,
      gameStatuses: liveGameStatuses,
    });

  const {
    gamesMarkets: prematchGamesMarkets,
    loading: prematchMarketsLoading,
  } = useGamesMarkets({
    gameIds: prematchGameIds,
    gameStatuses: prematchGameStatuses,
  });

  const liveGameCards = liveGames.map((game) => {
    const markets = liveGamesMarkets[game.gameId];
    if (!markets || markets.length === 0) {
      return null; // Filter out games with no markets
    }
    return createGameCard(game, true, markets);
  });

  const prematchGameCards = prematchGames.map((game) => {
    const markets = prematchGamesMarkets[game.gameId];
    if (!markets || markets.length === 0) {
      return null; // Filter out games with no markets
    }
    return createGameCard(game, false, markets);
  });

  const gameCards = useMemo(
    () =>
      [...liveGameCards, ...prematchGameCards].filter(
        (game): game is GameCardProps => game !== null
      ),
    [liveGameCards, prematchGameCards]
  );

  const filteredGames = useMemo(
    () =>
      filterType !== 'All' && filterType !== 'Live'
        ? filterGamesByDate(gameCards, filterType)
        : gameCards,
    [gameCards, filterType]
  );

  const topEvents = useMemo(() => filteredGames.slice(0, 5), [filteredGames]);
  const otherEvents = useMemo(
    () =>
      filteredGames
        .slice(5)
        .reduce<Record<string, GameCardProps[]>>((acc, game) => {
          const sportName = game.sport;
          if (!acc[sportName]) {
            acc[sportName] = [];
          }
          acc[sportName].push(game);
          return acc;
        }, {}),
    [filteredGames]
  );

  // Calculate sport counts and total count
  // const sportCounts = useMemo(() => {
  //   const counts: Record<string, number> = { total: 0 };
  //   for (const game of filteredGames) {
  //     counts[game.sportSlug] = (counts[game.sportSlug] || 0) + 1;
  //     counts.total += 1;
  //   }
  //   return counts;
  // }, [filteredGames]);

  return {
    topEvents,
    otherEvents,
    loading:
      prematchLoading ||
      liveLoading ||
      liveMarketsLoading ||
      prematchMarketsLoading,
  };
};
