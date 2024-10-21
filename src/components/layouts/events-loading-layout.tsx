import type React from 'react';

const EventsLoadingLayout: React.FC<{ isCardView?: boolean }> = ({
  isCardView = false,
}) => {
  return (
    <div className='p-4 h-[85vh] flex flex-col'>
      {!isCardView && (
        <div className='w-[100px] h-[20px] rounded-[16px] animate-pulse bg-slate-700 ml-2' />
      )}
      {isCardView ? <CardViewSkeleton /> : <ListViewSkeleton />}
    </div>
  );
};

const ListViewSkeleton = () => (
  <div className='timeline-wrapper flex flex-col gap-y-[10px] mt-5'>
    {[...Array(10)].map((_, index) => (
      <ListItem key={index} />
    ))}
  </div>
);

const ListItem = () => (
  <div className='border border-blue-300 border-opacity-30 animate-pulse flex items-center justify-between space-x-4 shadow rounded-[16px] p-4 max-w-sm w-full h-[128px] mx-auto'>
    <div className='rounded-full bg-slate-700 h-full shrink-0 w-[18%]' />
    <div className='flex-center flex-col gap-y-2 py-1 h-full'>
      <div className='h-3 w-12 bg-slate-700 rounded shrink-0' />
      <div className='h-3 w-16 bg-slate-700 rounded shrink-0' />
      <div className='h-3 w-28 mt-3 bg-slate-700 rounded shrink-0' />
    </div>
    <div className='rounded-full bg-slate-700 h-full shrink-0 w-[18%]' />
  </div>
);

const CardViewSkeleton = () => (
  <div className='w-full max-w-md m-auto h-[85%] relative overflow-hidden'>
    <div className='flex justify-center items-center h-[95%]'>
      {/* Left blurred card */}
      <div className='absolute left-0 w-[8%] border border-blue-300  rounded-[16px] border-opacity-30  overflow-hidden h-full opacity-50 blur-sm scale-95 animate-pulse'>
        <CardSkeleton />
      </div>

      {/* Main card */}
      <div className='w-[85%] border rounded-[16px] border-blue-300 border-opacity-30 h-full z-10 animate-pulse'>
        <CardSkeleton />
      </div>

      {/* Right blurred card */}
      <div className='border rounded-[16px] border-blue-300 border-opacity-30 rounded-lg absolute right-0 overflow-hidden w-[8%] h-full opacity-50 blur-sm scale-95 animate-pulse'>
        <CardSkeleton />
      </div>
    </div>
    <CarouselDotsSkeleton />
  </div>
);

const CardSkeleton = () => (
  <div className='flex flex-col justify-between h-full items-start p-4 w-full mx-auto  rounded-[16px]'>
    <div className='flex justify-between items-center w-full mb-4'>
      <div className='text-left'>
        <div className='bg-slate-700 h-5 w-24 rounded mb-2' />
        <div className='h-4 w-32 rounded flex items-center'>
          <div className='bg-slate-600 h-3 w-16 rounded mr-2' />
          <div className='bg-slate-600 h-1 w-1 rounded-full mx-1' />
          <div className='bg-slate-600 h-3 w-12 rounded ml-2' />
        </div>
      </div>
      <div className='h-14 w-16 flex justify-center flex-col items-center rounded-[8px] bg-slate-700 p-2'>
        <div className='bg-slate-600 h-3 w-full rounded mb-1' />
        <div className='bg-slate-600 h-3 w-[80%] mt-1 rounded' />
      </div>
    </div>
    <div className='w-full flex-grow bg-slate-700 rounded-[16px] relative p-4'>
      {/* Placeholder for BettingCard2 content */}
      <div className='absolute top-[15%] right-[10%] w-[30%] h-[35%] bg-slate-600 rounded-full' />
      <div className='absolute bottom-[15%] left-[10%] w-[30%] h-[35%] bg-slate-600 rounded-full' />
      <div className='absolute z-[2]  h-10 w-10 rounded-full left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]' />
      <div className='absolute top-[20%] left-[10%] h-6 w-[35%] bg-slate-600 rounded-full' />
      <div className='absolute bottom-[20%] right-[10%] h-6 w-[35%] bg-slate-600 rounded-full' />
      <div className='absolute bottom-4 left-4 flex flex-col items-start'>
        <div className='flex items-center gap-x-2 mb-2'>
          <div className='w-4 h-4 bg-slate-600 rounded-full' />
          <div className='w-12 h-3 bg-slate-600 rounded-full' />
        </div>
        <div className='w-20 h-5 bg-slate-600 rounded-full' />
      </div>
    </div>
  </div>
);

const CarouselDotsSkeleton = () => (
  <div className='absolute bottom-0 left-0 right-0 py-4 flex justify-center items-center'>
    {[0, 1, 2, 3, 4].map((val) => {
      let dotStyle = '';
      if (val === 2) {
        dotStyle = 'w-6 h-1.5 bg-white rounded-full';
      } else if (val === 1 || val === 3) {
        dotStyle = 'w-1 h-1 bg-slate-500 rounded-full';
      } else {
        dotStyle = 'w-0.5 h-0.5 bg-slate-600 rounded-full';
      }
      return <div className={`mx-0.5 ${dotStyle}`} key={val} />;
    })}
  </div>
);

export default EventsLoadingLayout;
