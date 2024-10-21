import { useCallback, useEffect, useMemo, useState } from 'react';
import { type ApolloError, useQuery } from '@apollo/client';
import { useApolloClients, useChain } from '@azuro-org/sdk';
import {
  dictionaries,
  getMarketKey,
  getMarketName,
  getMarketDescription,
  getSelectionName,
} from '@azuro-org/dictionaries';
import type { Address } from 'viem';
import {
  liveHostAddress,
  type Market,
  type MarketOutcome,
  type PrematchConditionsQuery,
} from '@azuro-org/toolkit';
import { PREMATCH_MARKETS_QUERY, LIVE_MARKETS_QUERY } from '@/lib/gql/queries';
import type { Condition, UseGamesMarketsProps } from './useGamesMarkets';

// Helper Functions
const groupDataByConditionId = <T extends { conditionId: string }>(
  data: T[]
): Record<string, T[]> => {
  return data.reduce<Record<string, T[]>>((acc, item) => {
    const { conditionId } = item;
    const key = String(conditionId);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

export const groupMarkets = (
  conditions: PrematchConditionsQuery['conditions'],
  gameId: string,
  lpAddress: Address
): Market[] | undefined => {
  const outcomesByMarkets: Record<string, MarketOutcome[]> = {};
  const result: Record<string, Market> = {};
  const sportId = conditions[0]?.game.sport.sportId;

  for (const condition of conditions) {
    const {
      conditionId,
      outcomes: rawOutcomes,
      status,
      isExpressForbidden,
    } = condition;
    const coreAddress = condition.core?.address || liveHostAddress;

    for (const rawOutcome of rawOutcomes) {
      const { outcomeId } = rawOutcome;
      const odds = rawOutcome.odds ? +rawOutcome.odds : undefined;
      const betTypeOdd = dictionaries.outcomes[outcomeId];

      if (!betTypeOdd) {
        console.warn(`betTypeOdd not found for "outcomeId: ${outcomeId}"`);
        return;
      }

      const marketKey = getMarketKey(outcomeId);
      const marketName = getMarketName({ outcomeId });
      const marketDescription = getMarketDescription({ outcomeId });
      const selectionName = getSelectionName({ outcomeId, withPoint: true });

      const outcome: MarketOutcome = {
        coreAddress,
        lpAddress,
        conditionId,
        outcomeId,
        selectionName,
        status,
        gameId,
        isExpressForbidden,
        odds,
      };

      if (!outcomesByMarkets[marketKey]) {
        outcomesByMarkets[marketKey] = [];
        result[marketKey] = {
          name: marketName,
          marketKey,
          description: marketDescription,
          outcomeRows: [],
        };
      }

      outcomesByMarkets[marketKey].push(outcome);
    }
  }

  // Process markets
  const marketsWithDifferentConditionIds = ['1', '2'];

  for (const marketKey of Object.keys(outcomesByMarkets)) {
    const marketId = marketKey.split('-')[0];
    const outcomes = outcomesByMarkets[marketKey];

    const validSelectionsByMarketId: Record<string, number[]> = {
      '1': [1, 2, 3],
      '2': [4, 5, 6],
    };

    const validSelections = validSelectionsByMarketId[marketId];

    if (validSelections?.length) {
      const outcomesSelections = outcomes.map(
        (outcome) =>
          dictionaries.outcomes[String(outcome.outcomeId)].selectionId
      );

      const isValid = validSelections.every((selection) =>
        outcomesSelections.includes(selection)
      );

      if (!isValid) {
        return;
      }
    }

    // Sort outcomes
    outcomes.sort((a, b) => {
      const { outcomes: dictionaryOutcomes } = dictionaries;
      const left = dictionaryOutcomes[String(a.outcomeId)].selectionId;
      const right = dictionaryOutcomes[String(b.outcomeId)].selectionId;
      return left - right;
    });

    if (marketsWithDifferentConditionIds.includes(marketId)) {
      result[marketKey].outcomeRows = [outcomes];
    } else {
      const conditionsByConditionId =
        groupDataByConditionId<MarketOutcome>(outcomes);
      result[marketKey].outcomeRows = Object.values(
        conditionsByConditionId
      ).sort((a, b) => {
        const { points, outcomes: dictionaryOutcomes } = dictionaries;
        const aPointId = dictionaryOutcomes[String(a[0].outcomeId)].pointsId;
        const bPointId = dictionaryOutcomes[String(b[0].outcomeId)].pointsId;
        const aFirstOutcome = +points[aPointId ?? 0];
        const bFirstOutcome = +points[bPointId ?? 0];
        return aFirstOutcome - bFirstOutcome;
      });
    }
  }

  const markets = Object.values(result);
  const orderedMarketKeys = dictionaries.marketOrders?.[sportId];

  if (!orderedMarketKeys) {
    return markets;
  }

  return markets.sort((a, b) => {
    const prevMarketIndex = orderedMarketKeys.indexOf(a.marketKey);
    const nextMarketIndex = orderedMarketKeys.indexOf(b.marketKey);

    if (prevMarketIndex >= 0 && nextMarketIndex >= 0) {
      return prevMarketIndex - nextMarketIndex;
    }

    if (prevMarketIndex < 0 && nextMarketIndex >= 0) {
      return 1;
    }

    if (prevMarketIndex >= 0 && nextMarketIndex < 0) {
      return -1;
    }

    return 0;
  });
};

// Main Hook
export const useGameMarkets = (props: UseGamesMarketsProps) => {
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
    // if (prematchGameIds.length === 0) {
    //   setPrematchData([]);
    //   return;
    // }

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchPrematchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const markets = useMemo(() => {
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
    markets: markets[gameIds[0]] || [],
    loading: isPrematchLoading || isLiveLoading,
    error: prematchError || liveError,
  };
};
