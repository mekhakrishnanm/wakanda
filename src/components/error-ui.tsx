'use client'; // Error components must be Client Components

import Link from 'next/link';
// import Image from 'next/image';

export default function ErrorUI({ reset }: { reset: () => void }) {
  return (
    <>
      <section className='bg-container flex-center min-h-[calc(100vh-65px)] lg:min-h-[calc(100vh-104px)]'>
        <div className='flex flex-col items-center'>
          {/* <div className='relative w-[300px] h-[300px] lg:w-[500px] lg:h-[400px]'>
            <Image
              alt='404 image'
              className='object-contain'
              fill
              sizes='(max-width:1024px) 100vw, 50vw'
              src={`/svg/error-429.svg`}
            />
          </div> */}
          <h2 className='text-destructive text-lg font-semibold'>
            Oops, there is an error!
          </h2>
          <div className=' flex justify-center space-x-5 py-5'>
            <Link
              className='w-[135px] h-[40px] mt-[20px] border-[1.5px] border-[#4D3EC1] rounded-[5px] flex-center text-[10px] font-semibold text-blackWhite'
              href={'/'}
            >
              Take me to Home
            </Link>
            <button
              className='w-[135px] h-[40px] mt-[20px] border-[1.5px] border-[#4D3EC1] rounded-[5px] flex-center text-[10px] font-semibold text-blackWhite'
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
