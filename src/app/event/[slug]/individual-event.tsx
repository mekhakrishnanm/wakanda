// app/event/[slug]/page.tsx
'use client';
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import {
  GameStatus,
  type Market,
  type GameQuery,
  type MarketOutcome,
} from '@azuro-org/toolkit';
import { Team, GameInfo } from '@/components/betting-card';
import Icon, { type sportIcons } from '@/components/svg/sport';
import { Button } from '@/components/ui/button';
import { IndividualEventSkeleton } from '@/components/layouts/event-loading-layout';
import InfoIcon from '@/public/svg/info.svg';
import AnimatedBetCard from '@/components/event/animated-bet-card';
import PlacedBets from '@/components/event/placed-bets';
import { useGameMarkets } from '@/hooks/useGameMarkets';
import ShareButton from '@/components/share-btn';

type EventInfoProps = {
  game: GameQuery['games'][0];
  gameStatus: GameStatus;
  isGameInLive: boolean;
  isCorrectChain: boolean;
};

const IndividualEvent: React.FC<EventInfoProps> = React.memo(
  ({ game, gameStatus, isGameInLive }) => {
    const [isLoading, setIsLoading] = useState(true);

    const status = useMemo(
      () => ({ [game.gameId]: isGameInLive }),
      [game.gameId, isGameInLive]
    );

    const { markets, loading: isMarketsLoading } = useGameMarkets({
      gameIds: [game.gameId],
      gameStatuses: status,
      livePollInterval: gameStatus === GameStatus.Live ? 10000 : undefined,
    });

    const {
      gameId,
      sport: { slug: sportSlug },
      startsAt,
      participants,
      title,
      league: {
        name: leagueName,
        country: { name: countryName },
      },
    } = game;

    const participantsList = useMemo(
      () =>
        title
          ? title.split(' – ')
          : participants.map((participant) => participant.name),
      [title, participants]
    );

    const dateTime = useMemo(
      () => dayjs(+startsAt * 1000).format('DD MMMM HH:mm'),
      [startsAt]
    );

    const [date, month, time] = useMemo(() => dateTime.split(' '), [dateTime]);
    const bettingSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    // const scrollToTop = useCallback(() => {
    //   if (typeof window === 'object') {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    //   }
    // }, []);
    const scrollToBettingSection = useCallback(() => {
      if (bettingSectionRef.current) {
        bettingSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, []);

    if (isLoading || isMarketsLoading) {
      return <IndividualEventSkeleton />;
    }

    const firstMarket = markets[0];
    const outcomeRows = firstMarket?.outcomeRows || [];
    const firstOutcomeRow = outcomeRows[0] || [];

    return (
      <div ref={bettingSectionRef}>
        <EventCard
          countryName={countryName}
          date={date}
          gameStatus={gameStatus}
          leagueName={leagueName}
          leftOutcome={firstOutcomeRow[0] as MarketOutcome}
          month={month}
          participants={participants}
          participantsList={participantsList}
          rightOutcome={
            firstOutcomeRow[firstOutcomeRow.length - 1] as MarketOutcome
          }
          sportSlug={sportSlug}
          time={time}
        />

        <h2 className='text-center text-[20px] my-[6px] font-normal tracking-wide'>
          Who will win?
        </h2>

        <BettingSection
          isCorrectChain
          isGameInLive
          markets={markets}
          participants={participants}
        />

        <PlacedBets
          gameId={gameId}
          outcomes={firstOutcomeRow as MarketOutcome[]}
        />

        <ShareButton game={game} gameId={gameId} />
        <Button
          className='btn-1 h-[56px] w-full max-w-md mx-auto rounded-[16px] flex justify-center items-center space-x-3 mt-4'
          onClick={scrollToBettingSection}
          variant={'default'}
        >
          <span className='text-[20px] font-medium'>Bet Now!</span>
        </Button>
      </div>
    );
  }
);

const EventCard = React.memo(
  ({
    leftOutcome,
    rightOutcome,
    participants,
    date,
    month,
    time,
    sportSlug,
    gameStatus,
    participantsList,
    countryName,
    leagueName,
  }: {
    leftOutcome: MarketOutcome;
    rightOutcome: MarketOutcome;
    participants: GameQuery['games'][0]['participants'];
    date: string;
    month: string;
    time: string;
    sportSlug: string;
    gameStatus: GameStatus;
    participantsList: string[];
    countryName: string;
    leagueName: string;
  }) => (
    <div className='event-card mx-auto max-w-md my-[26px] w-full flex flex-col justify-between p-2 rounded-[16px]'>
      <div className='justify-between p-2 h-[128px] flex'>
        <Team
          activeLeft
          outcome={leftOutcome}
          teamImg={participants[0]?.image ?? ''}
        />
        <GameInfo
          date={date}
          isLive={gameStatus === GameStatus.Live}
          month={month}
          participants={participantsList}
          sport={sportSlug}
          sportSlug={sportSlug}
          time={time}
        />
        <Team
          activeRight
          outcome={rightOutcome}
          teamImg={participants[1]?.image ?? ''}
        />
      </div>
      <LeagueInfo
        countryName={countryName}
        leagueName={leagueName}
        sportSlug={sportSlug}
      />
    </div>
  )
);

const BettingSection = React.memo(
  ({
    markets,
    isCorrectChain,
    isGameInLive,
    participants,
  }: {
    markets: Market[];
    isCorrectChain: boolean;
    isGameInLive: boolean;
    participants: GameQuery['games'][0]['participants'];
  }) =>
    markets[0]?.outcomeRows[0]?.length > 0 ? (
      <AnimatedBetCard
        isCorrectChain={isCorrectChain}
        isLiveBet={isGameInLive}
        outcomeRows={(markets[0]?.outcomeRows ?? []) as MarketOutcome[][]}
        participants={participants}
      />
    ) : (
      <div className='event-card max-w-md mx-auto mt-8 tracking-wider font-medium flex flex-col w-full h-[128px] justify-center items-center p-4 rounded-[16px] text-sm text-white/60'>
        <Image alt='active' className='mb-2' quality={100} src={InfoIcon} />
        Betting is not available for this game at this time.
      </div>
    )
);

export const LeagueInfo: React.FC<{
  countryName: string;
  leagueName: string;
  sportSlug: string;
}> = ({ countryName, leagueName, sportSlug }) => (
  <div className='flex justify-between p-2 h-[68px] bg-[#ffffff0a] rounded-b-[16px]'>
    <div className='flex w-full justify-between items-center pr-2'>
      <div className='flex flex-col gap-y-1'>
        <span className='text-[16px]'>{countryName}</span>
        <span className='text-xs opacity-60 tracking-[1px]'>{leagueName}</span>
      </div>
      <Icon
        className='text-white opacity-60 w-6 h-auto'
        slug={sportSlug as keyof typeof sportIcons}
      />
    </div>
  </div>
);

export default IndividualEvent;
