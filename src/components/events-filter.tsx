import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { ChevronDown, Flame, ListFilter, Search } from 'lucide-react';
import clsx from 'clsx';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { eventsFiltersByTime } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/redux/redux-provider';
import { setBettingCardView } from '@/redux/slices/events-slice';
import ListViewIcon from './svg/list-view-icon';
import CardViewIcon from './svg/card-view-icon';
import { cn } from '@/lib/utils';
import Icon, { type sportIcons } from './svg/sport';
import { useAccount } from 'wagmi';
import { Switch } from './ui/switch';
import { useRouter } from 'next/navigation';

const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className='relative'>
      <Input
        className='h-[48px] rounded-full text-base text-white font-medium !pl-10 p-3 bg-[#ffffff0a] border border-[#ffffff1f] focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={handleChange}
        placeholder='Search for events...'
        type='search'
        value={value}
      />
      <Search className='text-white opacity-60 w-5 h-auto absolute top-3.5 left-2.5' />
    </div>
  );
};

const TimeBadges = ({
  filterByTime,
  onFilterByTime,
}: {
  filterByTime: string;
  onFilterByTime: (text: string) => void;
}) => {
  const { chain } = useAccount();
  const filteredEvents = eventsFiltersByTime.filter(
    (item) => !(item.text === 'Live' && chain?.id === 88888)
  );
  return (
    <div className='flex gap-2 flex-wrap mt-6'>
      {filteredEvents.map((item) => (
        <Badge
          className='cursor-pointer flex justify-center items-center'
          data-active={filterByTime === item.text}
          key={item.id}
          onClick={() => onFilterByTime(item.text)}
          variant='default'
        >
          <span className='px-2'>{item.text}</span>
          {item.text === 'Live' && (
            <Flame className='w-5 h-auto animate-pulse text-red-500' />
          )}
        </Badge>
      ))}
    </div>
  );
};

export interface Sport {
  id: string;
  slug: string;
  name: string;
}

const SportBadges = ({
  loading,
  sortedSports,
  filterBySport,
  onFilterBySport,
}: {
  loading: boolean;
  sortedSports: Sport[];
  filterBySport: Set<string>;
  onFilterBySport: (slug: string) => void;
}) => (
  <div className='flex gap-2 flex-wrap mt-2 mb-[12vh]'>
    {loading ? (
      <span>Loading...</span>
    ) : (
      <>
        <Badge
          className=''
          data-active={filterBySport.has('All')}
          onClick={() => onFilterBySport('All')}
          variant='default'
        >
          <div className='flex items-center grow-0 max-w-max'>
            <span className='px-2'>All</span>
          </div>
        </Badge>
        {sortedSports?.map((item) => (
          <Badge
            className=''
            data-active={filterBySport.has(item.slug)}
            key={item.id}
            onClick={() => onFilterBySport(item.slug)}
            variant='default'
          >
            <div className='flex items-center grow-0 max-w-max'>
              <Icon
                className={clsx(
                  filterBySport.has(item.slug) ? 'text-black' : 'text-white',
                  'w-4 h-auto pb-0.5'
                )}
                slug={item.slug as keyof typeof sportIcons}
              />
              <span className='pl-1.5'>{item.name}</span>
            </div>
          </Badge>
        ))}
      </>
    )}
  </div>
);

