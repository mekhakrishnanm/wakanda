import React, { Suspense } from 'react';
import EventIndexClients from './index-clients';

const Page = () => {
  return (
    <Suspense>
      <main className='px-4 pb-[128px]'>
        <EventIndexClients />
      </main>
    </Suspense>
  );
};

export default Page;
