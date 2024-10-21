import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/redux/redux-provider';
import { setBetSummaryModalOpen } from '@/redux/slices/events-slice';
import { GameInfo, Team } from '@/components/betting-card';
import { LeagueInfo } from '../event/[slug]/individual-event';
import { getDisplayAmount } from '@/lib/balance';
import { Button } from '@/components/ui/button';
import { type Bet, useChain, useRedeemBet } from '@azuro-org/sdk';
import { toast } from '@/components/ui/use-toast';
import { chains, TOKENS } from '@/lib/chains';
import Link from 'next/link';

const IndividualBetSummaryModal = () => {
  const { isBetSummaryModalOpen, selectedBetSummary } = useAppSelector(
    (state) => state.events
  );
  const dispatch = useAppDispatch();
  const { submit, isPending, isProcessing } = useRedeemBet();

  const closeModal = () => dispatch(setBetSummaryModalOpen(false));

  const outcome = selectedBetSummary?.outcomes[0];
  const game = outcome?.game;
  const participants = game?.participants || [];

  const dateTime = useMemo(() => {
    if (!game?.startsAt) {
      return { date: '', month: '', time: '' };
    }
    const formatted = dayjs(+game.startsAt * 1000).format('DD MMMM HH:mm');
    const [date, month, time] = formatted.split(' ');
    return { date, month, time };
  }, [game?.startsAt]);

  const getWinnerIndex = () => {
    const selectionNames =
      outcome?.game.participants.map((participant) => participant.name) ?? [];
    if (!outcome?.selectionName) {
      return -1;
    }
    return outcome.selectionName === '1' ||
      outcome.selectionName === selectionNames[0]
      ? 0
      : outcome.selectionName === '2' ||
          outcome.selectionName === selectionNames[selectionNames.length - 1]
        ? 1
        : -1;
  };

  const getStatusText = () => {
    if (!selectedBetSummary) {
      return 'PENDING';
    }
    if (selectedBetSummary.isWin) {
      return 'WON';
    }
    if (selectedBetSummary.isLose) {
      return 'LOST';
    }
    if (selectedBetSummary.isCanceled) {
      return 'CANCELLED';
    }
    if (selectedBetSummary.isLive) {
      return 'LIVE';
    }
    if (selectedBetSummary.isRedeemable) {
      return 'REDEEMABLE';
    }
    if (selectedBetSummary.isRedeemed) {
      return 'REDEEMED';
    }
    return 'PENDING';
  };

  const handleRedeem = async () => {
    if (!selectedBetSummary) {
      return;
    }

    try {
      await submit({
        bets: [
          {
            tokenId: selectedBetSummary.tokenId,
            coreAddress: selectedBetSummary.coreAddress,
          },
        ],
      });
      toast({
        title: 'Bet Redeemed',
        description: 'Your bet has been successfully redeemed.',
      });
      closeModal();
    } catch (error) {
      console.error('Error redeeming bet:', error);
      toast({
        title: 'Redeem Failed',
        description: 'There was an error redeeming your bet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isBetSummaryModalOpen || !selectedBetSummary) {
    return null;
  }

  return (
    <Dialog onOpenChange={closeModal} open={isBetSummaryModalOpen}>
      <DialogContent className='max-w-md max-h-[80svh] p-4 mx-auto before:[content("")] before:absolute before:inset-0 before:z-[-1] before:modalDefaultBg before:rounded-[inherit] rounded-[16px]'>
        <DialogHeader>
          <DialogTitle className='text-left'>Bet Details</DialogTitle>
        </DialogHeader>
        <div className='max-h-[calc(85svh-140px)] overflow-auto'>
          <div className='event-card mx-auto max-w-md mb-[26px] w-full flex flex-col justify-between p-2 rounded-[16px]'>
            <div className='justify-between p-2 h-[180px] flex items-center'>
              <Team
                activeLeft
                teamImg={participants[0]?.image ?? ''}
                won={getWinnerIndex() === 0}
              />
              {game && (
                <GameInfo
                  date={dateTime.date}
                  isLive={false}
                  month={dateTime.month}
                  participants={participants.map((p) => p.name)}
                  sport={game.sport.name}
                  sportSlug={game.sport.slug}
                  status={getStatusText()}
                  time={dateTime.time}
                />
              )}
              <Team
                activeRight
                teamImg={participants[1]?.image ?? ''}
                won={getWinnerIndex() === 1}
              />
            </div>
            <LeagueInfo
              countryName={game?.league.country.name ?? ''}
              leagueName={game?.league.name ?? ''}
              sportSlug={game?.sport.slug ?? ''}
            />
          </div>

          <BetDetails bet={selectedBetSummary} />
          {selectedBetSummary.isRedeemable &&
            !selectedBetSummary.isRedeemed && (
              <Button
                className='w-full h-[56px] disabled:bg-[#787878] rounded-[16px] bg-white text-black text-[20px] font-[450] py-[10px] px-4 my-4'
                disabled={isPending || isProcessing}
                onClick={handleRedeem}
                variant={'ghost'}
              >
                {isPending || isProcessing ? 'Processing...' : 'Redeem now'}
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BetDetails = ({ bet }: { bet: Bet }) => {
  const { appChain } = useChain();

  const getPayoutStatus = () => {
    if (bet.isWin) {
      return `${getDisplayAmount(bet.possibleWin)} ${TOKENS[appChain.id]} ${bet.isRedeemed ? 'Paid' : 'Win'}`;
    }
    if (bet.isLose) {
      return `${getDisplayAmount(bet.amount)} ${TOKENS[appChain.id]} Lost`;
    }
    if (bet.isCanceled) {
      return `${getDisplayAmount(bet.amount)} ${TOKENS[appChain.id]} ${bet.isRedeemed ? 'Refunded' : 'Claimable'}`;
    }
    return 'Pending';
  };

  return (
    <div className='event-card mx-auto max-w-md my-[26px] w-full flex flex-col justify-between p-6 rounded-[16px]'>
      <div className='grid grid-cols-3 gap-4 mb-4'>
        <DetailItem
          label='Amount'
          value={`${getDisplayAmount(bet.amount)} ${TOKENS[appChain.id]}`}
        />
        <DetailItem
          label='Odds'
          showFreeBet={Boolean(bet?.freebetId)}
          value={`${bet.totalOdds.toFixed(2)}x`}
        />
        <DetailItem
          label='Date'
          value={dayjs(bet.createdAt * 1000).format('MMM DD HH:mm')}
        />
      </div>
      <div className='grid grid-cols-3 gap-4 border-t border-[#F9F9F9]/10 pt-4'>
        <div className='col-span-2'>
          <DetailItem isLink label='Transaction Hash' value={bet.txHash} />
        </div>
        <div className='col-span-1'>
          <DetailItem
            label='Payout Status'
            value={getPayoutStatus()}
            valueClassName={bet.isWin ? 'text-green-500' : 'text-white'}
          />
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{
  label: string;
  value: string;
  isLink?: boolean;
  valueClassName?: string;
  showFreeBet?: boolean;
}> = ({ label, value, valueClassName = 'text-white', isLink, showFreeBet }) => {
  const { appChain } = useChain();
  const currentChain = chains.find((chain) => chain.id === appChain.id);
  return (
    <div>
      <p className='text-[14px] text-[#F9F9F9]'>{label}</p>
      {isLink ? (
        <Link
          className={`text-[16px] font-normal ${valueClassName}`}
          href={`${currentChain?.blockExplorers?.default.url}/tx/${value}`}
          target='_blank'
        >
          {`${value.slice(0, 6)}...${value.slice(-4)}`}
        </Link>
      ) : (
        <div>
          <p className={`text-[16px] font-normal ${valueClassName}`}>{value}</p>
          {showFreeBet && (
            <div className='bg-white w-fit font-medium text-black text-[14px] px-[6px] py-[0.5px] rounded-full cursor-pointer'>
              <span className='text-[13px] text-red-500'>Free</span>
              <span className='text-[13px]'>Bet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(IndividualBetSummaryModal);
