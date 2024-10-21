import type React from 'react';

export const IndividualEventSkeleton: React.FC = () => {
  return (
    <div className='animate-pulse'>
      <EventCardSkeleton />
      <WhoWillWinSkeleton />
      <AnimatedBetCardSkeleton />
      <PlacedBetsSkeleton />
      <ShareButtonSkeleton />
      <BetButtonSkeleton />
    </div>
  );
};

const EventCardSkeleton: React.FC = () => (
  <div className='event-card mx-auto max-w-md my-[26px] w-full flex flex-col justify-between p-2 rounded-[16px] bg-slate-800'>
    <div className='justify-between p-2 h-[128px] flex'>
      <div className='rounded-full bg-slate-700 h-full shrink-0 w-[18%]' />
      <div className='flex-center flex-col gap-y-2 py-1 h-full'>
        <div className='h-4 w-32 bg-slate-700 rounded' />
        <div className='h-3 w-24 bg-slate-700 rounded mt-2' />
      </div>
      <div className='rounded-full bg-slate-700 h-full shrink-0 w-[18%]' />
    </div>
    <div className='flex justify-between p-2 h-[68px] bg-slate-700 rounded-b-[16px]'>
      <div className='flex w-full justify-between items-center pr-2'>
        <div className='flex flex-col gap-y-1'>
          <div className='h-4 w-24 bg-slate-600 rounded' />
          <div className='h-3 w-20 bg-slate-600 rounded' />
        </div>
        <div className='w-6 h-6 bg-slate-600 rounded-full' />
      </div>
    </div>
  </div>
);

const WhoWillWinSkeleton: React.FC = () => (
  <div className='h-6 w-48 bg-slate-700 rounded mx-auto my-[6px]' />
);

const AnimatedBetCardSkeleton: React.FC = () => (
  <div className='mx-auto max-w-md w-full h-[200px] bg-slate-700 rounded-[16px] mt-4' />
);

const PlacedBetsSkeleton: React.FC = () => {
  return (
    <div className='placed-bet-card mt-8 rounded-3xl p-4 max-w-md mx-auto animate-pulse'>
      {/* Title Skeleton */}
      <div className='h-6 bg-gray-700 rounded w-40 mx-auto mb-4' />

      {/* Bet Items Skeleton */}
      <div className='space-y-4'>
        {[...Array(3)].map((_, index) => (
          <BetItemSkeleton key={`bet-item-skeleton-${index}`} />
        ))}
      </div>

      {/* No Bets Placeholder (hidden by default) */}
      <div className='hidden flex-col gap-3 my-8 items-center justify-center'>
        <div className='w-8 h-8 bg-gray-700 rounded-full' />
        <div className='h-4 bg-gray-700 rounded w-32' />
      </div>
    </div>
  );
};

const BetItemSkeleton: React.FC = () => (
  <div className='item font-normal relative flex justify-between items-center'>
    <div className='flex items-center space-x-5'>
      <div className='w-8 h-8 bg-gray-700 rounded-full' />
      <div className='h-4 bg-gray-700 rounded w-24' />
    </div>
    <div className='flex items-center space-x-2'>
      <div className='h-4 bg-gray-700 rounded w-16' />
      <div className='w-4 h-4 bg-gray-700 rounded' />
    </div>
  </div>
);

export default PlacedBetsSkeleton;

const ShareButtonSkeleton: React.FC = () => (
  <div className='h-[56px] w-full max-w-md mx-auto rounded-[16px] bg-slate-700 mt-10' />
);

const BetButtonSkeleton: React.FC = () => (
  <div className='h-[56px] w-full max-w-md mx-auto rounded-[16px] bg-slate-600 mt-4' />
);
