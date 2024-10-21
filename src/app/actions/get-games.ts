import { chilizClient, liveClient, polygonClient } from '@/lib/gql/client';
import type { GameQuery, GameStatus } from '@azuro-org/toolkit';
import type { GameCardProps } from '@/types/global.types';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { GAMES_LIST_QUERY } from '@/lib/gql/queries';

function getDateRange(filterType: string): {
  startsAt_gte?: number;
  startsAt_lte?: number;
} {
  let minDate = dayjs().unix();
  let maxDate = dayjs().unix();
  let dateFilter: {
    startsAt_gte?: number;
    startsAt_lte?: number;
  } = {};

  switch (filterType) {
    case 'Live':
      dateFilter = {
        startsAt_lte: dayjs().unix(),
      };
      break;
    case 'Today':
      minDate = dayjs().startOf('day').unix();
      maxDate = dayjs().endOf('day').unix();
      dateFilter = {
        startsAt_gte: minDate,
        startsAt_lte: maxDate,
      };
      break;
    case 'Tomorrow':
      minDate = dayjs().add(1, 'day').startOf('day').unix();
      maxDate = dayjs().add(1, 'day').endOf('day').unix();
      dateFilter = {
        startsAt_gte: minDate,
        startsAt_lte: maxDate,
      };
      break;
    case 'Week':
      minDate = dayjs().startOf('week').unix();
      maxDate = dayjs().endOf('week').unix();
      dateFilter = {
        startsAt_gte: minDate,
        startsAt_lte: maxDate,
      };
      break;
    case 'Month':
      minDate = dayjs().startOf('month').unix();
      maxDate = dayjs().endOf('month').unix();
      dateFilter = {
        startsAt_gte: minDate,
        startsAt_lte: maxDate,
      };
      break;
    default:
      break;
  }

  return dateFilter;
}

export async function fetchGames(
  searchTerm: string,
  filterType: string,
  selectedSports: string[]
) {
  const cookieStore = cookies();
  const chainId = Number(cookieStore.get('appChainId')?.value ?? '137');

  let limit = 500;
  const where: Record<string, unknown> = {
    hasActiveConditions: true,
    status: 'Created',
  };

  if (searchTerm) {
    where.title_contains_nocase = searchTerm;
  }

  if (selectedSports.length > 0 && !selectedSports.includes('All')) {
    where.sport_ = { slug_in: selectedSports };
  }

  if (filterType) {
    const dateRange = getDateRange(filterType);
    if (dateRange?.startsAt_gte) {
      where.startsAt_gte = dateRange.startsAt_gte;
    }
    if (dateRange?.startsAt_lte) {
      where.startsAt_lte = dateRange.startsAt_lte;
    }
  }

  if (filterType === 'Hot') {
    limit = 100;
  }

  try {
    const client = chainId === 137 ? polygonClient : chilizClient;

    // Fetch prematch games
    const prematchResult = await client().query(GAMES_LIST_QUERY, {
      limit: limit,
      where,
    });

    // Fetch live games
    const liveResult = await liveClient().query(GAMES_LIST_QUERY, {
      limit: limit,
      where,
    });

    const prematchGames: GameQuery['games'] = (prematchResult?.data?.games ||
      []) as unknown as GameQuery['games'];
    const liveGames: GameQuery['games'] = (liveResult?.data?.games ||
      []) as unknown as GameQuery['games'];

    const createGameCard = (
      game: GameQuery['games'][0],
      isLive: boolean
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
      markets: [],
      participants: game.participants.map((participant) => participant.name),
    });

    const liveGameCards = liveGames.map((game) => createGameCard(game, true));
    const prematchGameCards = prematchGames.map((game) =>
      createGameCard(game, false)
    );

    const gameCards = [...liveGameCards, ...prematchGameCards].sort(
      (a, b) => Number(b.startsAt) - Number(a.startsAt)
    );

    // Apply date range filtering
    const filteredGames =
      filterType !== 'All' && filterType !== 'Live'
        ? filterGamesByDate(gameCards, filterType)
        : gameCards;

    const topEvents = filteredGames.slice(0, 5);
    const otherEvents = filteredGames
      .slice(5)
      .reduce(
        (acc: { [key: string]: GameCardProps[] }, game: GameCardProps) => {
          const sportName = game.sport;
          if (!acc[sportName]) {
            acc[sportName] = [];
          }
          acc[sportName].push(game);
          return acc;
        },
        {}
      );

    return { topEvents, otherEvents };
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

function filterGamesByDate(
  games: GameCardProps[],
  filterType: string
): GameCardProps[] {
  const now = dayjs();
  switch (filterType) {
    case 'Today':
      return games.filter((game) =>
        dayjs(Number(game.startsAt) * 1000).isSame(now, 'day')
      );
    case 'Tomorrow':
      return games.filter((game) =>
        dayjs(Number(game.startsAt) * 1000).isSame(now.add(1, 'day'), 'day')
      );
    case 'Week':
      return games.filter((game) =>
        dayjs(Number(game.startsAt) * 1000).isSame(now, 'week')
      );
    case 'Month':
      return games.filter((game) =>
        dayjs(Number(game.startsAt) * 1000).isSame(now, 'month')
      );
    default:
      return games;
  }
}
