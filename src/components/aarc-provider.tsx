import { AarcSwitchWidgetProvider } from '@aarc-xyz/fund-kit-widget';
import { AarcEthWalletConnector } from '@aarc-xyz/eth-connector';
import type { Address } from 'viem';
import {
  ThemeName,
  type TransactionErrorData,
  type TransactionSuccessData,
} from '@aarc-xyz/fund-kit-widget';
import { AarcFundKitModal, type FKConfig } from '@aarc-xyz/fundkit-web-sdk';
import { useAccount } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { useChain } from '@azuro-org/sdk';
export function AarcProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { appChain } = useChain();
  const aarcConfig: FKConfig = {
    appName: 'Wakanda Bets',
    module: {
      exchange: {
        enabled: true,
      },
      onRamp: {
        enabled: true,
        onRampConfig: {
          customerId: address as Address,
        },
      },
      bridgeAndSwap: {
        enabled: true,
        fetchOnlyDestinationBalance: false,
        routeType: 'Value',
      },
    },
    destination: {
      chainId: appChain?.id || polygon.id,
      walletAddress: address as Address,
      tokenAddress:
        appChain?.id === 88888
          ? '0x677F7e16C7Dd57be1D4C8aD1244883214953DC47'
          : '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
    appearance: {
      themeColor: '#77e5ca',
      textColor: '#2D2D2D',
      backgroundColor: '#FFF',
      highlightColor: '#F0F0F0',
      borderColor: '#2D2D2D',
      dark: {
        themeColor: '#77e5ca',
        textColor: '#FFF',
        backgroundColor: '#201e1f',
        highlightColor: '#201e1f',
        borderColor: '#201e1f',
      },
      roundness: 24,
      theme: ThemeName.DARK,
    },

    apiKeys: {
      aarcSDK:
        process.env.NEXT_PUBLIC_API_KEY ||
        'b5473c95-2d85-4f1d-9732-c2758d2f95a7',
    },
    events: {
      onTransactionSuccess: (data: TransactionSuccessData) => {
        console.log('onTransactionSuccess', data);
      },
      onTransactionError: (data: TransactionErrorData) => {
        console.log('onTransactionError', data);
      },
      onWidgetClose: () => {
        console.log('onWidgetClose');
      },
      onWidgetOpen: () => {
        console.log('onWidgetOpen');
      },
    },
    origin: window.location.origin,
  };

  const aarcModal = new AarcFundKitModal(aarcConfig);
  aarcModal.init();
  return (
    <AarcSwitchWidgetProvider config={aarcConfig}>
      <AarcEthWalletConnector>{children}</AarcEthWalletConnector>
    </AarcSwitchWidgetProvider>
  );
}
