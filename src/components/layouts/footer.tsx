'use client';
import React, { useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MyBetsIcon from '../svg/my-bets-icon';
import HomeIcon from '../svg/home-icon';
import SettingsIcon from '../svg/settings-icon';
import ActiveTabShadow from '@/public/svg/active-tab-shadow.svg';
import { useDetailedBetslip } from '@azuro-org/sdk';
import Link from 'next/link';

type NavItemsType = 'bet-history' | 'events' | 'settings';

const navItems: {
  id: NavItemsType;
  Icon: React.ElementType;
}[] = [
  { id: 'bet-history', Icon: MyBetsIcon },
  { id: 'events', Icon: HomeIcon },
  { id: 'settings', Icon: SettingsIcon },
];

const Footer: React.FC = React.memo(() => {
  const pathname = usePathname();
  const { freeBets } = useDetailedBetslip();
  const targetRef = useRef<HTMLDivElement>(null);

  const activeTab = useMemo(() => {
    return (pathname.split('/')[1] as NavItemsType) || 'events';
  }, [pathname]);

  const isActive = useCallback(
    (nav: string) => {
      return activeTab === nav;
    },
    [activeTab]
  );

  const getActiveShadowStyle = useCallback(() => {
    const index = navItems.findIndex((item) => item.id === activeTab);
    const width = (33.33 * Number(targetRef.current?.clientWidth)) / 100;
    const translateVal = index === 0 ? -width : index === 2 ? width : 0;
    const translateX = `${translateVal}px`;
    let rotate = '0deg';
    let bottom = '12px';

    if (index === -1) {
      return {
        transform: `translateX(${33.33}%) rotate(${rotate})`,
        bottom: '-70px',
      };
    }

    switch (activeTab) {
      case 'bet-history':
        rotate = '-7deg';
        bottom = '0px';
        break;
      case 'settings':
        rotate = '5deg';
        bottom = '0px';
        break;
    }

    return {
      transform: `translateX(${translateX}) rotate(${rotate})`,
      bottom,
    };
  }, [activeTab]);

  return (
    <footer
      className='w-full max-w-md mx-auto fixed bottom-0 left-0 right-0 z-[100]'
      id='mobile-footer'
    >
      <div
        className='top-layer w-full h-[92px] absolute bottom-0 flex justify-center items-start pt-3.5'
        ref={targetRef}
      >
        {navItems.map(({ id, Icon }, index) =>
          index === 0 ? (
            <a
              className='relative flex-1 flex-center flex-col'
              href={`/${id}`}
              key={id}
              rel='noopener noreferrer nofollow'
            >
              <div
                className={`relative ${
                  index === 0
                    ? 'pt-[6px] rotate-[-4deg]'
                    : index === 2
                      ? 'pt-[6px] rotate-[7deg]'
                      : ''
                }`}
              >
                <Icon
                  className='relative z-[10] active:scale-[0.9] transition-all'
                  data-active={isActive(id)}
                  isActive={isActive(id)}
                  role='button'
                />
              </div>
            </a>
          ) : (
            <Link
              className='relative flex-1 flex-center flex-col'
              href={`/${id}`}
              key={id}
            >
              <div
                className={`relative ${
                  index === 0
                    ? 'pt-[6px] rotate-[-4deg]'
                    : index === 2
                      ? 'pt-[6px] rotate-[7deg]'
                      : ''
                }`}
              >
                <Icon
                  className='relative z-[10] active:scale-[0.9] transition-all'
                  data-active={isActive(id)}
                  isActive={isActive(id)}
                  role='button'
                />
                {index === 1 && freeBets && freeBets.length > 0 && (
                  <div className='absolute object-contain -top-2 -right-10 overflow-hidden'>
                    <Image
                      alt='free-badge'
                      className=''
                      height={50}
                      src='/img/free-badge.png'
                      width={50}
                    />
                  </div>
                )}
              </div>
            </Link>
          )
        )}
        <div
          className='active-shadow absolute w-[150px] transition-all duration-300 ease-in-out'
          style={(() => getActiveShadowStyle())()}
        >
          <Image
            alt='active'
            className='mx-auto w-full h-auto'
            quality={100}
            src={ActiveTabShadow}
          />
        </div>
      </div>
      <div className='bottom-layer w-full h-10 absolute -bottom-1' />
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
