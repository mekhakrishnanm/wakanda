// app/index-clients.tsx
'use client';
import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import BettingCard from '@/components/betting-card';
import EventsFilter, { type Sport } from '@/components/events-filter';
import { createPortal } from 'react-dom';
import type { GameCardProps } from '@/types/global.types';
import BettingCard2 from '@/components/betting-card-2';
import { useRouter } from 'next/navigation';
import EventsLoadingLayout from '@/components/layouts/events-loading-layout';
import { useGames } from '@/hooks/useGames';
import { useChain, useSportsNavigation } from '@azuro-org/sdk';
import InfoIcon from '@/public/svg/info.svg';
import Image from 'next/image';
import { useAppSelector } from '@/redux/redux-provider';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useSwipeable } from 'react-swipeable';
import EventIndexClients from './event/[slug]/index-clients';
import { AnimatePresence, motion } from 'framer-motion';

const IndexClients: React.FC<{
  searchTerm: string;
  filterType: string;
  selectedSport: string[];
  isLive: boolean;
}> = React.memo(({ searchTerm, filterType, selectedSport, isLive }) => {
  const { isBettingCardView } = useAppSelector((state) => state.events);
  const { appChain } = useChain();
  const router = useRouter();

  const handleFilterChange = (
    newSearchTerm: string,
    newFilterType: string,
    newSelectedSport: string[]
  ) => {
    const searchParams = new URLSearchParams({
      searchTerm: newSearchTerm,
      filterType: newFilterType,
      selectedSport: newSelectedSport.join(','),
    });
    router.push(`/?${searchParams.toString()}`);
  };
  if (appChain.id === 88888 && filterType === 'Live') {
    filterType = 'All';
    handleFilterChange(searchTerm, filterType, selectedSport);
  }
  const { loading: isSportsLoading, sports } = useSportsNavigation({
    withGameCount: true,
  });

  const {
    topEvents,
    otherEvents,
    loading: isGamesLoading,
  } = useGames({
    searchTerm: searchTerm,
    filterType: filterType,
    selectedSports: selectedSport.includes('All') ? [] : selectedSport,
  });
  // check if there are any games in the list( Not empty)
  const isEmpty = useMemo(() => {
    return !topEvents.length && !Object.keys(otherEvents).length;
  }, [topEvents, otherEvents]);

  return isGamesLoading || isSportsLoading ? (
    <EventsLoadingLayout isCardView={isBettingCardView} />
  ) : (
    <main
      className={`${isBettingCardView ? 'px-0' : 'px-4'} pb-[98px] pt-[16vh] max-w-md mx-auto h-screen -mt-[65px]`}
    >
      {isEmpty ? (
        <div className='event-card max-w-md mx-auto mt-8 tracking-wider font-medium flex flex-col w-full h-[128px] justify-center items-center p-4 rounded-[16px] text-sm text-white/60'>
          <Image alt='active' className='mb-2' quality={100} src={InfoIcon} />
          No Events Found
        </div>
      ) : isBettingCardView ? (
        <GamesCardView isLive={isLive} otherEvents={otherEvents} />
      ) : (
        <GamesList
          isLive={isLive}
          otherEvents={otherEvents}
          topEvents={topEvents}
        />
      )}

      {typeof window === 'object' &&
        createPortal(
          <EventsFilter
            filterType={filterType}
            isSportsLoading={isSportsLoading}
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            selectedSport={selectedSport}
            sports={sports as unknown as Sport[]}
          />,
          document.body
        )}
    </main>
  );
});

