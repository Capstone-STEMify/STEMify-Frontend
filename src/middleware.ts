import { UserRole } from '@/types/userRole'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const userRole = req.nextauth.token?.role as string

    if (req.nextUrl.pathname.startsWith('/admin') && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/api/auth/signin'
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*', // chặn riêng admin route
    '/resource/lesson/:path*' // chặn resource lesson như bạn có
  ]
}
