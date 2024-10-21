'use client';
import type React from 'react';
import { useEffect, useCallback } from 'react';
import { useSwitchChain, useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { polygon } from 'wagmi/chains';
import { useChain } from '@azuro-org/sdk';

interface SwitchBtnProps {
  classValue: string;
  onSwitchSuccess?: () => void;
}

const SwitchBtn: React.FC<SwitchBtnProps> = ({
  classValue,
  onSwitchSuccess,
}) => {
  const { switchChain, error, status, isPending: isLoading } = useSwitchChain();
  const { chain: currentChain } = useAccount();
  const { appChain } = useChain();
  const { toast } = useToast();

  const handleSwitch = useCallback(() => {
    switchChain({ chainId: polygon.id });
  }, [switchChain]);

  useEffect(() => {
    if (appChain.id === polygon.id || status === 'success') {
      toast({
        title: 'Network Changed',
        description: `Your network has been switched to ${currentChain?.name} in your wallet`,
        variant: 'default',
      });
      if (onSwitchSuccess) {
        onSwitchSuccess();
      }
    }
  }, [currentChain?.name, status, toast, appChain.id, onSwitchSuccess]);

  useEffect(() => {
    if (error) {
      const message = error.message.split('\n')[0];
      toast({
        title: 'Network Change Failed',
        description: message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <Button
      className={`w-auto min-w-[120px] max-w-md transition-opacity duration-300 !font-medium text-[14px] xs:text-[16px] ${classValue}`}
      disabled={isLoading}
      onClick={handleSwitch}
      size={'sm'}
      variant='default'
    >
      {isLoading ? (
        <>
          <Loader2 className='ml-2 h-4 w-4 animate-spin' />
          Switching
        </>
      ) : (
        'Switch to Polygon'
      )}
    </Button>
  );
};

export default SwitchBtn;
