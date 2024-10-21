'use client';
import React, { useEffect, useState } from 'react';
import useIsIOSDevice from '@/hooks/useIsIOSDevice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import WakandaAlertImg from '@/public/img/WakandaAlert.jpg';

const AddToHomeScreen = () => {
  const [open, setOpen] = useState(false);
  const isIos = useIsIOSDevice();

  useEffect(() => {
    const addToHomeScreen = localStorage.getItem('addToHomeScreen');
    if (isIos && !addToHomeScreen) {
      setOpen(true);
      localStorage.setItem('addToHomeScreen', JSON.stringify(true));
    }
  }, [isIos]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className='bg-transparent max-w-md after:[content("")] after:absolute after:inset-0 after:modalDefaultBg after:z-[-1] after:rounded-[inherit] rounded-[16px] max-w-[calc(100%-32px)] mx-auto'>
        <DialogHeader>
          <DialogTitle className='text-primary'>Add To Home Screen</DialogTitle>
          <DialogDescription className='text-white pt-4'>
            <p>
              To use this app, you need to add this website to your home screen.
            </p>
            <p>
              In your Safari browser menu, tap the Share icon and choose Add to
              Home Screen in the options.
            </p>
            <Image
              alt='ios img'
              className='w-[150px] h-auto mx-auto mt-8 rounded-[16px]'
              priority
              src={WakandaAlertImg}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddToHomeScreen;
