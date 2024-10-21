import type React from 'react';

const SettingsPageSkeleton: React.FC = () => {
  return (
    <main className='px-4 pb-[128px] pt-6 max-w-md mx-auto animate-pulse'>
      <div className='h-8 w-40 bg-slate-700 rounded mb-4' />{' '}
      {/* "My Wallet" title */}
      <WalletCardSkeleton />
      <div className='h-8 w-32 bg-slate-700 rounded mt-8 mb-4' />{' '}
      {/* "Support" title */}
      <SupportLinksSkeleton />
      <PolicyAndLogoutSkeleton />
    </main>
  );
};

const WalletCardSkeleton: React.FC = () => (
  <div className='w-full bet-history-highlights !h-48 rounded-[24px] p-5'>
    <div className='flex justify-between items-center mb-4'>
      <div className='h-6 w-32 bg-slate-700 rounded' /> {/* "Total Balance" */}
      <div className='h-6 w-24 bg-slate-700 rounded' /> {/* Address */}
    </div>
    <div className='flex justify-between items-center mb-6'>
      <div className='h-5 w-24 bg-slate-700 rounded' /> {/* Native balance */}
      <div className='h-5 w-16 bg-slate-700 rounded' /> {/* Chain name */}
    </div>
    <div className='flex justify-between items-center'>
      <div className='h-10 w-32 bg-slate-700 rounded' /> {/* Token balance */}
      <div className='h-8 w-24 bg-slate-700 rounded' /> {/* Convert button */}
    </div>
  </div>
);

const SupportLinksSkeleton: React.FC = () => (
  <div className='flex gap-x-4 mt-3'>
    <div className='h-10 w-full bg-slate-700 rounded-[12px]' />{' '}
    {/* Discord button */}
    <div className='h-10 w-full bg-slate-700 rounded-[12px]' />{' '}
    {/* Telegram button */}
  </div>
);

const PolicyAndLogoutSkeleton: React.FC = () => (
  <div className='w-full rounded-[24px] bg-[#ffffff0a] mt-5 p-5'>
    <div className='h-6 w-48 bg-slate-700 rounded mb-3' />{' '}
    {/* Terms & Conditions */}
    <div className='h-6 w-36 bg-slate-700 rounded mb-10' />{' '}
    {/* Privacy Policy */}
    <div className='h-12 w-full bg-slate-700 rounded-[12px]' />{' '}
    {/* Logout button */}
  </div>
);

export default SettingsPageSkeleton;
