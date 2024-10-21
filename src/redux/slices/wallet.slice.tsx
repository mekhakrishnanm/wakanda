import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type WalletSliceType = {
  nativeBalance: string;
  tokenBalance: string;
  isTLoading: boolean;
  isNLoading: boolean;
  chainId: number | null;
};

const initialState: WalletSliceType = {
  nativeBalance: '',
  tokenBalance: '',
  isTLoading: true,
  isNLoading: true,
  chainId: null,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setNativeBalance: (state, action: PayloadAction<string>) => {
      state.nativeBalance = action.payload;
    },
    setTokenBalance: (state, action: PayloadAction<string>) => {
      state.tokenBalance = action.payload;
    },
    setIsTLoadingBalance: (state, action: PayloadAction<boolean>) => {
      state.isTLoading = action.payload;
    },
    setIsNLoadingBalance: (state, action: PayloadAction<boolean>) => {
      state.isNLoading = action.payload;
    },
    setChainId: (state, action: PayloadAction<number | null>) => {
      state.chainId = action.payload;
    },
  },
});

export const {
  setNativeBalance,
  setTokenBalance,
  setIsNLoadingBalance,
  setIsTLoadingBalance,
  setChainId,
} = walletSlice.actions;
export default walletSlice.reducer;
