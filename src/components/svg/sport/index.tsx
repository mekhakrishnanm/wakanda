import AmericanFootballIcon from './american-football';
import BaseballIcon from './baseball';
import BasketballIcon from './basketball';
import BoxingIcon from './boxing';
import CodIcon from './cod';
import CricketSVG from './cricket';
import CryptoSVG from './crypto';
import Cs2Icon from './cs2';
import Dota2Icon from './dota-2';
import EsportsIcon from './esports';
import FootballIcon from './football';
import IceHockeyIcon from './ice-hockey';
import LolIcon from './lol';
import MmaIcon from './mma';
import OtherIcon from './other';
import PoliticsIcon from './politics';
import PubgIcon from './pubg';
import RugbyLeague from './rugby-league';
import RugbyUnion from './rugby-union';
import TennisIcon from './tennis';
import CsgoIcon from './csgo';
import React from 'react';

export const sportIcons = {
  'american-football': <AmericanFootballIcon />,
  baseball: <BaseballIcon />,
  basketball: <BasketballIcon />,
  boxing: <BoxingIcon />,
  cod: <CodIcon />,
  cricket: <CricketSVG />,
  crypto: <CryptoSVG />,
  cs2: <Cs2Icon />,
  csgo: <CsgoIcon />,
  'dota-2': <Dota2Icon />,
  esports: <EsportsIcon />,
  football: <FootballIcon />,
  'ice-hockey': <IceHockeyIcon />,
  lol: <LolIcon />,
  mma: <MmaIcon />,
  other: <OtherIcon />,
  politics: <PoliticsIcon />,
  pubg: <PubgIcon />,
  'rugby-league': <RugbyLeague />,
  'rugby-union': <RugbyUnion />,
  tennis: <TennisIcon />,
};

const Icon: React.FC<{
  slug: keyof typeof sportIcons;
  className?: string;
}> = ({ slug, className }) => {
  const IconComponent = sportIcons[slug];

  // If the slug doesn't match any key in the sportIcons object, return null or a fallback icon
  if (!IconComponent) {
    return null;
  }

  // Clone the SVG component and apply the className
  return React.cloneElement(IconComponent, {
    className: className || '',
  });
};

export default Icon;
