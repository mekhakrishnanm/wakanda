// RedeemAll.tsx
import React, { useCallback, useMemo } from 'react';
import { type Bet, useRedeemBet } from '@azuro-org/sdk';
import { Button } from '@/components/ui/button';
import RedeemAllIcon from '@/components/svg/redeem-all-icon';
import { Loader } from 'lucide-react';

const RedeemAll = ({ bets }: { bets: Bet[] }) => {
  const { submit, isPending, isProcessing } = useRedeemBet();

  const redeemableBets = useMemo(
    () =>
      bets?.filter((bet) => !bet.freebetContractAddress && bet.isRedeemable),
    [bets]
  );

  const isDisabled = !redeemableBets.length || isPending || isProcessing;

  const handleRedeem = useCallback(async () => {
    if (!isDisabled) {
      try {
        await submit({ bets: redeemableBets });
        // updateBalance(); // Uncomment if needed
      } catch (err) {
        console.error('Redeem error:', err);
      }
    }
  }, [isDisabled, submit, redeemableBets]);

  const buttonTitle = isPending
    ? 'Waiting...'
    : isProcessing
      ? 'Processing...'
      : 'Redeem all';

  return (
    <Button
      className='w-full h-[56px] disabled:bg-[#787878] rounded-[16px] bg-white text-black text-[20px] font-[450] py-[10px] px-4 my-4'
      disabled={isDisabled}
      onClick={handleRedeem}
      variant={'ghost'}
    >
      {isPending || isProcessing ? (
        <Loader className='w-5 h-auto animate-spin mr-2' />
      ) : (
        <RedeemAllIcon className='w-5 h-auto text-black mr-4' />
      )}{' '}
      {buttonTitle}
    </Button>
  );
};

export default React.memo(RedeemAll);
