import React, { Suspense } from 'react';
import IndexClients from './index-clients';
import { Loader } from 'lucide-react';

const Page = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]'>
            <Loader className='animate-spin text-white' size={48} />
          </div>
        }
      >
        <IndexClients />
      </Suspense>
    </>
  );
};

export default Page;
