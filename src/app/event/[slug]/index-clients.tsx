// app/event/[slug]/index-clients.tsx
'use client';
import React, { useMemo, useEffect, useState } from 'react';
import { useGame, useGameStatus, useChain } from '@azuro-org/sdk';
import type { GameQuery } from '@azuro-org/toolkit';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import InfoIcon from '@/public/svg/info.svg';
import IndividualEvent from './individual-event';
import { IndividualEventSkeleton } from '@/components/layouts/event-loading-layout';
import { polygon } from 'wagmi/chains';
import IndividualBetSummaryModal from '@/app/bet-history/individual-bet-summary-modal';

type ContentProps = {
  game: GameQuery['games'][0];
  isGameInLive: boolean;
  isCorrectChain: boolean;
};

// Optimized useGame hook wrapper
const useOptimizedGame = (gameId: string) => {
  const result = useGame({
    gameId,
  });
  return useMemo(() => result, [result]);
};

const EventIndexClients = ({ gameIdVal }: { gameIdVal?: string }) => {
  const params = useParams();
  const gameId = gameIdVal ?? (params.slug as string);
  const { loading, game, isGameInLive } = useOptimizedGame(gameId);
  const { appChain } = useChain();
  const [isCorrectChain, setIsCorrectChain] = useState(true);

  useEffect(() => {
    if (isGameInLive) {
      setIsCorrectChain(appChain.id === polygon.id);
    }
  }, [isGameInLive, appChain.id]);

  if (loading) {
    return <IndividualEventSkeleton />;
  }
  if (!game) {
    return <GameNotFound />;
  }

  return (
    <Content
      game={game}
      isCorrectChain={isCorrectChain}
      isGameInLive={isGameInLive}
    />
  );
};

const GameNotFound: React.FC = () => (
  <div className='event-card max-w-md mx-auto mt-8 tracking-wider font-medium flex flex-col w-full h-[128px] justify-center items-center p-4 rounded-[16px] text-sm text-white/60'>
    <Image alt='active' className='mb-2' quality={100} src={InfoIcon} />
    Game Info Not Found
  </div>
);

const Content: React.FC<ContentProps> = React.memo(
  ({ game, isGameInLive, isCorrectChain }) => {
    const { status } = useGameStatus({
      graphStatus: game.status,
      startsAt: +game.startsAt,
      isGameExistInLive: isGameInLive,
    });

    return (
      <>
        <IndividualEvent
          game={game}
          gameStatus={status}
          isCorrectChain={isCorrectChain}
          isGameInLive={isGameInLive}
        />
        <IndividualBetSummaryModal />
      </>
    );
  }
);

export default EventIndexClients;
