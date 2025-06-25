import { Outfit } from 'next/font/google'
const outfit = Outfit({ subsets: ['latin'] })

import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './style.css'
import { generateMetadataUtil } from '@/utils/sidebar';
import { LanguageCode } from '@/utils/locale';
import SideBarContainer from '@cpn/SideBar/SideBarContainer';

export async function generateMetadata() {
  return await generateMetadataUtil('home')
}

export const viewport: Viewport = { themeColor: '#FFFFFE' }

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale() as LanguageCode

  return (
    <html lang={locale} className={outfit.className}>
      <body className='w-screen h-screen'>
        <NextIntlClientProvider>
          <SideBarContainer {...{ locale }}>
            {children}
          </SideBarContainer>
        </NextIntlClientProvider>
        {process.env.NODE_ENV != 'development' && <SpeedInsights />}
      </body>
    </html>
  )
}