import Providers from '@/providers/Providers'
import { loadMessages } from 'i18n/loadMessages'
import { routing } from 'i18n/routing'
import { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'STEMify Education',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  let messages
  try {
    messages = await loadMessages(locale)
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <main>{children}</main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
