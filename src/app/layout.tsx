import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/redux/redux-provider';
import MainLayout from '@/components/layouts/main-layout';
import localFont from 'next/font/local';
import { clsx } from 'clsx';
import { Providers } from '@/components/providers';
import { cookies } from 'next/headers';
import '@rainbow-me/rainbowkit/styles.css';
import { type ChainId, chains } from '@/lib/chains';
import { chiliz } from 'wagmi/chains';
import Script from 'next/script';

const ClashGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/ClashGrotesk-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashGrotesk-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashGrotesk-Variable.woff2',
      weight: '450 550',
      style: 'normal',
    },
  ],
  variable: '--font-ClashGrotesk',
});

export const metadata: Metadata = {
  applicationName: 'Wakanda Bets',
  title: 'Wakanda Bets',
  description: 'Wakanda Betting next app',
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.wakanda.bet',
    siteName: 'Wakanda Bets',
    title: 'Wakanda Bets',
    images: [
      {
        url: 'https://app.wakanda.bet/openGraph.png',
        width: 1200,
        height: 630,
        alt: 'Wakanda Bets',
      },
    ],
  },
  twitter: {
    title: 'Wakanda Bets',
    description: 'Wakanda Betting next app',
    card: 'summary_large_image',
    site: '@WakandaBets',
  },
  keywords: [
    'wakanda',
    'wakanda.bet',
    'wakandabets',
    'wakandabet',
    'wakanda-bets',
    'wakanda-bet',
    'wakanda-betting',
    'wakanda-betting-app',
    'betting',
    'sports-betting',
    'sports-betting-app',
    'azuro',
    'azuro-org',
    'gaming',
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Changed from 1 to 5
    userScalable: true, // Changed from false to true
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const _initialChainId = cookieStore.get('appChainId')?.value;
  const initialLiveState = JSON.parse(
    cookieStore.get('live')?.value || 'false'
  );

  const initialChainId =
    (_initialChainId &&
      (chains.find((chain) => chain.id === +_initialChainId)?.id as ChainId)) ||
    chiliz.id;

  return (
    <html lang='en'>
      <head>
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-59LQD73Z');
`}
        </Script>
      </head>
      <body className={clsx(ClashGrotesk.variable, 'dark')}>
        <noscript>
          <iframe
            height='0'
            src='https://www.googletagmanager.com/ns.html?id=GTM-59LQD73Z'
            style={{ display: 'none', visibility: 'hidden' }}
            title='google-tag-manager'
            width='0'
          />
        </noscript>
        <ReduxProvider>
          <Providers
            initialChainId={initialChainId}
            initialLiveState={initialLiveState}
            // initialState={initialState}
          >
            <MainLayout>{children}</MainLayout>
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
