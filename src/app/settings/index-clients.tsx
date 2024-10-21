'use client';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MyWalletCard from './my-wallet-card';
import DiscordIcon from '@/components/svg/discord-icon';
import TelegramIcon from '@/components/svg/telegram-icon';
import { logout } from '../actions/logout';
import SettingsPageSkeleton from '@/components/layouts/settings-loading-layout';
import { useAppDispatch } from '@/redux/redux-provider';
import useBalances from '@/hooks/useBalances';
import type { Address } from 'viem';
import InfoModal from './info-modal';
import termsAndConditions from '@/public/terms-and-conditions.json';
import privacyPolicy from '@/public/privacy-policy.json';
import { ConnectBtn } from '@/components/connect-btn';

const SupportLink = React.memo(
  ({
    href,
    icon: Icon,
    text,
  }: {
    href: string;
    icon: React.ComponentType;
    text: string;
  }) => (
    <Link
      className='text-base font-[550] flex-center gap-x-2 h-[40px] w-full border border-[#ffffff2c] rounded-[12px] px-2 py-0'
      href={href}
      target='_blank'
    >
      <Icon /> {text}
    </Link>
  )
);

const useLogout = (disconnect: () => void) => {
  const { toast } = useToast();
  const router = useRouter();

  return useCallback(async () => {
    logout();
    disconnect();
    router.replace('/events');
    localStorage.removeItem('lastPWAPromptCancelTime');
    toast({
      title: 'Logged out',
      description: 'You have been logged out!',
      variant: 'destructive',
    });
  }, [disconnect, router, toast]);
};

const contractAddress = process.env.NEXT_PUBLIC_CHAIN_TOKEN_ADDRESS as Address;

const IndexClients = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const handleLogout = useLogout(disconnect);
  const dispatch = useAppDispatch();
  const { tBalance, nBalance, isBalanceFetching, isNativeBalanceFetching } =
    useBalances(address as Address, contractAddress, dispatch);

  return address && (isBalanceFetching || isNativeBalanceFetching) ? (
    <SettingsPageSkeleton />
  ) : (
    <main className='px-4 pb-[128px] pt-6 max-w-md mx-auto'>
      <h2 className='text-2xl font-[550]'>My Wallet</h2>
      {address ? (
        <MyWalletCard nBalance={nBalance} tBalance={tBalance} />
      ) : (
        <ConnectBtn />
      )}
      <h2 className='text-2xl font-[550] mt-[32px]'>Support</h2>
      <div className='flex gap-x-4 mt-3'>
        <SupportLink
          href='https://discord.com/invite/EyUYFcm5u3'
          icon={DiscordIcon}
          text='Discord'
        />
        <SupportLink
          href='https://t.me/Wakanda_Bet'
          icon={TelegramIcon}
          text='Telegram'
        />
      </div>
      <div className='w-full flex flex-col p-5 h-auto rounded-[24px] bg-[#ffffff0a] mt-5 pb-8'>
        <InfoModal data={termsAndConditions} title='Terms & Conditions'>
          <span className='text-primary text-base font-[450] mt-3'>
            Terms & Conditions
          </span>
        </InfoModal>
        <InfoModal data={privacyPolicy} title='Privacy Policy'>
          <span className='text-primary text-base font-[450] mt-3'>
            Privacy Policy
          </span>
        </InfoModal>

        {address && (
          <Button
            className='border border-[#ffffff2c] h-[48px] w-full rounded-[12px] flex justify-between items-center mt-10'
            onClick={handleLogout}
            variant={'ghost'}
          >
            <span>Logout</span>
            <ArrowRight />
          </Button>
        )}
      </div>
    </main>
  );
};

export default IndexClients;
