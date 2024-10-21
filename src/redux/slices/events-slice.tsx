import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { Bet } from '@azuro-org/sdk';
import type { GameCardProps } from '@/types/global.types';

interface EventSliceType {
  searchQuery: string;
  selectedCardGame: GameCardProps | null;
  isCardDrawerOpen: boolean;
  filterByTime: Set<number>;
  filterBySport: Set<string>;
  selectedBetSummary: Bet | null;
  isBetSummaryModalOpen: boolean;
  isBettingCardView: boolean;
  isTeamBSelected: boolean;
}

const initialState: EventSliceType = {
  searchQuery: '',
  selectedCardGame: null,
  isCardDrawerOpen: false,
  filterByTime: new Set([]),
  filterBySport: new Set([]),
  selectedBetSummary: null,
  isBetSummaryModalOpen: true,
  isBettingCardView: true,
  isTeamBSelected: false,
};

export const globalSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilterByTime: (state, action: PayloadAction<Set<number>>) => {
      state.filterByTime = action.payload;
    },
    setSelectedCardGame: (
      state,
      action: PayloadAction<GameCardProps | null>
    ) => {
      state.selectedCardGame = action.payload;
    },
    setIsCardDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isCardDrawerOpen = action.payload;
    },
    setFilterBySport: (state, action: PayloadAction<Set<string>>) => {
      state.filterBySport = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedBetSummary: (state, action: PayloadAction<Bet | null>) => {
      state.selectedBetSummary = action.payload;
      state.isBetSummaryModalOpen = true;
    },
    setBetSummaryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isBetSummaryModalOpen = action.payload;
    },
    setBettingCardView: (state, action: PayloadAction<boolean>) => {
      state.isBettingCardView = action.payload;
    },
    setTeamBSelected: (state, action: PayloadAction<boolean>) => {
      state.isTeamBSelected = action.payload;
    },
  },
});

export const {
  setFilterByTime,
  setSelectedCardGame,
  setIsCardDrawerOpen,
  setFilterBySport,
  setSearchQuery,
  setSelectedBetSummary,
  setBetSummaryModalOpen,
  setBettingCardView,
  setTeamBSelected,
} = globalSlice.actions;
export default globalSlice.reducer;