const EventsFilter: React.FC<{
  searchTerm: string;
  filterType: string;
  selectedSport: string[];
  sports: Sport[];
  isSportsLoading: boolean;
  onFilterChange: (
    searchTerm: string,
    filterType: string,
    selectedSport: string[]
  ) => void;
}> = ({
  searchTerm,
  filterType,
  selectedSport,
  onFilterChange,
  sports,
  isSportsLoading,
}) => {
  const [isOpen, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isBettingCardView } = useAppSelector((state) => state.events);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilterType, setLocalFilterType] = useState(filterType);
  const [localSelectedSport, setLocalSelectedSport] = useState(
    new Set(selectedSport)
  );

  const sortedSports: Sport[] = useMemo(() => {
    return [...(sports || [])].sort((a, b) => a.name.localeCompare(b.name));
  }, [sports]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchTerm(value);
  }, []);

  const handleFilterByTime = useCallback(
    (text: string) => {
      setLocalFilterType(text === localFilterType ? 'All' : text);
    },
    [localFilterType]
  );

  const handleFilterBySport = useCallback((slug: string) => {
    setLocalSelectedSport((prev) => {
      if (slug === 'All') {
        return new Set(['All']);
      }

      const newSet = new Set(prev);
      newSet.delete('All');

      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }

      return newSet.size ? newSet : new Set(['All']);
    });
  }, []);

  const handleApply = useCallback(() => {
    onFilterChange(
      localSearchTerm,
      localFilterType,
      Array.from(localSelectedSport)
    );
    setOpen(false);
    document.body.style.overflow = '';
  }, [localSearchTerm, localFilterType, localSelectedSport, onFilterChange]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => {
      const newState = !prev;
      document.body.style.overflow = newState ? 'hidden' : '';
      return newState;
    });
  }, []);

  const [windowHeight, setWindowHeight] = useState('-52svh');

  useEffect(() => {
    if (window) {
      const handleResize = () => {
        if (window.innerHeight > 1100) {
          setWindowHeight('-56svh');
        } else if (window.innerHeight > 950) {
          setWindowHeight('-54svh');
        } else if (window.innerHeight > 800) {
          setWindowHeight('-52svh');
        } else if (window.innerHeight > 700) {
          setWindowHeight('-51svh');
        } else if (window.innerHeight > 600) {
          setWindowHeight('-50svh');
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const router = useRouter();

  const handleSwitchChange = useCallback(() => {
    router.push('https://classic.wakanda.bet');
  }, [router]);

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 z-[19] bg-black/30 backdrop-blur-sm' />
      )}
      <motion.div
        animate={{
          y: isOpen ? 40 : windowHeight,
        }}
        className='flex justify-center max-w-md items-start max-h-[65svh] h-full w-full fixed top-0 z-20 overflow-hidden'
        id='events-filter'
        initial={{ y: windowHeight }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className='w-[96%] max-w-md rounded-b-[24px] bg-[#363535] h-full pt-10 overflow-y-auto overflow-x-hidden relative'>
          <div className={`px-3 ${isOpen ? 'visible' : 'invisible'}`}>
            <SearchInput
              onChange={handleSearchChange}
              value={localSearchTerm}
            />
            <div>
              <div className='flex justify-between items-center my-5'>
                <span className='text-[#F9F9F9] block opacity-60 text-sm uppercase'>
                  Switch To Classic App
                </span>
                <Switch className='' onClick={handleSwitchChange} />
              </div>
              <TimeBadges
                filterByTime={localFilterType}
                onFilterByTime={handleFilterByTime}
              />

              <span className='text-[#F9F9F9] block opacity-60 text-sm uppercase mt-5'>
                Categories
              </span>
              <SportBadges
                filterBySport={localSelectedSport}
                loading={isSportsLoading}
                onFilterBySport={handleFilterBySport}
                sortedSports={sortedSports}
              />
            </div>
          </div>

          <div className='w-[96%] fixed rounded-b-[24px] bottom-0 pb-3 flex justify-between px-4 z-10 mt-5 bg-[#36353501] filter-footer'>
            <button
              className='flex items-center gap-x-1'
              onClick={toggleOpen}
              type='button'
            >
              <ListFilter className='text-[#E5DCDC] w-5 h-auto' />
              <span className='ml-2 text-[#E5DCDC] text-sm uppercase'>
                Filter
              </span>
              <ChevronDown
                className={clsx(
                  isOpen ? 'rotate-[180deg]' : 'rotate-0',
                  'text-[#E5DCDC] w-5 h-auto'
                )}
              />
            </button>
            {isOpen ? (
              <Button
                className='border border-[#ffffff2c] rounded-[12px] text-xs text-center !px-2 w-[135px]'
                onClick={handleApply}
                variant='ghost'
              >
                Apply
              </Button>
            ) : (
              <div className='flex items-center gap-x-4'>
                <ListViewIcon
                  className={cn('w-[18px]', {
                    'opacity-50': isBettingCardView,
                  })}
                  onClick={() => {
                    dispatch(setBettingCardView(false));
                  }}
                />
                <CardViewIcon
                  className={cn('w-[20px]', {
                    'opacity-50': !isBettingCardView,
                  })}
                  onClick={() => {
                    dispatch(setBettingCardView(true));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default React.memo(EventsFilter);
