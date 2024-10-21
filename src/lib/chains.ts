import type { ChainData } from '@azuro-org/toolkit';
import { gnosis, polygon, polygonAmoy, chiliz, spicy } from 'wagmi/chains';

export const TOKENS = {
  [gnosis.id]: 'wDAI',
  [polygon.id]: 'USDT',
  [polygonAmoy.id]: 'aUSD',
  [chiliz.id]: 'wCHZ',
  [spicy.id]: 'wCHZ',
};

export declare const chainsData: {
  readonly 137: ChainData;
  readonly 88888: ChainData;
};
export type ChainId = keyof typeof chainsData;

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  : '3020b540cb4600580463aaee8fac93a6';

export const rpcByChains: Record<ChainId, string> = {
  [polygon.id]: 'https://polygon-bor-rpc.publicnode.com',
  [chiliz.id]: 'https://chiliz-rpc.publicnode.com',
} as const;

export const chains = [chiliz, polygon] as const;
