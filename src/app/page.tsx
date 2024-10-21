// app/page.tsx

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import EventsLoadingLayout from '@/components/layouts/events-loading-layout';

const IndexClients = dynamic(() => import('./index-clients'), { ssr: false });

const Page = async ({
  searchParams,
}: {
  searchParams: {
    searchTerm: string;
    filterType: string;
    selectedSport: string;
  };
}) => {
  const {
    searchTerm = '',
    filterType = 'All',
    selectedSport = 'All',
  } = searchParams;

  const selectedSports = selectedSport.split(',').filter((item) => item !== '');

  return (
    <Suspense fallback={<EventsLoadingLayout isCardView={false} />}>
      <IndexClients
        filterType={filterType}
        isLive={filterType === 'Live'}
        searchTerm={searchTerm}
        selectedSport={selectedSports}
      />
    </Suspense>
  );
};

export default Page;
