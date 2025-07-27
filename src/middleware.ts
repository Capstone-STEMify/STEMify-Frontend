// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'
// import { UserRole } from '@/types/userRole'

// const routeRoleMap: Record<string, UserRole[]> = {
//   '/my-learning': [UserRole.STUDENT],
//   '/resource/': [UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER, UserRole.STAFF],
//   '/profile': [UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER, UserRole.STAFF]
// }

// function normalizePath(path: string) {
//   return path.replace(/\/+$/, '')
// }

// function getMatchedBaseRoute(pathname: string): string | null {
//   const normalizedPath = normalizePath(pathname)
//   return (
//     Object.keys(routeRoleMap).find((base) => {
//       const normalizedBase = normalizePath(base)
//       console.log('normalizedBase', normalizedBase, 'normalizedPath', normalizedPath)
//       return normalizedPath === normalizedBase || normalizedPath.startsWith(`${normalizedBase}/`)
//     }) ?? null
//   )
// }

// export async function middleware(req: NextRequest) {
//   if (process.env.DISABLE_MIDDLEWARE === 'true') {
//     console.log('[Middleware Disabled]')
//     return NextResponse.next()
//   }

//   const { pathname } = req.nextUrl
//   console.log(`[Middleware] Checking token for route: ${pathname}`)

//   const matchedBase = getMatchedBaseRoute(pathname)

//   if (!matchedBase) {
//     return NextResponse.next()
//   }
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: true })

//   if (!token) {
//     const loginUrl = new URL('/api/auth/signin', req.url)
//     loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
//     loginUrl.searchParams.set('prompt', 'login')
//     return NextResponse.redirect(loginUrl)
//   } else {
//     console.log('[Middleware] ✅ Token:', token)
//   }

//   const role = token.role as UserRole
//   const allowedRoles = routeRoleMap[matchedBase]

//   if (!allowedRoles.includes(role)) {
//     return NextResponse.redirect(new URL('/unauthorized', req.url))
//   }

//   return NextResponse.next()
// }
// export { auth as middleware } from '@/libs/auth/authOptions'
export const config = {
  matcher: [
    // classroom routes
    // '/classroom/:path*',
    // // profile routes
    // '/profile',
    // // ----------------resource routes----------------
    // // course routes
    // '/resource/course/create',
    // '/resource/course/update/:path*',
    // // lesson routes
    // '/resource/lesson/:path*',
    // '/resource/lesson/create',
    // '/resource/lesson/update/:path*',
    // // ----------------resource routes----------------
    // // my learning routes
    // '/my-learning'
  ],
  pages: {
    signIn: '/api/auth/signin'
  }
}
