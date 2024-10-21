'use client';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { type Bet, useLiveBets, usePrematchBets } from '@azuro-org/sdk';
import { OrderDirection } from '@azuro-org/toolkit';
import BetHistoryCard from '@/components/bet-history-card';
import BetHistoryHighlights from '@/components/bet-history-highlights';
import RedeemAll from './redeem-all';
import IndividualBetSummaryModal from './individual-bet-summary-modal';
import InfoIcon from '@/public/svg/info.svg';
import Image from 'next/image';
import type { Address } from 'viem';
import BetHistoryPageSkeleton from '@/components/layouts/bet-history-loading-layout';

const useBets = (address: string) => {
  const props = {
    filter: { bettor: (address as Address) || '0x' },
    orderDir: OrderDirection.Desc,
  };

  const { loading: isPrematchLoading, bets: prematchBets } =
    usePrematchBets(props);
  const { loading: isLiveLoading, bets: liveBets } = useLiveBets(props);

  const allBets = useMemo(() => {
    return [...liveBets, ...prematchBets].sort(
      (betA, betB) => betB.createdAt - betA.createdAt
    );
  }, [prematchBets, liveBets]);

  return {
    isLoading: isPrematchLoading || isLiveLoading,
    allBets,
  };
};

const BetList = React.memo(({ bets }: { bets: Array<Bet> }) => (
  <div className='flex flex-col gap-y-2'>
    {bets.map((bet) => (
      <BetHistoryCard bet={bet} key={bet.txHash} />
    ))}
  </div>
));

const IndexClients = () => {
  const { address } = useAccount();
  const { isLoading, allBets } = useBets(address as Address);

  if (isLoading) {
    return <BetHistoryPageSkeleton />;
  }

  return (
    <main className='px-4 pb-[128px] pt-8 max-w-md mx-auto' id='bet-history'>
      <h2 className='text-2xl font-[450]'>Bet History</h2>
      <BetHistoryHighlights bets={allBets} />
      <RedeemAll bets={allBets} />
      {allBets.length === 0 ? (
        <div className='event-card max-w-md mx-auto mt-8 tracking-wider font-medium flex flex-col w-full h-[128px] justify-center items-center p-4 rounded-[16px] text-sm text-white/60'>
          <Image alt='active' className='mb-2' quality={100} src={InfoIcon} />
          No Bets Placed Yet
        </div>
      ) : (
        <BetList bets={allBets} />
      )}
      <IndividualBetSummaryModal />
    </main>
  );
};

export default IndexClients;
