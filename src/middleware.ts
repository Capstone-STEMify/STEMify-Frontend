import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@/types/userRole'
import { authOptions } from '@/libs/auth/authOptions'

const routeRoleMap: Record<string, UserRole[]> = {
  // resource routes
  '/resource/create-course': [UserRole.STAFF],
  '/resource/create-lesson': [UserRole.STAFF],

  // classroom routes
  '/classroom/*': [UserRole.TEACHER, UserRole.STUDENT],

  // profile routes
  '/profile': [UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER, UserRole.STAFF]
}

function getMatchedRoute(pathname: string): string | null {
  return (
    Object.keys(routeRoleMap).find((route) => {
      if (route.endsWith('/*')) {
        const base = route.slice(0, -2)
        return pathname.startsWith(base + '/')
      }
      return pathname === route
    }) ?? null
  )
}

export async function middleware(req: NextRequest) {
  if (process.env.DISABLE_MIDDLEWARE === 'true') {
    console.log('[Middleware is disabled by env]')
    return NextResponse.next()
  }
  const { pathname } = req.nextUrl
  const matchedRoute = getMatchedRoute(pathname)

  if (matchedRoute) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET })
    console.log('[Middleware] Token:', token)

    if (!token) {
      // return NextResponse.redirect(new URL('/', req.url))
      const loginUrl = new URL('/api/auth/signin/oidc', req.url)
      loginUrl.searchParams.set('callbackUrl', '/')
      loginUrl.searchParams.set('prompt', 'login')
      return NextResponse.redirect(loginUrl)
    }

    const role = token.role as UserRole
    const allowedRoles = routeRoleMap[matchedRoute]

    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/classroom/:path*', '/profile', '/resource/create-lesson', '/resource/create-course']
}
