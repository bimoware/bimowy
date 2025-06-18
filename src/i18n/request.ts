import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  // Normally, use english
  let locale = 'en'

  // If locale is in the cookies, use it instead
  try {
    const cookieStore = await cookies()
    locale = cookieStore.get('NEXT_LOCALE')?.value || locale
  } catch { }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`))
      .default
  }
})
