import { loadMessages } from 'i18n/loadMessages'
import { routing } from 'i18n/routing'
import { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import './globals.css'
import { auth, authOptions } from '@/libs/auth/authOptions'
import { getServerSession } from 'next-auth'
import Providers from '@/providers/Providers'

export const metadata: Metadata = {
  title: 'STEMify Education',
  icons: { icon: '/favicon.ico' }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: any }) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  let messages
  try {
    messages = await loadMessages(locale)
  } catch {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers session={session}>
            <main>{children}</main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