const GamesCardView: React.FC<{
  otherEvents: Record<string, GameCardProps[]>;
  isLive: boolean;
}> = React.memo(({ otherEvents, isLive }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLessMobile, setIsLessMobile] = useState<boolean>(false);
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [selectedCardGame, setSelectedCardGame] =
    useState<GameCardProps | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [startScrollTop, setStartScrollTop] = useState<number>(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on('reInit', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const updateCarouselWidth = () => {
      if (containerRef.current) {
        setIsLessMobile(containerRef.current.offsetHeight < 540);
      }
    };
    updateCarouselWidth();
    window.addEventListener('resize', updateCarouselWidth);
    return () => window.removeEventListener('resize', updateCarouselWidth);
  }, []);

  const allEvents = useMemo(
    () => [...Object.values(otherEvents).flat()],
    [otherEvents]
  );

  const handleSwipeUp = useCallback(
    (index: number) => {
      setSelectedCardGame(allEvents[index]);
      setIsCardDrawerOpen(true);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      if (drawerRef.current) {
        drawerRef.current.style.transform = '';
      }
    },
    [allEvents]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setStartScrollTop(e.currentTarget.scrollTop);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null || !drawerRef.current) {
      return;
    }
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    const currentScrollTop = e.currentTarget.scrollTop;

    if (diff < -30 && currentScrollTop <= 0 && startScrollTop <= 0) {
      e.preventDefault();
      drawerRef.current.style.transform = `translateY(${-diff}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startY === null || !drawerRef.current) {
      return;
    }
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (diff < -50 && e.currentTarget.scrollTop <= 0) {
      setIsCardDrawerOpen(false);
    }
    drawerRef.current.style.transform = '';
    setStartY(null);
  };

  useEffect(() => {
    if (!isCardDrawerOpen) {
      if (drawerRef.current) {
        drawerRef.current.style.transform = '';
      }
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [isCardDrawerOpen]);

  return (
    <div className='w-full h-full relative' ref={containerRef}>
      <Carousel
        className='mx-auto w-full h-full'
        opts={{
          align: 'center',
          loop: false,
          skipSnaps: true,
          containScroll: 'trimSnaps',
        }}
        setApi={setApi}
      >
        <CarouselContent className=''>
          {allEvents.map((game, index) => (
            <CarouselItem
              className='first:basis-[93%] first:!pl-[5%] !pl-0 basis-[85%] transition-all duration-300 ease-in-out'
              key={`${game.id}-${index}`}
            >
              <SwipeableCard
                game={game}
                index={index}
                isCurrent={current === index}
                isLessMobile={isLessMobile}
                isLive={isLive}
                onSwipeUp={handleSwipeUp}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
      <AnimatePresence>
        {isCardDrawerOpen && (
          <motion.div
            animate={{ y: 0 }}
            className='fixed bottom-0 left-0 right-0 bg-background max-w-md mx-auto'
            exit={{ y: '100%' }}
            initial={{ y: '100%' }}
            ref={drawerRef}
            style={{ zIndex: 20, height: '86vh' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className='h-1 w-16 bg-gray-600 mx-auto rounded-full mt-2'
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
            />
            <div
              className='px-4 overflow-y-auto h-[calc(100%-20px)] pb-28 mt-4'
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
              ref={contentRef}
            >
              {isCardDrawerOpen && selectedCardGame && (
                <EventIndexClients
                  gameIdVal={selectedCardGame.id}
                  key={selectedCardGame.id}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const SwipeableCard: React.FC<{
  isCurrent: boolean;
  game: GameCardProps;
  index: number;
  isLive: boolean;
  isLessMobile: boolean;
  onSwipeUp: (index: number) => void;
}> = React.memo(
  ({ game, index, isLive, onSwipeUp, isCurrent, isLessMobile }) => {
    const handleSwipeUp = useCallback(() => {
      onSwipeUp(index);
    }, [onSwipeUp, index]);

    const swipeHandlers = useSwipeable({
      onSwipedUp: handleSwipeUp,
      trackMouse: true,
      trackTouch: true,
    });

    const [date, month, time] = game.dateTime.split(' ');

    const formatTime = () => {
      const timeArray = time.split(':');
      const hours = Number(timeArray[0]);
      const minutes = Number(timeArray[1]);
      const amPm = hours >= 12 ? 'PM' : 'AM';
      const hour = hours % 12 || 12;
      return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amPm}`;
    };

    return (
      <motion.div
        className={`flex flex-col justify-around h-full items-start p-1 space-y-2 
        transition-all duration-300 ease-in-out ${isCurrent ? '' : 'opacity-50 blur-sm scale-95'}
        ${
          isLessMobile ? 'w-[300px]' : 'w-full'
        } mx-auto relative overflow-hidden`}
        {...swipeHandlers}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className='flex mx-auto justify-between items-center w-full'>
          <div className='text-left'>
            <div className='text-white text-base'>{game.country}</div>
            <div className='flex flex-wrap whitespace-nowrap justify-start gap-x-2 items-center text-primary text-sm'>
              {game.league}{' '}
              <div className='w-[3px] h-[3px] bg-primary rounded-full shrink-0' />{' '}
              {game.sport}
            </div>
          </div>
          <div className='h-full p-2 flex justify-center flex-col text-white text-center rounded-[8px] bg-[url("/img/bg-pattern.png")] bg-cover bg-center'>
            <span>{`${month} ${date}`}</span>
            <span>{formatTime()}</span>
          </div>
        </div>
        <BettingCard2
          gameData={game}
          isCurrent={isCurrent}
          isGameInLive={isLive || game.isLive}
          isLessMobile={isLessMobile}
        />
      </motion.div>
    );
  }
);

const GamesList: React.FC<{
  topEvents: GameCardProps[];
  otherEvents: Record<string, GameCardProps[]>;
  isLive: boolean;
}> = React.memo(({ topEvents, otherEvents, isLive }) => (
  <div className='timeline-wrapper' id='betting-list-view'>
    <EventSection events={topEvents} isLive={isLive} title='Top Events' />
    {Object.entries(otherEvents).map(([sportName, events]) => (
      <EventSection
        events={events}
        isLive={isLive}
        key={sportName}
        title={sportName}
      />
    ))}
  </div>
));

const EventSection: React.FC<{
  title: string;
  events: GameCardProps[];
  isLive: boolean;
}> = React.memo(({ title, events, isLive }) => (
  <div className='timeLine mb-[30px] max-w-md mx-auto'>
    <div className='text-white ml-2 text-sm uppercase tracking-widest opacity-60 mb-[16px]'>
      {title}
    </div>
    <div className='flex flex-col gap-y-1.5'>
      {events.map((game, index) => (
        <BettingCard
          gameData={game}
          isGameInLive={isLive || game.isLive}
          key={`${game.id}-${index}`}
        />
      ))}
    </div>
  </div>
));

export default IndexClients;
