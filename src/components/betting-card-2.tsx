import Image from 'next/image';
import type React from 'react';
import BetVsImg from '@/public/svg/bet-vs.svg';
import { defaultTeamLogo } from '@/lib/constants';
import type { GameCardProps } from '@/types/global.types';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const BettingCard2: React.FC<{
  gameData: GameCardProps;
  isCurrent: boolean;
  isGameInLive: boolean;
  isLessMobile: boolean;
}> = ({ gameData, isLessMobile, isCurrent }) => {
  const router = useRouter();
  const cardRef = useRef(null);
  // const isInView = useInView(cardRef);

  // const [date, month, time] = gameData.dateTime.split(' ');
  const participants = gameData.participants;

  return (
    <div
      className={`relative mx-auto ${isLessMobile ? 'h-[375px]' : 'h-[416px]'} ${isCurrent ? 'min-[390px]:h-[440px]' : 'min-[390px]:h-[380px] overflow-hidden'} w-full flex flex-col max-w-[500px] before:!top-[28px] min-[440px]:before:!top-[3px] cursor-pointer`}
      id='bettingCard2'
      onClick={() => router.push(`/event/${gameData.id}`)}
      ref={cardRef}
    >
      <div className='absolute z-[2] bg-black flex-center h-[42px] w-[42px] min-[390px]:h-[45px] min-[390px]:w-[45px] rounded-full left-[50%] top-[52%] min-[390px]:top-[50.5%] translate-x-[-50%] translate-y-[-50%] '>
        <Image
          alt='vs'
          className='w-[20px] h-auto object-contain'
          src={BetVsImg}
        />
      </div>
      <div className={`layer1 ${isLessMobile ? 'h-[240px]' : 'h-[288px]'}`}>
        <span className='text-[30px] text-black font-medium line-clamp-2 mt-10 ml-8 font-[inter] max-w-[50%]'>
          {participants[0]}
        </span>
        <div className='w-[55px] h-[32px] rounded-full mt-4 p-2 text-center ml-8 rounded-[8px] bg-[url("/img/bg-pattern.png")] bg-cover bg-center text-black text-center text-[10px] shadow-sm'>
          {gameData.markets?.[0]?.outcomeRows[0][0]?.odds?.toFixed(2)}
        </div>
      </div>
      <div
        className={`layer2 ${isLessMobile ? 'h-[240px]' : 'h-[288px]'} absolute inset-0 translate-y-[140px] min-[390px]:translate-y-[154px]`}
      >
        <div className='relative flex flex-col justify-start items-end h-fit mt-24'>
          <div className='w-[55px] h-[32px] rounded-full mb-4 p-2 text-center mr-8 rounded-[8px] bg-[url("/img/bg-pattern.png")] bg-cover bg-center text-black text-center text-[10px] shadow-sm'>
            {gameData.markets?.[0]?.outcomeRows[0][1]?.odds?.toFixed(2)}
          </div>
          <span className='text-[30px] text-white text-right mr-8 font-medium font-[inter] max-w-[55%] line-clamp-2'>
            {participants[1]}
          </span>
        </div>
      </div>
      <Team
        className='absolute top-[75px] right-[20px] z-10 cardViewTeam'
        isInView={isCurrent}
        teamImg={gameData.teamImage[0] ?? ''}
      />

      <Team
        className='absolute bottom-[75px] left-[20px] z-10 cardViewTeam'
        isInView={isCurrent}
        teamImg={gameData.teamImage[1] ?? ''}
      />
      {/* <div className='absolute bottom-8 left-4 flex flex-col items-start max-w-[45%] truncate'>
        <div className='flex items-center gap-x-1 mb-1'>
          <Icon
            className='w-[15px] h-auto text-[#F9F9F9] opacity-60'
            slug={gameData.sportSlug as keyof typeof sportIcons}
          />
          <span className='text-[#F9F9F9] opacity-[0.64] text-xs capitalize'>
            {gameData.sport}
          </span>
        </div>
        <div className='flex items-center gap-x-3 !text-xs'>
          {isGameInLive ? (
            <LiveIndicator />
          ) : (
            <GameTime date={date} month={month} time={time} />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default BettingCard2;

export const Team: React.FC<{
  teamImg: string;
  className: string;
  outcome?: any;
  isInView: boolean;
}> = ({ teamImg, className, outcome, isInView }) => {
  return (
    <motion.div
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      className={`w-[25%] max-h-[150px] h-full bg-white rounded-t-full rounded-b-full shrink-0 before:content-[''] ${className}`}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className='relative w-full h-full bg-white rounded-t-full rounded-b-full'>
        {/* eslint-disable-next-line */}
        <img
          alt='team'
          className='object-contain !w-[70%] !h-auto absolute !top-1/2 -translate-y-[50%] !left-1/2 -translate-x-1/2  mx-auto'
          onError={(e) => {
            e.currentTarget.src = defaultTeamLogo;
            e.currentTarget.classList.add('invert-[0.5]');
          }}
          src={teamImg || defaultTeamLogo}
        />
      </div>
      {outcome && (
        <div className='w-[85%] h-[20px] rounded-b-full mx-auto bg-[rgb(249_249_249/0.7)] absolute bottom-[5%] left-[50%] -translate-x-[50%] text-black text-center flex-center text-[10px] backdrop-blur-[8px] shadow-sm'>
          {outcome.odds.toFixed(2)}
        </div>
      )}
    </motion.div>
  );
};
