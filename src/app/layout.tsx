import { Outfit } from 'next/font/google'
import SideBar from '../components/SideBar'
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import './style.css'
import { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const outfit = Outfit({
  subsets: ['latin']
})
export const metadata: Metadata = {
  title: 'Bimowy - When math works',
  icons: '/svgs/home.svg',
  description:
    'Bimowy is a free, open-source, exercices-focused math platform for students who feel stuck when trying to train on any math subject.' +
    ' With interactive learning and feedback loop, math becomes free from frustration and starts being actually fun.',
  metadataBase: new URL(
    process.env.NODE_ENV == 'production'
      ? `https://bimowy.dev/`
      : 'http://localhost:3000/'
  ),
  twitter: {
    card: 'summary'
  }
}

export const viewport: Viewport = { themeColor: '#FFFFFE' }


export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={outfit.className}>
      <body className='flex w-screen h-screen'>
        <NextIntlClientProvider>
          <SideBar />
          {children}
          {process.env.NODE_ENV == 'production' && <SpeedInsights />}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
