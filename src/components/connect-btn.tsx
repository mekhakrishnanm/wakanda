import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { Address } from 'viem';
import { useChain } from '@azuro-org/sdk';
import { useAccount } from 'wagmi';
import { Button } from './ui/button';
import { TOKENS } from '@/lib/chains';
import useBalances from '@/hooks/useBalances';
import { useAppDispatch } from '@/redux/redux-provider';

const contractAddress = process.env.NEXT_PUBLIC_CHAIN_TOKEN_ADDRESS as Address;

export const ConnectBtn = ({ classVal }: { classVal?: string }) => {
  const { appChain } = useChain();
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const { tBalance } = useBalances(
    address as Address,
    contractAddress,
    dispatch
  );

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      className={
                        classVal ??
                        'w-full h-[56px] disabled:bg-[#787878] rounded-[16px] bg-white text-black text-[20px] font-[450] py-[10px] px-4 my-4'
                      }
                      onClick={openConnectModal}
                      type='button'
                    >
                      Connect Wallet
                    </Button>
                  );
                }
                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                      className='border border-[#ffffff2c] w-full rounded-[12px] text-xs flex justify-between items-center !px-2'
                      variant='ghost'
                    >
                      {account.displayName}
                      {tBalance ? ` (${tBalance} ${TOKENS[appChain.id]})` : ''}
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};
