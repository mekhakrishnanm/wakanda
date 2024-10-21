import { useEffect, useMemo, useState, useCallback } from 'react';
import { type ApolloError, useQuery } from '@apollo/client';
import { useApolloClients, useChain } from '@azuro-org/sdk';
import type {
  PrematchConditionsQuery,
  ConditionStatus,
  Market,
} from '@azuro-org/toolkit';
import type { Address } from 'viem';
import { PREMATCH_MARKETS_QUERY, LIVE_MARKETS_QUERY } from '@/lib/gql/queries';
import { groupMarkets } from './useGameMarkets';

export type UseGamesMarketsProps = {
  gameIds: string[];
  gameStatuses: Record<string, boolean>;
  filter?: {
    outcomeIds?: string[];
  };
  livePollInterval?: number;
};

export type Condition = {
  __typename?: 'Condition';
  wonOutcomeIds?: Array<string> | null;
  id: string;
  conditionId: string;
  status: ConditionStatus;
  title?: string | null;
  isExpressForbidden: boolean;
  outcomes: Array<{
    __typename?: 'Outcome';
    title?: string | null;
    outcomeId: string;
    odds: string;
  }>;
  core: {
    __typename?: 'CoreContract';
    address: string;
    liquidityPool: {
      __typename?: 'LiquidityPoolContract';
      address: string;
    };
  };
  game: {
    __typename?: 'Game';
    gameId: string;
    sport: {
      __typename?: 'Sport';
      sportId: string;
    };
  };
};

export const useGamesMarkets = (props: UseGamesMarketsProps) => {
  const { gameIds, gameStatuses, filter, livePollInterval = 2000 } = props;
  const { prematchClient, liveClient } = useApolloClients();
  const { contracts } = useChain();

  const variables = useMemo(
    () => ({
      where: {
        game_: { gameId_in: gameIds },
        ...(filter?.outcomeIds && {
          outcomesIds_contains: filter.outcomeIds.map(String),
        }),
      },
    }),
    [gameIds, filter?.outcomeIds]
  );

  const queryOptions = useMemo(
    () => ({
      variables,
      fetchPolicy: 'cache-and-network' as const,
      nextFetchPolicy: 'cache-first' as const,
      ssr: false,
    }),
    [variables]
  );

  const prematchGameIds = useMemo(
    () => gameIds.filter((id) => !gameStatuses[id]),
    [gameIds, gameStatuses]
  );

  const liveGameIds = useMemo(
    () => gameIds.filter((id) => gameStatuses[id]),
    [gameIds, gameStatuses]
  );

  const [prematchData, setPrematchData] = useState<Condition[]>([]);
  const [isPrematchLoading, setIsPrematchLoading] = useState(false);
  const [prematchError, setPrematchError] = useState<ApolloError | null>(null);

  const fetchPrematchData = useCallback(async () => {
    if (prematchGameIds.length === 0) {
      setPrematchData([]);
      return;
    }

    setIsPrematchLoading(true);
    setPrematchError(null);

    const batchSize = 100;
    let allData: Condition[] = [];

    try {
      for (let i = 0; i < prematchGameIds.length; i += batchSize) {
        const batch = prematchGameIds.slice(i, i + batchSize);
        const { data } = await prematchClient.query<PrematchConditionsQuery>({
          query: PREMATCH_MARKETS_QUERY,
          variables: {
            ...queryOptions.variables,
            where: {
              ...queryOptions.variables.where,
              game_: { gameId_in: batch },
            },
          },
        });
        allData = [...allData, ...((data.conditions as Condition[]) || [])];
      }
      setPrematchData(allData);
    } catch (error) {
      setPrematchError(error as ApolloError);
    } finally {
      setIsPrematchLoading(false);
    }
  }, [prematchGameIds, prematchClient, queryOptions]);

  useEffect(() => {
    fetchPrematchData();
  }, [fetchPrematchData]);

  const {
    data: liveData,
    loading: isLiveLoading,
    error: liveError,
  } = useQuery(LIVE_MARKETS_QUERY, {
    ...queryOptions,
    client: liveClient,
    skip: liveGameIds.length === 0,
    pollInterval: liveGameIds.length > 0 ? livePollInterval : undefined,
  });

  const gamesMarkets = useMemo(() => {
    const result: Record<string, Market[]> = {};
    const conditionsList: Record<string, Condition[]> = {};

    const processConditions = (conditions: Condition[]) => {
      for (const condition of conditions) {
        const gameId = condition.game.gameId;
        if (!conditionsList[gameId]) {
          conditionsList[gameId] = [condition];
        } else {
          conditionsList[gameId].push(condition);
        }
      }
    };

    if (prematchData?.length) {
      processConditions(prematchData);
    }

    if (liveData?.conditions) {
      processConditions(liveData.conditions as Condition[]);
    }

    // Apply groupMarkets to each game's conditions
    for (const gameId in conditionsList) {
      result[gameId] =
        groupMarkets(
          conditionsList[gameId] as PrematchConditionsQuery['conditions'],
          gameId,
          contracts.lp.address as Address
        ) ?? [];
    }

    return result;
  }, [prematchData, liveData, contracts.lp.address]);

  return {
    gamesMarkets,
    loading: isPrematchLoading || isLiveLoading,
    error: prematchError || liveError,
  };
};
