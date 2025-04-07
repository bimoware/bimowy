import { NextResponse, NextRequest } from 'next/server'

const supportedLocales = ['en', 'fr'] // Add your supported languages
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  // 1. Check if locale is already set in cookies
  const cookieLocale =
    request.cookies.get('NEXT_LOCALE')?.value

  if (
    cookieLocale &&
    supportedLocales.includes(cookieLocale)
  ) {
    return NextResponse.next()
  }

  // 2. If not, detect from browser headers
  const acceptLanguage = request.headers.get(
    'accept-language'
  )
  let detectedLocale = defaultLocale

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
    detectedLocale = supportedLocales.includes(
      preferredLocale
    )
      ? preferredLocale
      : defaultLocale
  }

  // 3. Set the locale in a cookie for future requests
  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', detectedLocale)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
