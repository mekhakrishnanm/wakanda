import React from 'react';
import { type Bet, useLiveBets, usePrematchBets } from '@azuro-org/sdk';
import type { GameQuery, MarketOutcome } from '@azuro-org/toolkit';
import { Loader, ScrollText } from 'lucide-react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import { defaultTeamLogo } from '@/lib/constants';
import { getDisplayAmount } from '@/lib/balance';
import { useAppDispatch } from '@/redux/redux-provider';
import {
  setBetSummaryModalOpen,
  setSelectedBetSummary,
} from '@/redux/slices/events-slice';

type Participant = GameQuery['games'][0]['participants'][0];

const BetItem = React.memo(
  ({ item, selectionNames }: { item: Bet; selectionNames: string[] }) => {
    const dispatch = useAppDispatch();
    const selectionName = item.outcomes[0].selectionName;

    const getSelectionName = (
      selectionName: string,
      participants: GameQuery['games'][0]['participants']
    ) => {
      if (selectionName === '1' || selectionName === selectionNames[0]) {
        return participants[0].name;
      }
      if (
        selectionName === '2' ||
        selectionName === selectionNames[selectionNames.length - 1]
      ) {
        return participants[1].name;
      }
      if (selectionName === 'X' || selectionName === selectionNames[1]) {
        return 'Match Draw';
      }
      return '';
    };

    return (
      <div
        className='item font-normal relative'
        onClick={() => {
          dispatch(setBetSummaryModalOpen(true));
          dispatch(setSelectedBetSummary(item));
        }}
      >
        <div className='flex items-center space-x-5'>
          <BetItemImage
            participants={item.outcomes[0].game.participants}
            selectionName={selectionName}
          />
          <span className='text-white text-[16px]'>
            {getSelectionName(
              selectionName,
              item.outcomes[0].game.participants
            )}
          </span>
        </div>
        <div className='flex items-center justify-end space-x-2'>
          <span className='text-white text-[14px]'>
            ${getDisplayAmount(Number(item.amount))}
          </span>
        </div>
      </div>
    );
  }
);

const BetItemImage = React.memo(
  ({
    selectionName,
    participants,
  }: {
    selectionName: string;
    participants: Participant[];
  }) => {
    if (selectionName === 'X') {
      return (
        <div className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center'>
          <div className='flex items-center justify-start'>
            {/* eslint-disable-next-line */}
            <img
              alt={participants[0]?.name || ''}
              className='rounded-full object-scale-down'
              height={24}
              onError={(e) => {
                e.currentTarget.src = defaultTeamLogo;
                e.currentTarget.classList.add('invert-[0.5]');
              }}
              src={participants[0]?.image || defaultTeamLogo}
              width={24}
            />
            {/* eslint-disable-next-line */}
            <img
              alt={participants[1]?.name || ''}
              className='rounded-full object-scale-down -ml-3'
              height={24}
              onError={(e) => {
                e.currentTarget.src = defaultTeamLogo;
                e.currentTarget.classList.add('invert-[0.5]');
              }}
              src={participants[1]?.image || defaultTeamLogo}
              width={24}
            />
          </div>
        </div>
      );
    }
    const participantIndex = selectionName === '1' ? 0 : 1;
    return (
      <div className='w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center'>
        {/* eslint-disable-next-line */}
        <img
          alt={participants[participantIndex]?.name || ''}
          className='rounded-full object-scale-down'
          height={32}
          onError={(e) => {
            e.currentTarget.src = defaultTeamLogo;
            e.currentTarget.classList.add('invert-[0.5]');
          }}
          src={participants[participantIndex]?.image || defaultTeamLogo}
          width={32}
        />
      </div>
    );
  }
);

const PlacedBets = ({
  gameId,
  outcomes,
}: {
  gameId: string;
  outcomes: MarketOutcome[];
}) => {
  const selectionNames = outcomes.map((outcome) => outcome.selectionName);
  const { address } = useAccount();
  const props = {
    filter: {
      bettor: (address as Address) || '0x',
    },
  };
  const { loading: isPrematchLoading, bets: prematchBets } =
    usePrematchBets(props);
  const { loading: isLiveLoading, bets: liveBets } = useLiveBets(props);
  const allBets = [...prematchBets, ...liveBets].filter(
    (bet) => bet.outcomes[0].game.gameId === gameId
  );

  return (
    <div className='placed-bet-card mt-8 rounded-3xl p-4 max-w-md mx-auto'>
      <h2 className='text-white text-[20px] font-normal text-center w-full mb-4'>
        Placed Bets
      </h2>
      {isLiveLoading || isPrematchLoading ? (
        <div className='flex flex-col gap-y-2 justify-center items-center my-8'>
          <Loader className='animate-spin mr-2 w-5 ' />
          <span className='text-white'>Loading...</span>
        </div>
      ) : allBets.length > 0 ? (
        <div className='list'>
          {allBets.map((item) => (
            <BetItem
              item={item}
              key={item.createdAt}
              selectionNames={selectionNames}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col gap-3 my-8 items-center justify-center text-white/70'>
          <ScrollText className='text-2xl' />
          <div className='text-[14px]'>No bets placed yet</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PlacedBets);
