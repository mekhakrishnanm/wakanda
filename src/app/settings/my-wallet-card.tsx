import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useBalance,
} from 'wagmi';
import { Copy, X } from 'lucide-react';
import type { Address } from 'viem';
import { parseEther, formatEther } from 'viem';
import { abi } from '@/lib/constants';
import ConvertIcon from '@/components/svg/convert-icon';
import TotalBalanceIcon from '@/components/svg/total-balance-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChangeNetworkModal from './change-network-modal';
import { getDisplayAmount } from '@/lib/balance';
import { TOKENS, chains } from '@/lib/chains';
import { useChain } from '@azuro-org/sdk';
import FundBtn from '@/components/fund-btn';
import { useToast } from '@/components/ui/use-toast';

const contractAddress = process.env.NEXT_PUBLIC_CHAIN_TOKEN_ADDRESS as Address;

const ConvertSection = React.memo(
  ({
    isWrap,
    handleToggle,
    amount,
    handleChangeAmount,
    handleMaxClick,
    handleDeposit,
    conversionState,
    fromBalance,
    setInConvert,
  }: {
    isWrap: boolean;
    handleToggle: () => void;
    amount: string;
    handleChangeAmount: (value: string) => void;
    handleMaxClick: () => void;
    handleDeposit: () => void;
    conversionState: 'idle' | 'pending' | 'confirming' | 'success' | 'error';
    fromBalance: string;
    toBalance: string;
    setInConvert: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || /^\d*\.?\d{0,18}$/.test(value)) {
        handleChangeAmount(value);
      }
    };

    const isButtonDisabled =
      conversionState !== 'idle' ||
      amount === '' ||
      Number.parseFloat(amount) === 0 ||
      Number.parseFloat(amount) > Number.parseFloat(fromBalance);

    const buttonText = () => {
      switch (conversionState) {
        case 'pending':
          return 'Sending Transaction...';
        case 'confirming':
          return 'Confirming Transaction...';
        case 'success':
          return 'Transaction Successful!';
        case 'error':
          return 'Transaction Failed. Try Again';
        default:
          return `Convert ${isWrap ? 'CHZ to wCHZ' : 'wCHZ to CHZ'}`;
      }
    };

    return (
      <div>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-[550]'>Convert CHZ/wCHZ</h4>
          <X
            className='text-black w-5 h-auto cursor-pointer'
            onClick={() => setInConvert(false)}
          />
        </div>
        <div className='flex justify-between mt-5 gap-x-5'>
          <Button
            className={`text-base font-[550] flex-center gap-x-2 h-[40px] w-full border-2 rounded-[12px] px-2 py-0 ${
              isWrap ? 'border-[#ffffff]' : 'border-[#315A5B]'
            }`}
            disabled={conversionState !== 'idle'}
            onClick={handleToggle}
            variant={'ghost'}
          >
            Wrap
          </Button>
          <Button
            className={`text-base font-[550] flex-center gap-x-2 h-[40px] w-full border-2 rounded-[12px] px-2 py-0 ${
              !isWrap ? 'border-[#ffffff]' : 'border-[#315A5B]'
            }`}
            disabled={conversionState !== 'idle'}
            onClick={handleToggle}
            variant={'ghost'}
          >
            Unwrap
          </Button>
        </div>
        <div className='h-[64px] w-full bg-[#ffffff26] mt-5 flex items-center justify-between p-[10px] rounded-[16px]'>
          <Input
            className='text-[40px] font-[450] leading-[35px] bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-none'
            disabled={conversionState !== 'idle'}
            inputMode='decimal'
            onChange={handleInputChange}
            placeholder='0.00'
            type='text'
            value={amount}
          />
          <Button
            className='w-[54px] h-[30px] bg-[#41BDC8] rounded-[8px] flex-center text-base'
            disabled={conversionState !== 'idle'}
            onClick={handleMaxClick}
            variant='ghost'
          >
            Max
          </Button>
        </div>
        <div className='flex justify-between mt-2'>
          <span>
            Balance: {getDisplayAmount(fromBalance)} {isWrap ? 'CHZ' : 'wCHZ'}
          </span>
          <span>
            You will receive: {amount || '0'} {isWrap ? 'wCHZ' : 'CHZ'}
          </span>
        </div>
        <Button
          className='text-base font-[550] flex-center mt-10 gap-x-2 h-[56px] w-full border-[3px] border-[#211e1f29] rounded-[16px] px-2 py-0'
          disabled={isButtonDisabled}
          onClick={handleDeposit}
          variant={'ghost'}
        >
          {buttonText()}
        </Button>
      </div>
    );
  }
);

