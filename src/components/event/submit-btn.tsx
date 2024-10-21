import type React from 'react';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { useAccount } from 'wagmi';
import {
  usePrepareBet,
  useDetailedBetslip,
  useBaseBetslip,
} from '@azuro-org/sdk';
import { useToast } from '@/components/ui/use-toast';
import type { Address } from 'viem';
import FundBtn from '../fund-btn';
import { ConnectBtn } from '@/components/connect-btn';

interface SubmitButtonProps {
  isBetting: boolean;
  isDisabled: boolean;
  isEnoughBalance: boolean;
  activeTab: string;
  selectionNames: string[];
  onBetPlaced: () => void;
  isLiveBet: boolean;
  isCorrectChain: boolean;
  startCountdown: () => void;
  isReset: boolean; // New prop for reset
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isBetting,
  isDisabled,
  isEnoughBalance,
  activeTab,
  selectionNames,
  onBetPlaced,
  isLiveBet,
  startCountdown,
}) => {
  const { address } = useAccount();
  const { toast } = useToast();

  const { items, clear } = useBaseBetslip();
  const {
    betAmount,
    odds,
    totalOdds,
    selectedFreeBet,
    isOddsFetching,
    isStatusesFetching,
  } = useDetailedBetslip();

  const totalOddsRef = useRef(totalOdds);

  // useEffect(() => {
  //   if (!isCorrectChain) {
  //     clear();
  //     changeBetAmount('10');
  //   }
  // }, [isCorrectChain, clear, changeBetAmount]);

  if (!isOddsFetching) {
    totalOddsRef.current = totalOdds;
  }

  const {
    submit,
    approveTx,
    betTx,
    isRelayerFeeLoading,
    isAllowanceLoading,
    isApproveRequired,
  } = usePrepareBet({
    betAmount,
    slippage: 10,
    affiliate: process.env.NEXT_PUBLIC_AFFILIATE_ADDRESS as Address,
    selections: items,
    odds,
    totalOdds,
    freeBet: selectedFreeBet,
    onSuccess: () => {
      toast({
        title: 'Bet placed successfully!',
        description: 'Your bet has been placed.',
      });
      onBetPlaced();
      clear();
    },
    onError: (error) => {
      const message = error?.message.split('\n')[0] || 'Something went wrong';
      toast({
        title: 'Error placing bet',
        description: message,
        variant: 'destructive',
      });
      setTimeout(() => {
        onBetPlaced();
      }, 1000);
    },
    liveEIP712Attention: isLiveBet
      ? 'By signing this transaction, I agree to place a live bet on Azuro'
      : undefined,
  });

  // const isPending = approveTx.isPending || betTx.isPending;
  const isProcessing = approveTx.isProcessing || betTx.isProcessing;
  const isLoading =
    isRelayerFeeLoading ||
    isAllowanceLoading ||
    isBetting ||
    (isBetting && isProcessing) ||
    isStatusesFetching;

  if (!address) {
    return (
      <ConnectBtn
        classVal={`w-auto min-w-[135px] max-w-md transition-opacity duration-300 !font-medium text-[16px] xs:text-[18px] ${
          activeTab === selectionNames[0] ? 'btn-2' : 'btn-3'
        }`}
      />
    );
  }
  if (!isEnoughBalance) {
    return (
      <FundBtn
        classVal={`w-auto min-w-[135px] max-w-md transition-opacity duration-300 font-medium text-[16px] xs:text-[20px] ${
          activeTab === selectionNames[0] ? 'btn-2' : 'btn-3'
        }`}
        hideIcon={true}
      />
    );
  }

  const handleSubmit = async () => {
    startCountdown();
    await submit();
  };

  return (
    <Button
      className={`w-auto min-w-[135px] max-w-md transition-opacity duration-300 font-medium text-[16px] xs:text-[20px] ${
        activeTab === selectionNames[0] ? 'btn-2' : 'btn-3'
      }`}
      disabled={isDisabled || isLoading}
      onClick={handleSubmit}
      size={'lg'}
      variant='default'
    >
      {isBetting ? (
        'Waiting...'
      ) : isProcessing ? (
        'Processing...'
      ) : isLoading ? (
        <>
          <Loader className='animate-spin mr-2 w-5' />
          Loading...
        </>
      ) : isApproveRequired ? (
        'Approve'
      ) : (
        'Place Bet'
      )}
    </Button>
  );
};

export default SubmitButton;
