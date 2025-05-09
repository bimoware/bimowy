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
  title: 'Bimowy',
  icons: '/svgs/home.svg'
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
      <body className='flex w-screen h-screen p-3 gap-3'>
        <NextIntlClientProvider>
          <SideBar />
          {children}
          {process.env.NODE_ENV == 'production' && <SpeedInsights />}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
