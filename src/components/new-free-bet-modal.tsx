'use client';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useChain, useDetailedBetslip } from '@azuro-org/sdk';

const messages = {
  title: 'You’re lucky, you’ve got a FREEBET!',
  text: 'You can use your bonus directly in the betslip, when placing a bet on Wakanda Bet.',
  freeBet: 'freebet!',
  until: 'Valid until {date}',
};

const NewFreeBetModal = () => {
  const [open, setOpen] = useState(false);
  const { freeBets } = useDetailedBetslip();
  const { betToken, appChain } = useChain();

  const [freebetData, setFreebetData] = useState<{
    amount: string;
    expiresAt: number;
  }>({
    amount: '0',
    expiresAt: dayjs().unix(),
  });

  useEffect(() => {
    if (appChain && freeBets && freeBets.length > 0) {
      // Find the highest freebet on the "selected appChain"
      const freebetsList = freeBets
        .filter((bet) => bet.chainId === appChain.id)
        .sort((a, b) => Number(a.amount) - Number(b.amount));
      const selectedFreebet = freebetsList?.length > 0 ? freebetsList[0] : null;
      if (selectedFreebet) {
        const amount = selectedFreebet.amount;
        const expiresAt = selectedFreebet.expiresAt;
        setFreebetData({ amount, expiresAt });
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }, [appChain, freeBets]);

  const { amount, expiresAt } = freebetData;

  return (
    <div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className='!p-0 max-w-md after:[content("")] after:absolute after:inset-0 after:modalDefaultBg after:z-[-1] after:rounded-[inherit] rounded-[16px] mx-auto'>
          <div className='p-12  max-w-md'>
            <div className='relative'>
              <div className='relative z-20'>
                <div className='text-[2.375rem] leading-[2.625rem] font-bold'>
                  <div className='text-brand-50'>
                    {Number(amount)} {betToken.symbol}
                  </div>
                  <div>{messages.freeBet}</div>
                </div>
                <div className='text-heading-h4 font-semibold text-accent-green mt-3'>
                  {messages.until.replace(
                    '{date}',
                    dayjs(expiresAt).format('DD MMM YYYY, HH:mm')
                  )}
                </div>
              </div>
            </div>
            <div className='pt-5'>
              <div className='text-caption-14 font-semibold'>
                {messages.title}
              </div>
              <div className='text-caption-13 text-grey-60 mt-2'>
                {messages.text}
              </div>
              <Button className='w-full mt-6' onClick={() => setOpen(false)}>
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewFreeBetModal;
