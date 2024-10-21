/* eslint-disable react-hooks/exhaustive-deps */
// Header.tsx
'use client';
import type React from 'react';
import { useEffect } from 'react';
import BrandLogo from '../svg/brand-logo';
import Image from 'next/image';
import BrandText from '@/public/img/brand-text.png';
import { useSwitchChain } from 'wagmi';
import { useChain } from '@azuro-org/sdk';
import type { ChainId } from '@azuro-org/toolkit';
// import { ConnectBtn } from '../connect-btn';
import { useAppDispatch } from '@/redux/redux-provider';
import { setChainId } from '@/redux/slices/wallet.slice';
import { chains } from '@/lib/chains';
import { chiliz } from 'wagmi/chains';
import { useToast } from '@/components/ui/use-toast';
import { ConnectBtn } from '@/components/connect-btn';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setAppChainId, appChain } = useChain();
  const { switchChainAsync } = useSwitchChain();
  const { toast } = useToast();

  useEffect(() => {
    const handleChainSwitch = async () => {
      if (appChain.id) {
        const isSupported =
          chains.findIndex((chain) => chain.id === appChain.id) > -1;

        if (isSupported) {
          dispatch(setChainId(appChain.id));
          setAppChainId(appChain.id as ChainId);
        } else {
          try {
            await switchChainAsync({ chainId: chiliz.id });
            toast({
              title: 'Network Switched',
              description: 'Successfully switched to Chiliz network.',
            });
          } catch (error) {
            console.error('Failed to switch network:', error);
            toast({
              title: 'Network Switch Failed',
              description: 'Please switch to Chiliz network manually.',
              variant: 'destructive',
            });
          }
        }
      }
    };

    handleChainSwitch();
  }, [appChain.id, dispatch, setAppChainId, switchChainAsync, toast]);

  return (
    <>
      <header
        className='h-[65px] w-full max-w-md mx-auto px-4 flex items-center justify-between fixed z-[100] top-0 left-0 right-0 rounded-b-[24px]'
        id='header'
      >
        <div className='flex items-center gap-x-[6px]'>
          <BrandLogo />
          <Image alt='brandtext' className='w-auto h-[15px]' src={BrandText} />
        </div>
        <ConnectBtn classVal='w-[150px] h-[40px] disabled:bg-[#787878] rounded-[16px] bg-white text-black text-[16px] font-normal py-[8px] px-4 my-auto' />
        {/* <ConnectBtn classVal='w-[150px] h-[40px] disabled:bg-[#787878] rounded-[16px] bg-white text-black text-[16px] font-normal py-[8px] px-4 my-auto' /> */}
      </header>
      <div className='h-[65px]' />
    </>
  );
};

export default Header;
