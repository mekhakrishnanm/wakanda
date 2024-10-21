import React from 'react';
import BetHistoryIcon from './svg/bet-history-icon';
import { type Bet, useChain } from '@azuro-org/sdk';
import { TOKENS } from '@/lib/chains';
import { getDisplayAmount } from '@/lib/balance';

const BetHistoryHighlights = ({ bets }: { bets: Bet[] }) => {
  const { appChain } = useChain();
  const betsSummary = bets.reduce(
    (acc, item) => {
      const amount = Number(item.amount);
      const winAmount = item.isWin ? Number(item.possibleWin) - amount : 0;
      return {
        totalWon: acc.totalWon + (item.isWin ? 1 : 0),
        totalLoss: acc.totalLoss + (item.isLose ? 1 : 0),
        totalAmount: acc.totalAmount + amount,
        totalWinAmount: acc.totalWinAmount + winAmount,
        totalLossAmount: acc.totalLossAmount + (item.isLose ? amount : 0),
      };
    },
    {
      totalAmount: 0,
      totalWon: 0,
      totalLoss: 0,
      totalWinAmount: 0,
      totalLossAmount: 0,
    }
  );

  const profitLoss = betsSummary.totalWinAmount - betsSummary.totalLossAmount;
  const isProfitable = profitLoss > 0;

  return (
    <div
      className={`${isProfitable ? 'bet-history-highlights-won' : 'bet-history-highlights-loss'} mt-4 flex flex-col w-full h-[175px] rounded-[24px] p-2`}
    >
      <div className='flex justify-start items-center gap-x-[24px] w-full h-[80px] rounded-[16px] py-2 px-6 bg-[#ffffff0a]'>
        <BetHistoryIcon isLoss={!isProfitable} />
        <div className='flex flex-col'>
          <span className='text-white opacity-40 text-[11px]'>TOTAL BETS</span>
          <div className='mt-2 flex text-white items-center text-[20px]'>
            <span>{bets.length}</span>{' '}
            <span className='opacity-40 ml-1'>Bets</span>{' '}
            <span className='w-[1px] h-[1px] rounded-full bg-white shrink-0 mx-3' />
            <span>{getDisplayAmount(betsSummary.totalAmount)}</span>{' '}
            <span className='opacity-40 ml-1'>{TOKENS[appChain.id]}</span>
          </div>
        </div>
      </div>

      <div className='w-full flex items-center justify-center gap-x-6 text-white grow py-4'>
        <div className='flex flex-col gap-y-[6px]'>
          <span className='text-[11px] opacity-40 tracking-widest'>
            WINS / LOSSES
          </span>
          <div className='flex gap-x-1 text-[20px]'>
            <span>{betsSummary.totalWon}</span>
            <span className='opacity-40'>/</span>
            <span>{betsSummary.totalLoss}</span>
          </div>
        </div>
        <div
          className='h-full w-[1px] border-r border-[#ffffff14]'
          style={{ boxShadow: '1px 0px 0px 0px #0000003d' }}
        />
        <div className='flex flex-col gap-y-[6px]'>
          <span className='text-[11px] opacity-40 tracking-widest'>
            {isProfitable ? 'PROFIT' : 'LOSS'}
          </span>
          <div className='flex items-center gap-x-2 text-[20px]'>
            {getDisplayAmount(Math.abs(profitLoss))}
            <span className='opacity-40'>{TOKENS[appChain.id]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BetHistoryHighlights);
