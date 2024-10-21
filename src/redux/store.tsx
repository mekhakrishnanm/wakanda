import { configureStore } from '@reduxjs/toolkit';
import walletSlice from './slices/wallet.slice';
import eventsSlice from './slices/events-slice';

export const store = configureStore({
  reducer: {
    wallet: walletSlice,
    events: eventsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
