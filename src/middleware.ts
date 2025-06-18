import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return implementIntlMiddleware(
    request,
    NextResponse.next()
  )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const supportedLocales = ['en', 'fr']
const defaultLocale = 'en'

export function implementIntlMiddleware(request: NextRequest, response: NextResponse) {

  const cookieLocale =
    request.cookies.get('NEXT_LOCALE')?.value

  // IF "NEXT LOCALE" IS ALREADY IN THE REQUEST, just send it back
  if (
    cookieLocale &&
    supportedLocales.includes(cookieLocale)
  ) {
    return NextResponse.next()
  }

  // ELSE, PUT IT IN
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

  response.cookies.set('NEXT_LOCALE', detectedLocale)
  return response
}