'use client';
import { AxiosError } from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cookieStorage,
  createStorage,
  http,
  WagmiProvider as WagmiBaseProvider,
} from 'wagmi';
import { projectId, baseUrl, chains, rpcByChains } from '@/lib/chains';
import { polygon, chiliz } from 'wagmi/chains';
import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';

export const wagmiConfig = getDefaultConfig({
  appName: 'Wakanda Bets',
  chains,
  projectId,
  appDescription: 'Bet on Wakanda',
  appIcon: `${baseUrl}/img/icon-512x512.png`,
  appUrl: baseUrl,
  ssr: false,
  transports: {
    [polygon.id]: http(rpcByChains[polygon.id]),
    [chiliz.id]: http(rpcByChains[chiliz.id]),
  },
  wallets: getDefaultWallets().wallets,
  storage: createStorage({
    storage: cookieStorage,
  }),
  syncConnectedChain: true,
  multiInjectedProviderDiscovery: false,
});

const noRetryErrorCode = [404];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: <T,>(prev: T) => prev,
      retry: (retryCount, error) => {
        if (error instanceof AxiosError) {
          const status = error?.response?.status;

          if (status && noRetryErrorCode.includes(status)) {
            return false;
          }
        }

        return retryCount < 3;
      },
    },
  },
});

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiBaseProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiBaseProvider>
  );
};

export default WagmiProvider;
