// import { NextResponse } from 'next/server'
// import { withAuth } from 'next-auth/middleware'
// import createMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'
// import { UserRole } from '@/types/userRole'

// const intlMiddleware = createMiddleware(routing)

// export default withAuth(
//   (req) => {
//     const { pathname, origin, host } = req.nextUrl

//     // --- chọn NEXTAUTH_URL động theo domain ---
//     if (host.includes('robotsteam.com.vn')) {
//       process.env.NEXTAUTH_URL = 'https://robotsteam.com.vn'
//     } else if (host.includes('stemifi.com')) {
//       process.env.NEXTAUTH_URL = 'https://www.stemifi.com'
//     }

//     const res = intlMiddleware(req)
//     const role = req.nextauth.token?.role
//     const hasManagementRole = role === UserRole.ADMIN || role === UserRole.STAFF

//     const locale = pathname.split('/')[1] || 'vi'

//     if (hasManagementRole && !pathname.startsWith(`/${locale}/admin`) && !pathname.startsWith(`/${locale}/straw-lab`)) {
//       return NextResponse.redirect(new URL(`/${locale}/admin/curriculum`, req.url))
//     }

//     if (!hasManagementRole && pathname.startsWith(`/${locale}/admin`)) {
//       return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url))
//     }

//     return res
//   },
//   {
//     callbacks: {
//       authorized: ({ req, token }) => {
//         console.log('Middleware authorized callback', { token })
//         const { pathname } = req.nextUrl
//         const locales = routing.locales
//         const matched = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
//         const locale = matched ?? 'vi'
//         const pathNoLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

//         const PUBLIC_PATHS = ['/', '/unauthorized', '/api/auth/signin']

//         // const isPublic = PUBLIC_PATHS.includes(pathNoLocale) || !pathname.startsWith('/admin')

//         // development
//         const isPublic = PUBLIC_PATHS.includes(pathNoLocale)

//         return isPublic ? true : !!token
//       }
//     },
//     pages: {
//       signIn: '/api/auth/signin'
//     }
//   }
// )

// export const config = {
//   matcher: ['/((?!_next|.*\\..*|api|trpc|_vercel).*)']
// }
import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { EffectiveRole, LicenseType, UserRole } from '@/types/userRole'
import { User } from 'lucide-react'

const intlMiddleware = createMiddleware(routing)

export default withAuth(
  async (req) => {
    const { pathname, host } = req.nextUrl
    const locale = pathname.split('/')[1] || 'vi'

    // --- Chọn NEXTAUTH_URL động theo domain ---
    // if (host.includes('robotsteam.com.vn')) {
    //   process.env.NEXTAUTH_URL = 'https://robotsteam.com.vn'
    // } else if (host.includes('stemifi.com')) {
    //   process.env.NEXTAUTH_URL = 'https://www.stemifi.com'
    // }

    // 🔹 Lấy token từ cookie
    const token = await getToken({ req, secret: process.env.AUTH_SECRET })
    // console.log('Middleware token:', token)
    // 🔹 Nếu không có token -> next-intl middleware xử lý tiếp
    if (!token) return intlMiddleware(req)

    // 🔹 Nếu token hết hạn
    if (token?.exp && Date.now() >= token.exp * 1000) {
      // console.log('Token expired → redirect to signin')
      return NextResponse.redirect(new URL(`/${locale}/api/auth/signin`, req.url))
    }

    const systemRole = token?.role as UserRole | undefined
    console.log('🔑 Middleware detected role:', systemRole)
    let currentRole: EffectiveRole = UserRole.GUEST

    if (systemRole === UserRole.ADMIN || systemRole === UserRole.STAFF) {
      currentRole = systemRole
    }
    if (systemRole === UserRole.MEMBER && token.organizations && token.organizations.organizations?.length > 0) {
      const firstOrg = token.organizations.organizations[0]
      const activeSub = firstOrg.roles[0]
      if (activeSub) {
        currentRole = activeSub.type
      }
    }

    const roleRedirectMap: Record<EffectiveRole, string> = {
      [UserRole.ADMIN]: `/${locale}/admin/course`,
      [UserRole.STAFF]: `/${locale}/admin/course`,
      [LicenseType.ORGANIZATION_ADMIN]: `/${locale}/organization/dashboard`,
      [UserRole.GUEST]: `/${locale}`,
      [LicenseType.STUDENT]: `/${locale}`,
      [LicenseType.TEACHER]: `/${locale}`
    }

    // 🔹 Nếu user login mà ở root path -> redirect theo role
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      const target = roleRedirectMap[currentRole]
      const targetUrl = new URL(target, req.url)
      if (target && targetUrl.toString() !== req.url) {
        return NextResponse.redirect(targetUrl)
      }
    }

    // 🔹 Kiểm tra quyền truy cập vào khu vực admin/staff
    const isAdminArea = pathname.startsWith(`/${locale}/admin`)
    const isLearningArea = pathname.startsWith(`/${locale}/learning`)

    if (isAdminArea && ![UserRole.ADMIN, UserRole.STAFF].includes(systemRole!)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url))
    }

    // ❌ Không phải student (hoặc staff/admin) mà vào learning
    if (isLearningArea && ![UserRole.MEMBER, UserRole.STAFF, UserRole.ADMIN].includes(systemRole!)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url))
    }

    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl
        const locales = routing.locales
        const matched = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
        const locale = matched ?? 'vi'
        const pathNoLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

        const PUBLIC_PATHS = [
          '/',
          '/unauthorized',
          '/api/auth/signin',
          '/plans',
          '/contact',
          '/sso',
          '/invitation/success'
        ]

        const isPublic = PUBLIC_PATHS.includes(pathNoLocale)

        // sử dụng khi gần ra hội đồng
        // const isPublic =
        //   PUBLIC_PATHS.includes(pathNoLocale) ||
        //   (pathNoLocale.startsWith('/resource') && !pathNoLocale.startsWith('/resource/lesson/')) ||
        //   pathNoLocale.startsWith('/shop') ||
        //   pathNoLocale.startsWith('/plan') ||
        //   pathNoLocale.startsWith('/shopping-basket')
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
