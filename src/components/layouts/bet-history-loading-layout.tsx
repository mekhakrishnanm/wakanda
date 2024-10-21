import type React from 'react';

const BetHistoryPageSkeleton: React.FC = () => {
  return (
    <main
      className='px-4 pb-[128px] pt-8 max-w-md mx-auto animate-pulse'
      id='bet-history'
    >
      <div className='h-8 w-48 bg-slate-700 rounded mb-4' />
      <BetHistoryHighlightsSkeleton />
      <RedeemAllSkeleton />
      <BetListSkeleton />
    </main>
  );
};

const BetHistoryHighlightsSkeleton: React.FC = () => (
  <div className='bet-history-highlights mt-4 flex flex-col w-full h-[175px] rounded-[24px] p-2 bg-slate-800'>
    <div className='flex-center gap-x-[24px] w-full h-[80px] rounded-[16px] py-2 px-6 bg-slate-700'>
      <div className='w-10 h-10 bg-slate-600 rounded-full' />
      <div className='flex flex-col flex-grow'>
        <div className='h-3 w-20 bg-slate-600 rounded mb-2' />
        <div className='h-5 w-full bg-slate-600 rounded' />
      </div>
    </div>
    <div className='w-full flex items-center justify-center gap-x-6 grow py-4'>
      <div className='flex flex-col gap-y-[6px] w-1/3'>
        <div className='h-3 w-24 bg-slate-700 rounded mb-1' />
        <div className='h-5 w-16 bg-slate-700 rounded' />
      </div>
      <div className='h-full w-[1px] bg-slate-700' />
      <div className='flex flex-col gap-y-[6px] w-1/3'>
        <div className='h-3 w-16 bg-slate-700 rounded mb-1' />
        <div className='h-5 w-24 bg-slate-700 rounded' />
      </div>
    </div>
  </div>
);

const RedeemAllSkeleton: React.FC = () => (
  <div className='w-full h-[56px] bg-slate-700 rounded-[16px] my-4' />
);

const BetListSkeleton: React.FC = () => (
  <div className='flex flex-col gap-y-2'>
    {[...Array(5)].map((_, index) => (
      <BetHistoryCardSkeleton key={index} />
    ))}
  </div>
);

const BetHistoryCardSkeleton: React.FC = () => (
  <div className='bet-history-card relative flex items-start justify-between gap-x-4 w-full h-[108px] rounded-[16px] p-4 bg-slate-800'>
    <div className='flex items-start'>
      <div className='w-6 h-6 bg-slate-700 rounded-full' />
      <div className='ml-4'>
        <div className='h-5 w-32 bg-slate-700 rounded mb-2' />
        <div className='h-3 w-24 bg-slate-700 rounded mb-2' />
        <div className='h-3 w-40 bg-slate-700 rounded' />
      </div>
    </div>
    <div className='flex flex-col items-end justify-between h-full'>
      <div className='h-4 w-16 bg-slate-700 rounded' />
      <div className='h-4 w-12 bg-slate-700 rounded' />
    </div>
  </div>
);

export default BetHistoryPageSkeleton;
