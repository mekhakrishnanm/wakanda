'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Image from 'next/image';
import { CircleX } from 'lucide-react';
import { Button } from './ui/button';
import InstallSVG from '@/public/svg/install.svg';
import useIsIOSDevice from '@/hooks/useIsIOSDevice';
import { sendGAEvent } from '@next/third-parties/google';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const isIosDevice = useIsIOSDevice();

  const isPwa = () => {
    return ['fullscreen', 'standalone', 'minimal-ui'].some(
      (displayMode) =>
        window.matchMedia(`(display-mode: ${displayMode})`).matches
    );
  };

  const shouldShowPrompt = () => {
    const lastCancelTime = localStorage.getItem('lastPWAPromptCancelTime');
    if (!lastCancelTime) {
      return true;
    }

    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const timeSinceLastCancel = Date.now() - Number.parseInt(lastCancelTime);
    return timeSinceLastCancel > threeDaysInMs;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isPwa() || !shouldShowPrompt()) {
      setShowPrompt(false);
      return;
    }
    const timer = setTimeout(() => setShowPrompt(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShowPrompt()) {
        setShowPrompt(true);
      }
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as any
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as any
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          sendGAEvent({
            event: 'pwa_install',
            value: 'User accepted the install prompt',
          });
        } else {
          localStorage.setItem(
            'lastPWAPromptCancelTime',
            Date.now().toString()
          );
          sendGAEvent({
            event: 'pwa_cancel',
            value: 'User dismissed the install prompt',
          });
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const variants = {
    desktop: {
      hidden: { x: '100%', y: '-50%', top: '50%', right: 0 },
      visible: { x: '-50%', y: '-50%', top: '50%', right: '50%' },
      exit: { x: '100%', y: '-50%', top: '50%', right: 0 },
    },
    mobile: {
      hidden: { y: '-100%' },
      visible: { y: 0 },
      exit: { y: '-100%' },
    },
  };

  const handleCancelClick = () => {
    setShowPrompt(false);
    localStorage.setItem('lastPWAPromptCancelTime', Date.now().toString());
    sendGAEvent({
      event: 'pwa_cancel',
      value: 'User cancelled the install prompt',
    });
  };

  if (!showPrompt || isIosDevice) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          animate='visible'
          className='flex flex-center fixed px-2 right-0 top-[80px] shadow-lg z-50 w-full sm:max-w-md'
          exit='exit'
          initial='visible'
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          variants={variants as Variants}
        >
          <div className='modalDefaultBg text-white flex gap-y-4 gap-x-4 flex-col md:flex-row md:justify-between items-center w-full rounded-[20px] py-4 px-4'>
            <div className='flex items-center gap-x-2'>
              <Image
                alt='install'
                className='w-[22px] h-[18px]'
                src={InstallSVG}
              />
              <span className='text-sm'>
                Install our app for a better experience!
              </span>
            </div>
            <div className='flex items-center gap-x-6 md:gap-x-3 md:flex-row-reverse'>
              <button onClick={() => handleCancelClick()} type='button'>
                <CircleX className='text-white w-7 h-auto hidden lg:inline-block cursor-pointer' />
                <span className='text-white font-semibold md:hidden cursor-pointer'>
                  Close
                </span>
              </button>
              <Button
                className='font-semibold'
                onClick={handleInstallClick}
                variant={'default'}
              >
                Install
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
