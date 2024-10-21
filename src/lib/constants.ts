import { BetslipDisableReason } from '@azuro-org/sdk';

export const defaultTeamLogo = '/svg/no-opponent.svg';

export const eventsFiltersByTime = [
  { text: 'All', id: 1 },
  { text: 'Hot', id: 2 },
  { text: 'Live', id: 3 },
  { text: 'Today', id: 4 },
  { text: 'Tomorrow', id: 5 },
  { text: 'Week', id: 6 },
  { text: 'Month', id: 7 },
] as const;

export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balances',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const errorPerDisableReason = {
  [BetslipDisableReason.ComboWithForbiddenItem]:
    "One or more conditions can't be used in combo",
  [BetslipDisableReason.BetAmountGreaterThanMaxBet]:
    'The bet amount exceeds the maximum allowed.',
  [BetslipDisableReason.BetAmountLowerThanMinBet]:
    'The bet amount is lower than the minimum required.',
  [BetslipDisableReason.ComboWithLive]:
    "A live outcome can't be used in a combo bet.",
  [BetslipDisableReason.ConditionStatus]:
    'One or more outcomes have been removed or suspended.',
  [BetslipDisableReason.PrematchConditionInStartedGame]:
    'A pre-match item is in a game that has already started.',
  [BetslipDisableReason.FreeBetExpired]: 'The free bet has expired.',
  [BetslipDisableReason.FreeBetMinOdds]:
    " The selection's odds are too low for a free bet.",
} as const;

export const tabsImages = [
  {
    idleImage: '/svg/bet-card/bg-left-idle.webp',
    activeImage: '/svg/bet-card/bg-left-active.webp',
    badgeActiveImage: '',
    badgeIdleImage: '',
  },
  {
    idleImage: '/svg/bet-card/bg-tie-idle.webp',
    activeImage: '/svg/bet-card/bg-tie-active.webp',
    badgeIdleImage: '/svg/bet-card/tie-idle.webp',
    badgeActiveImage: '/svg/bet-card/tie-active.webp',
  },
  {
    idleImage: '/svg/bet-card/bg-right-idle.webp',
    activeImage: '/svg/bet-card/bg-right-active.webp',
    badgeActiveImage: '',
    badgeIdleImage: '',
  },
];
