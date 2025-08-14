// middleware.ts
import {NextResponse} from 'next/server'
import {withAuth} from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'
import {UserRole} from '@/types/userRole'

const intlMiddleware = createMiddleware(routing)

export default withAuth(
  (req) => {
    const res = intlMiddleware(req)

    const {pathname} = req.nextUrl
    const userRole = req.nextauth.token?.role as string | undefined

    if (pathname.startsWith('/admin') && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return res
  },
  {
    callbacks: {
      authorized: ({req, token}) => {
        const {pathname} = req.nextUrl

        const PUBLIC_PATHS = ['/unauthorized', '/api/auth/signin']

        const isPublic =
          PUBLIC_PATHS.includes(pathname) ||
          (!pathname.startsWith('/admin') &&
           !pathname.startsWith('/resource/lesson'))

        return isPublic ? true : !!token
      }
    },
    pages: {
      signIn: '/api/auth/signin'
    }
  }
)

export const config = {
  matcher: [
    '/((?!_next|.*\\..*|api|trpc|_vercel).*)'
  ]
}
