import React from 'react';
import Icon, { type sportIcons } from './svg/sport';
import { useChain, type Bet } from '@azuro-org/sdk';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { useAppDispatch } from '@/redux/redux-provider';
import { setSelectedBetSummary } from '@/redux/slices/events-slice';
import { getDisplayAmount } from '@/lib/balance';
import { TOKENS } from '@/lib/chains';
import { LiveIndicator } from './betting-card';

const BetHistoryCard = ({ bet }: { bet: Bet }) => {
  const dispatch = useAppDispatch();
  const { appChain } = useChain();
  const outcome = bet.outcomes[0];
  const game = outcome.game;
  const selectionNames = game.participants.map(
    (participant) => participant.name
  );

  const getStatusText = () => {
    if (bet.isWin) {
      return 'WON';
    }
    if (bet.isLose) {
      return 'LOST';
    }
    if (bet.isCanceled) {
      return 'CANCELLED';
    }
    if (bet.isRedeemable) {
      return 'REDEEMABLE';
    }
    if (bet.isRedeemed) {
      return 'REDEEMED';
    }
    return 'PENDING';
  };

  const getTitle = () => {
    const participants = game.participants.map(
      (participant) => participant.name
    );
    const selectionName = outcome.selectionName;
    if (selectionName === '1' || selectionName === selectionNames[0]) {
      return `${participants[0]} to win`;
    }
    if (
      selectionName === '2' ||
      selectionName === selectionNames[selectionNames.length - 1]
    ) {
      return `${participants[1]} to win`;
    }
    if (selectionName === 'X' || selectionName === selectionNames[1]) {
      return 'Match Draw';
    }
    return '';
  };

  const getAmountText = () => {
    if (bet.isWin || bet.isRedeemable || bet.isRedeemed) {
      return `+${getDisplayAmount(bet.possibleWin)} ${TOKENS[appChain.id]}`;
    }
    if (bet.isLose) {
      return `-${getDisplayAmount(bet.amount)} ${TOKENS[appChain.id]}`;
    }
    if (bet.isCanceled) {
      return `+${getDisplayAmount(bet.amount)} ${TOKENS[appChain.id]}`;
    }
    return '';
  };

  return (
    <button
      className={clsx(
        bet.isCanceled
          ? 'cancelled'
          : bet.isLose
            ? 'loss'
            : bet.isLive || bet.isRedeemable || bet.isRedeemed || bet.isWin
              ? 'won'
              : 'pending',
        'bet-history-card win relative flex items-start justify-between gap-x-4 w-full h-auto min-h-[108px] rounded-[16px] p-4'
      )}
      onClick={() => dispatch(setSelectedBetSummary(bet))}
      type='button'
    >
      <div className='flex items-start'>
        <Icon
          className='w-6 h-auto text-white opacity-40 mt-1'
          slug={bet.outcomes[0].game.sport.slug as keyof typeof sportIcons}
        />
        <div className='ml-4 text-left'>
          <span className='text-base font-medium text-white'>{getTitle()}</span>
          <div className='opacity-60 text-white text-xs flex items-center mt-2'>
            {dayjs(bet.createdAt * 1000).format('MMM DD • hh:mm A')}
          </div>
          <div className='opacity-60 text-white text-sm flex items-center mt-2'>
            {game.participants[0].name} • {game.participants[1].name}
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end justify-between h-full'>
        <span className='text-sm font-[450] opacity-60 text-right'>
          {getAmountText()}
        </span>
        <span
          className={clsx(
            'text-[11px] font-medium uppercase',
            bet.isWin ? 'text-[#34C759]' : 'text-white'
          )}
        >
          {bet.isLive ? (
            <div className='flex flex-col items-end gap-y-1'>
              {getStatusText()}
              <div className='flex items-center gap-x-3'>
                <LiveIndicator />
              </div>
            </div>
          ) : (
            getStatusText()
          )}
        </span>
      </div>
    </button>
  );
};

export default BetHistoryCard;
