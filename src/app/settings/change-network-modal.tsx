'use client';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSwitchChain, useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import ChangeNetworkIcon from '@/components/svg/change-network-icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChain } from '@azuro-org/sdk';
import { useRouter, usePathname } from 'next/navigation';

const ChangeNetworkModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { chains, switchChainAsync, error, status, reset } = useSwitchChain();
  const { chain: currentChain } = useAccount();
  const { setAppChainId, appChain } = useChain();
  const { toast } = useToast();
  const [switchingChainId, setSwitchingChainId] = useState<number | null>(null);

  // Add a new state to track successful chain switch
  const [chainSwitched, setChainSwitched] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (currentChain && switchingChainId && appChain.id === switchingChainId) {
      setChainSwitched(true);
    }

    if (chainSwitched) {
      toast({
        title: 'Network Changed',
        description: `Your network has been switched to ${currentChain?.name} in your wallet`,
        variant: 'default',
      });
      router.push(pathName);
      setAppChainId(currentChain?.id as 137 | 88888);
      setOpen(false);
      setSwitchingChainId(null);
      // window.location.reload();
      reset();
      setChainSwitched(false);
    }
  }, [
    pathName,
    router,
    currentChain,
    toast,
    setAppChainId,
    switchingChainId,
    chainSwitched,
    reset,
    appChain.id,
  ]);

  useEffect(() => {
    if (error) {
      const message = error.message.split('\n')[0];
      toast({
        title: 'Network Change Failed',
        description: message,
        variant: 'destructive',
      });
      setSwitchingChainId(null);
    }
  }, [error, toast]);

  const handleSwitchChain = async (chainId: 137 | 88888) => {
    setSwitchingChainId(chainId);
    try {
      if (appChain.id === chainId) {
        await switchChainAsync({ chainId });
      } else {
        await setAppChainId(chainId as 137 | 88888);
        const chainName = chains.find((chain) => chain.id === chainId)?.name;
        toast({
          title: 'Network Changed',
          description: `Your network has been switched to ${chainName} in your wallet`,
          variant: 'default',
        });
        setSwitchingChainId(null);
      }
    } catch (err) {
      console.error('Error switching chain:', err);
      setSwitchingChainId(null);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const networkButtons = useMemo(
    () =>
      chains.map((chain) => {
        const isActive = chain.id === appChain?.id;
        const isSwitching = chain.id === switchingChainId;
        return (
          <Button
            className={cn(
              'w-full justify-between text-left font-semibold',
              isActive && 'border-primary border-2 relative overflow-hidden',
              isActive &&
                'after:absolute after:inset-0 after:bg-primary after:opacity-10'
            )}
            disabled={status === 'pending' || isSwitching}
            key={chain.id}
            onClick={() => handleSwitchChain(chain.id as 137 | 88888)}
            variant='outline'
          >
            <span className='flex items-center justify-between w-full'>
              {chain.name}
              {isActive && (
                <span className='mr-2 h-2 w-2 rounded-full bg-primary animate-pulse' />
              )}
            </span>
            {isSwitching && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
          </Button>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains, currentChain?.id, switchingChainId, status]
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className='text-sm flex-center gap-x-2 h-[40px] w-full border border-[#211e1f29] rounded-[12px] px-2 py-0'
          variant={'ghost'}
        >
          <ChangeNetworkIcon className='h-4 w-4' />
          Change Network
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md p-4 mx-auto before:[content("")] before:absolute before:inset-0 before:z-[-1] before:modalDefaultBg before:rounded-[inherit] rounded-[16px]'>
        <DialogHeader>
          <DialogTitle className='text-left'>Change Network</DialogTitle>
          <DialogDescription>
            Select a network to switch to. The current network is highlighted.
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex flex-col gap-4'>{networkButtons}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeNetworkModal;
