// middleware.ts
import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { UserRole } from '@/types/userRole'

const intlMiddleware = createMiddleware(routing)

export default withAuth(
  (req) => {
    const res = intlMiddleware(req)
    const role = req.nextauth.token?.role
    const isAdmin = role === UserRole.ADMIN

    const { pathname } = req.nextUrl

    if (isAdmin && pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/course', req.url))
    }

    if (!isAdmin && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return res
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl

        const PUBLIC_PATHS = ['/unauthorized', '/api/auth/signin']

        const isPublic =
          PUBLIC_PATHS.includes(pathname) ||
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
