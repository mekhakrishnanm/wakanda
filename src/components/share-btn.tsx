import type React from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import type { GameQuery } from '@azuro-org/toolkit';
import dayjs from 'dayjs';
import { useToast } from './ui/use-toast';

interface ShareButtonProps {
  game: GameQuery['games'][0];
  gameId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ game, gameId }) => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const generateShareContent = useCallback(() => {
    const { participants, league, sport, startsAt } = game;
    const team1 = participants[0]?.name || 'Team 1';
    const team2 = participants[1]?.name || 'Team 2';
    const leagueName = league.name;
    const sportName = sport.name;
    const gameDate = dayjs(+startsAt * 1000).format('DD MMMM YYYY HH:mm');
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${gameId}`;

    const shareText = `
🚨 Exciting ${sportName} Match Alert! 🚨

🏆 ${team1} vs ${team2}
🏟️ ${leagueName}
🗓️ ${gameDate}

💥 Don't miss out on the action at Wakanda Bet! 💥

💥 Check out the full match details! 🎲
${shareUrl}

⏰ Game starts soon! Place your bets now! 🎲

#WakandaBet #SportsBetting #${sportName.replace(/\s+/g, '')}
    \n`;

    return { shareText, shareUrl };
  }, [game, gameId]);

  const handleShare = async () => {
    if (isSharing) {
      return;
    }
    setIsSharing(true);

    try {
      const { shareText, shareUrl } = generateShareContent();
      // const imageUrl = "https://app.wakanda.bet/banner.png";

      // Fetch image
      let imageFile: File | null = null;
      try {
        const response = await fetch('/banner.png');
        const blob = await response.blob();
        imageFile = new File([blob], 'banner.png', { type: blob.type });
      } catch (error) {
        console.warn('Failed to fetch image:', error);
      }

      // Prepare share data
      const shareData: ShareData = {
        title: 'Wakanda Bet - Exciting Sports Betting',
        text: `${shareText}\n\n${shareUrl}`,
        url: shareUrl,
      };

      if (imageFile) {
        shareData.files = [imageFile];
      }

      // Try Web Share API
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: 'Shared successfully!',
          description: 'The bet details have been shared.',
        });
      } else {
        // Fallback options
        const encodedText = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodedText}`;

        // Open sharing options dialog
        const shareOptions = [
          {
            name: 'Copy to Clipboard',
            action: async () => {
              await navigator.clipboard.writeText(
                `${shareText}\n\n${shareUrl}`
              );
              toast({
                title: 'Copied to clipboard',
                description:
                  'Share details copied. You can now paste them into your preferred app.',
              });
            },
          },
          {
            name: 'Share on Telegram',
            action: () => {
              window.open(telegramShareUrl, '_blank');
            },
          },
          // Add more platform-specific sharing options here
        ];

        // Display sharing options to the user
        // This is a placeholder. In a real implementation, you'd show a modal or dropdown with these options.
        console.log('Share options:', shareOptions);
        toast({
          title: 'Choose sharing option',
          description: 'Select how you want to share this content.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Sharing failed',
        description: 'Unable to share. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      className='border border-[#ffffff2c] h-[56px] w-full mx-auto max-w-md rounded-[16px] flex justify-center items-center space-x-3 mt-10'
      disabled={isSharing}
      onClick={handleShare}
      variant={'ghost'}
    >
      <Image
        alt='share'
        className='w-5 h-auto'
        height={24}
        src='/svg/share-icon.svg'
        width={24}
      />
      <span className='text-[20px] font-normal'>
        {isSharing ? 'Sharing...' : 'Share with a friend'}
      </span>
    </Button>
  );
};

export default ShareButton;
