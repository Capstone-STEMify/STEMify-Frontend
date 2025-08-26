// middleware.ts
import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { UserRole } from '@/types/userRole'

const intlMiddleware = createMiddleware(routing)

export default withAuth(
  (req) => {
    const { pathname, search } = req.nextUrl
    const missingLocale = routing.locales.every((locale) => !pathname.startsWith(`/${locale}`))

    if (missingLocale) {
      return NextResponse.redirect(new URL(`/vi${pathname}${search}`, req.url))
    }

    const res = intlMiddleware(req)
    const role = req.nextauth.token?.role
    const isAdmin = role === UserRole.ADMIN

    const locale = pathname.split('/')[1] || 'vi'

    if (isAdmin && !pathname.startsWith(`/${locale}/admin`)) {
      return NextResponse.redirect(new URL(`/${locale}/admin/course`, req.url))
    }

    if (!isAdmin && pathname.startsWith(`/${locale}/admin`)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url))
    }

    return res
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl
        const locales = routing.locales
        const matched = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
        const locale = matched ?? 'vi'
        const pathNoLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

        const PUBLIC_PATHS = ['/', '/unauthorized', '/api/auth/signin']

        const isPublic =
          PUBLIC_PATHS.includes(pathNoLocale) ||
          (!pathname.startsWith('/admin') && !pathname.startsWith('/resource/lesson'))

        return isPublic ? true : !!token
      }
    },
    pages: {
      signIn: '/api/auth/signin'
    }
  }
)

export const config = {
  matcher: ['/((?!_next|.*\\..*|api|trpc|_vercel).*)']
}
