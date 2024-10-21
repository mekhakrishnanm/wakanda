// app/lib/gql/queries.ts
import { gql } from '@apollo/client';

export const GAMES_LIST_QUERY = gql`
  query Games($limit: Int!, $where: Game_filter) {
    games(
      first: $limit
      where: $where
      orderBy: startsAt
      orderDirection: asc
    ) {
      id
      gameId
      title
      slug
      startsAt
      sport {
        name
        slug
      }
      league {
        name
        country {
          name
        }
      }
      status
      participants {
        name
        image
      }
      turnover
    }
  }
`;

export const PREMATCH_MARKETS_QUERY = gql`
  query PrematchMarkets($where: Condition_filter!) {
    conditions(where: $where, first: 1000) {
      id
      conditionId
      status
      isExpressForbidden
      outcomes {
        outcomeId
        odds: currentOdds
      }
      core {
        address
        liquidityPool {
          address
        }
      }
      game {
        gameId
        sport {
          sportId
        }
      }
    }
  }
`;

export const LIVE_MARKETS_QUERY = gql`
  query LiveMarkets($where: Condition_filter!) {
    conditions(where: $where, first: 1000) {
      id
      conditionId
      status
      outcomes {
        outcomeId
      }
      game {
        gameId
        sport {
          sportId
        }
      }
    }
  }
`;
