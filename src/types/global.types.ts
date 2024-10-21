import type { Bet } from '@azuro-org/sdk';
import type { GameStatus, Market, MarketOutcome } from '@azuro-org/toolkit';

// export enum GameStatus {
//   Canceled = 'Canceled',
//   Live = 'Live',
//   Created = 'Created',
//   Paused = 'Paused',
//   Resolved = 'Resolved',
// }

export interface GameDataProps {
  __typename?: 'Game' | undefined;
  turnover: string;
  id: string;
  gameId: string;
  title?: string | null | undefined;
  startsAt: string;
  status: GameStatus;
  sport: {
    __typename?: 'Sport' | undefined;
    sportId: string;
    slug: string;
    name: string;
  };
  league: {
    __typename?: 'League' | undefined;
    slug: string;
    name: string;
    country: {
      __typename?: 'Country' | undefined;
      slug: string;
      name: string;
    };
  };
  participants: {
    __typename?: 'Participant' | undefined;
    image?: string | null | undefined;
    name: string;
  }[];
}

export interface GameCardProps {
  id: string;
  title: string;
  sportSlug: string;
  sport: string;
  league: string;
  country: string;
  status: GameStatus;
  dateTime: string;
  startsAt: string;
  teamImage: (string | null | undefined)[];
  isLive: boolean;
  markets: Market[];
  participants: string[];
}

export interface TransactionDetailProps {
  betDetail: Bet;
  bidOn: string;
  league: string;
  team1: string;
  team2: string;
  eventDate: string;
}

export interface GameTeamItemType {
  outcome?: MarketOutcome;
  won?: boolean;
  teamImg: string;
  activeLeft?: boolean;
  activeRight?: boolean;
  onClick?: () => void;
}
