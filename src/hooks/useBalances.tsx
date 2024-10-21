// hooks/useBalances.ts
import { useState, useEffect } from 'react';
import { getBalance } from 'wagmi/actions';
import { formatEther } from 'viem';
import { setNativeBalance, setTokenBalance } from '@/redux/slices/wallet.slice';
import type { Dispatch } from '@reduxjs/toolkit';
import { useBetTokenBalance, useChain } from '@azuro-org/sdk';
import { wagmiConfig } from '@/components/wallet/WagmiProvider';
// import wagmiConfig from '@/components/wallet/config';
// import wagmiConfig from 'local_modules/wallet/config';

const useBalances = (
  address: `0x${string}`,
  contractAddress: string,
  dispatch: Dispatch
) => {
  const [tBalance, setTBalance] = useState('0'); // Token balance
  const [nBalance, setNBalance] = useState('0'); // Native balance
  const [isNativeBalanceFetching, setIsNativeBalanceFetching] = useState(true);
  const { balance, loading: isBalanceFetching } = useBetTokenBalance();
  const { appChain } = useChain();

  useEffect(() => {
    if (appChain) {
      setTBalance(Number(balance ?? 0).toFixed(2));
      const balanceVal = Number(balance ?? 0).toFixed(2);
      dispatch(setTokenBalance(balanceVal));
    }
  }, [balance, dispatch, appChain]);

  useEffect(() => {
    if (address && appChain) {
      const updateNativeBalance = async () => {
        setIsNativeBalanceFetching(true);
        try {
          const tempBalance = await getBalance(wagmiConfig, {
            address: address as `0x{string}`,
          });
          const ethValue = formatEther(tempBalance.value);
          setNBalance(ethValue);
          dispatch(setNativeBalance(ethValue));
        } catch (error) {
          console.error('Error fetching native balance:', error);
        } finally {
          setIsNativeBalanceFetching(false);
        }
      };
      updateNativeBalance();
    }
  }, [address, appChain, dispatch]);

  return { tBalance, nBalance, isBalanceFetching, isNativeBalanceFetching };
};

export default useBalances;
