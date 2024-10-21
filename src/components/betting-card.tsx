'use client';
import type React from 'react';
import { useEffect } from 'react';
import { useBaseBetslip, useSelection } from '@azuro-org/sdk';
import type { GameCardProps, GameTeamItemType } from '@/types/global.types';
import { defaultTeamLogo } from '@/lib/constants';
import Icon, { type sportIcons } from './svg/sport';
import type { MarketOutcome } from '@azuro-org/toolkit';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/redux-provider';
import { setTeamBSelected } from '@/redux/slices/events-slice';

const BettingCard = ({
  gameData,
  isGameInLive,
}: {
  gameData: GameCardProps;
  isGameInLive: boolean;
}) => {
  const { clear } = useBaseBetslip();

  useEffect(() => {
    clear();
  }, [clear]);

  const [date, month, time] = gameData.dateTime.split(' ');

  const participants = gameData.title.split(' – ');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const outcomes = gameData.markets?.[0]?.outcomeRows[0];
  return (
    <button
      className='betting-card w-full h-[128px] max-w-md mx-auto flex justify-between p-4 rounded-[16px]'
      onClick={() => router.push(`/event/${gameData.id}`)}
      type='button'
    >
      <Team
        activeLeft
        onClick={() => dispatch(setTeamBSelected(false))}
        outcome={outcomes[0]}
        teamImg={gameData.teamImage[0] ?? ''}
      />
      <GameInfo
        date={date}
        isLive={isGameInLive}
        month={month}
        participants={participants}
        sport={gameData.sport}
        sportSlug={gameData.sportSlug}
        time={time}
      />
      <Team
        activeRight
        onClick={() => dispatch(setTeamBSelected(true))}
        outcome={outcomes[outcomes.length - 1]}
        teamImg={gameData.teamImage[1] ?? ''}
      />
    </button>
  );
};

export const GameInfo: React.FC<{
  sport: string;
  sportSlug: string;
  isLive: boolean;
  date: string;
  month: string;
  time: string;
  participants: string[];
  status?: string;
}> = ({
  sport,
  sportSlug,
  isLive,
  date,
  month,
  time,
  participants,
  status,
}) => (
  <div className='flex-center flex-col px-1'>
    <div className='flex-center gap-x-1'>
      <Icon
        className='w-[9%] mr-1 h-auto text-[#F9F9F9] opacity-60'
        slug={sportSlug as keyof typeof sportIcons}
      />
      <span className='text-[#F9F9F9] opacity-[0.64] text-xs capitalize'>
        {sport}
      </span>
    </div>
    <div className='text-white max-h-[50px] text-[16px] text-center leading-[20px] mt-2 flex flex-col justify-center items-center gap-y-1'>
      {participants.map((participant) => (
        <div
          className={`${participants.length > 1 ? 'truncate' : ''} max-w-[190px]`}
          key={participant}
        >
          {participant}
        </div>
      ))}
    </div>
    <div className='flex items-center gap-x-3 mt-3'>
      {isLive ? (
        <LiveIndicator />
      ) : (
        <GameTime date={date} month={month} time={time} />
      )}
    </div>
    {status && (
      <div className='flex items-center gap-x-3 mt-3'>
        <span
          className={`text-[14px] uppercase font-medium tracking-wider ${status === 'WON' ? 'text-[#34C759]' : 'text-white'}`}
        >
          {status}
        </span>
      </div>
    )}
  </div>
);

export const LiveIndicator: React.FC = () => (
  <>
    <span className='relative flex h-3 w-3'>
      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F15B7A] opacity-75' />
      <span className='relative inline-flex rounded-full h-3 w-3 bg-[#F15B7A]' />
    </span>
    <span className='text-[#F15B7A] text-[11px] uppercase font-medium tracking-wider'>
      Live
    </span>
  </>
);

function OddButton({ outcome }: { outcome: MarketOutcome }) {
  const { odds, isOddsFetching } = useSelection({
    selection: outcome,
    initialOdds: outcome.odds,
    initialStatus: outcome.status,
  });

  return (
    <div className='w-[85%] h-[20px] rounded-b-full mx-auto bg-[rgb(249_249_249/0.7)] absolute bottom-[5%] left-[50%] -translate-x-[50%] text-black text-center flex-center text-[10px] backdrop-blur-[8px] shadow-sm'>
      {isOddsFetching ? '--' : odds.toFixed(2)}
    </div>
  );
}

export const GameTime: React.FC<{
  date: string;
  month: string;
  time: string;
}> = ({ date, month, time }) => (
  <div className='flex items-center gap-x-1 opacity-60 tracking-[1px]'>
    <span className='text-xs'>{`${date} ${month}`}</span>
    <span className='w-[2px] h-[2px] bg-[#F9F9F9] rounded-full shrink-0' />
    <span className='text-xs'>{time}</span>
  </div>
);

export const Team: React.FC<GameTeamItemType> = ({
  activeLeft,
  activeRight,
  outcome,
  won,
  teamImg,
  onClick,
}) => {
  return (
    <div
      className={`relative w-[18%] max-h-[120px] h-full ${won ? 'bg-white' : 'bg-[rgb(255_255_255/4%)]'} rounded-t-full rounded-b-full shrink-0`}
      onClick={onClick}
    >
      {activeLeft && (
        <div className='absolute w-[6px] h-[6px] rounded-full bg-primary top-0 left-0' />
      )}
      {activeRight && (
        <div className='absolute w-[6px] h-[6px] rounded-full bg-secondary top-0 right-0' />
      )}
      <div className='relative w-full h-full'>
        {/* eslint-disable-next-line */}
        <img
          alt='team'
          className='object-contain !w-[70%] !h-auto absolute !top-1/2 -translate-y-[70%] !left-1/2 -translate-x-1/2  mx-auto'
          onError={(e) => {
            e.currentTarget.src = defaultTeamLogo;
            e.currentTarget.classList.add('invert-[0.5]');
          }}
          src={teamImg || defaultTeamLogo}
        />
      </div>
      {outcome && <OddButton outcome={outcome} />}
      {won && (
        <div className='w-[85%] h-[20px] rounded-b-full mx-auto absolute bottom-[5%] left-[50%] -translate-x-[50%] text-black text-center flex-center text-[10px] backdrop-blur-[8px] shadow-sm'>
          <Image
            alt='active'
            className='mx-auto w-[16px] h-[16px] m-auto pointer-events-none transition-transform duration-300 ease-in-out hover:scale-110'
            height={16}
            src='/svg/check.svg'
            width={16}
          />
        </div>
      )}
    </div>
  );
};
export default BettingCard;
