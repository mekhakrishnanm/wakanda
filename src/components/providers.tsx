'use client';

import { AzuroSDKProvider, ChainProvider, LiveProvider } from '@azuro-org/sdk';
import {
  // getDefaultConfig,
  // getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import type { Address } from 'viem';
import type { State } from 'wagmi';
import { chiliz } from 'viem/chains';
import { AarcProvider } from './aarc-provider';
import WagmiProvider from './wallet/WagmiProvider';
import { chains, type ChainId } from '@/lib/chains';

const queryClient = new QueryClient();

type ProvidersProps = {
  children: React.ReactNode;
  initialChainId: ChainId;
  initialLiveState: boolean;
  initialState?: State;
};

export function Providers(props: ProvidersProps) {
  const { children, initialChainId, initialLiveState } = props;

  const chainId = initialChainId
    ? chains.find((chain) => chain.id === +initialChainId)
      ? (+initialChainId as ChainId)
      : chiliz.id
    : chiliz.id;

  const affiliate = process.env.NEXT_PUBLIC_AFFILIATE_ADDRESS as Address;
  return (
    <WagmiProvider>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AzuroSDKProvider
            affiliate={affiliate}
            initialChainId={chainId as unknown as ChainId}
          >
            <ChainProvider initialChainId={chainId}>
              <LiveProvider initialLiveState={initialLiveState}>
                <AarcProvider>{children}</AarcProvider>
              </LiveProvider>
            </ChainProvider>
          </AzuroSDKProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
