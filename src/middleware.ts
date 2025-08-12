// middleware.ts
import {NextResponse} from 'next/server'
import {withAuth} from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'
import {UserRole} from '@/types/userRole'

// Khởi tạo i18n middleware 1 lần
const intlMiddleware = createMiddleware(routing)

export default withAuth(
  (req) => {
    // Chạy i18n trước (thêm/chuẩn hoá locale, redirect khi thiếu locale, v.v.)
    const res = intlMiddleware(req)

    const {pathname} = req.nextUrl
    const userRole = req.nextauth.token?.role as string | undefined

    // Chặn /admin nếu không phải ADMIN
    if (pathname.startsWith('/admin') && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Bạn có thể thêm các rule khác, ví dụ cho /resource/lesson ở đây nếu cần

    // Nếu không có chặn gì thêm, trả về response từ i18n để giữ nguyên hành vi locale
    return res
  },
  {
    // Chỉ bắt đăng nhập cho các route "nhạy cảm"
    callbacks: {
      authorized: ({req, token}) => {
        const {pathname} = req.nextUrl

        // Public routes (không yêu cầu đăng nhập)
        const PUBLIC_PATHS = ['/unauthorized', '/api/auth/signin']

        const isPublic =
          PUBLIC_PATHS.includes(pathname) ||
          (!pathname.startsWith('/admin') &&
           !pathname.startsWith('/resource/lesson'))

        // Public thì cho qua, còn lại phải có token
        return isPublic ? true : !!token
      }
    },
    // Nếu chưa đăng nhập, điều hướng tới trang sign-in (mặc định của NextAuth)
    pages: {
      signIn: '/api/auth/signin'
      // Nếu bạn có trang tuỳ biến: signIn: '/auth/signin'
    }
  }
)

// Chạy middleware cho mọi page (trừ file tĩnh, nội bộ Next, API, v.v.)
export const config = {
  matcher: [
    '/((?!_next|.*\\..*|api|trpc|_vercel).*)'
    // '/admin/:path*', '/resource/lesson/:path*' đã bao phủ bởi pattern trên;
    // giữ lại nếu bạn muốn rõ ràng hơn cũng được.
  ]
}
