import type React from 'react';
import Header from './header';
import Footer from './footer';
import { Toaster } from '../ui/toaster';
import PWAInstallPrompt from '../PWAInstallPrompt';
import AddToHomeScreen from '../add-to-home-screen';
import NewFreeBetModal from '../new-free-bet-modal';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <Toaster />
      <PWAInstallPrompt />
      <AddToHomeScreen />
      <NewFreeBetModal />
    </>
  );
};

export default MainLayout;