const BalanceSection = React.memo(
  ({
    address,
    tBalance,
    nBalance,
    setInConvert,
  }: {
    address: string;
    tBalance: string;
    nBalance: string;
    setInConvert: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const { appChain } = useChain();

    const copyAddressHandler = useCallback(() => {
      navigator.clipboard.writeText(address);
    }, [address]);

    return (
      <div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <TotalBalanceIcon className='text-[#211E1F]' />
            <h4 className='text-lg font-[550] ml-3'>Total Balance</h4>
          </div>
          <button
            className='address relative before:stripes rounded-[32px] overflow-hidden w-[40%] h-[24px] text-sm flex-center text-[#211E1F] font-[450] active:bg-primary'
            onClick={copyAddressHandler}
            type='button'
          >
            {address ? (
              <>
                **${address.substring(address.length - 8)}
                <Copy className='text-black w-[12px] h-auto ml-1.5 active:scale-[0.9]' />
              </>
            ) : (
              '0x'
            )}
          </button>
        </div>
        <div className='flex justify-between items-center text-base'>
          <div>
            <span className='font-[450]'>{getDisplayAmount(nBalance)}</span>
            <span className='ml-2 opacity-60 font-[450]'>
              {appChain.id === 137 ? 'POL' : 'CHZ'}
            </span>
          </div>
          <span className='opacity-60 font-[450]'>
            {appChain.id === 137 ? 'Polygon' : 'Chiliz'}
          </span>
        </div>
        <div className='flex justify-between items-center mt-[35px]'>
          <div className='flex items-end'>
            <span className='text-[40px] font-[450] leading-[35px]'>
              {tBalance}
            </span>
            <span className='ml-[5px] text-[16px] font-[450] opacity-[60]'>
              {TOKENS[appChain.id]}
            </span>
          </div>
          {appChain.id === 88888 && (
            <Button
              className='flex items-center justify-between gap-x-1 h-[30px] w-[95px] border border-[#315A5B] rounded-[10px] px-2 py-0'
              onClick={() => setInConvert(true)}
              variant={'ghost'}
            >
              <ConvertIcon className='text-[#315A5B] w-5 h-auto' /> Convert
            </Button>
          )}
        </div>
        <div className='flex-center mt-[20px] gap-x-2'>
          <ChangeNetworkModal />
          {appChain.id === 137 && <FundBtn />}
        </div>
      </div>
    );
  }
);
const MyWalletCard = ({
  tBalance,
  nBalance,
}: {
  tBalance: string;
  nBalance: string;
}) => {
  const [isInConvert, setInConvert] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [isWrap, setIsWrap] = useState(true);
  const [conversionState, setConversionState] = useState<
    'idle' | 'pending' | 'confirming' | 'success' | 'error'
  >('idle');
  const { address } = useAccount();
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });
  const { data: chzBalance, refetch: refetchChzBalance } = useBalance({
    address,
  });
  const { data: wchzBalance, refetch: refetchWchzBalance } = useBalance({
    address,
    token: contractAddress as Address,
  });
  const { toast } = useToast();

  const handleChangeAmount = useCallback((value: string) => {
    setAmount(value);
  }, []);

  const handleToggle = useCallback(() => {
    setIsWrap((prev) => !prev);
    setAmount('');
  }, []);

  const handleMaxClick = useCallback(() => {
    setAmount(
      isWrap
        ? formatEther(chzBalance?.value ?? BigInt(0))
        : formatEther(wchzBalance?.value ?? BigInt(0))
    );
  }, [isWrap, chzBalance, wchzBalance]);

  const handleDeposit = useCallback(() => {
    if (amount === '' || Number.parseFloat(amount) === 0) {
      return;
    }

    const functionName = isWrap ? 'deposit' : 'withdraw';
    const value = isWrap ? parseEther(amount) : undefined;

    setConversionState('pending');
    writeContract({
      chain: chains[0],
      address: contractAddress as Address,
      abi,
      functionName,
      args: isWrap ? [] : [parseEther(amount)],
      value: value as unknown as undefined,
      account: address,
    });
  }, [isWrap, amount, address, writeContract]);

  const refreshBalances = useCallback(async () => {
    await Promise.all([refetchChzBalance(), refetchWchzBalance()]);
  }, [refetchChzBalance, refetchWchzBalance]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isPending) {
      setConversionState('pending');
    } else if (isConfirming) {
      setConversionState('confirming');
    } else if (isConfirmed) {
      setConversionState('success');
      toast({
        title: 'Conversion Successful',
        description: `Successfully converted ${amount} ${isWrap ? 'CHZ to wCHZ' : 'wCHZ to CHZ'}`,
      });
      // Refresh balances and reset state after a successful transaction
      refreshBalances().then(() => {
        setTimeout(() => {
          setConversionState('idle');
          reset();
          setAmount('');
        }, 3000);
      });
    } else if (!isPending && !isConfirming && conversionState !== 'idle') {
      setConversionState('error');
      toast({
        title: 'Conversion Failed',
        description:
          'There was an error during the conversion. Please try again.',
        variant: 'destructive',
      });
      // Reset state after error
      setTimeout(() => {
        setConversionState('idle');
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPending,
    isConfirming,
    isConfirmed,
    amount,
    isWrap,
    toast,
    refreshBalances,
  ]);

  const convertSectionProps = useMemo(
    () => ({
      isWrap,
      handleToggle,
      amount,
      handleChangeAmount,
      handleMaxClick,
      handleDeposit,
      conversionState,
      fromBalance: isWrap
        ? formatEther(chzBalance?.value ?? BigInt(0))
        : formatEther(wchzBalance?.value ?? BigInt(0)),
      toBalance: isWrap
        ? formatEther(wchzBalance?.value ?? BigInt(0))
        : formatEther(chzBalance?.value ?? BigInt(0)),
      setInConvert,
    }),
    [
      isWrap,
      handleToggle,
      amount,
      handleChangeAmount,
      handleMaxClick,
      handleDeposit,
      conversionState,
      chzBalance,
      wchzBalance,
    ]
  );

  const balanceSectionProps = useMemo(
    () => ({
      address: address as Address,
      tBalance,
      nBalance,
      setInConvert,
    }),
    [address, tBalance, nBalance]
  );

  return (
    <div
      className='w-full rounded-[24px] p-5 text-[#211E1F] mt-4'
      id='my-wallet-card'
    >
      {isInConvert ? (
        <ConvertSection {...convertSectionProps} />
      ) : (
        <BalanceSection {...balanceSectionProps} />
      )}
    </div>
  );
};

export default React.memo(MyWalletCard);
