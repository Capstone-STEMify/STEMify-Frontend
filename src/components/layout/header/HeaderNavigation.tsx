'use client'

import StemifyLogo from '@/components/shared/StemifyLogo'
import { useAppSelector } from '@/hooks/redux-hooks'
import { EffectiveRole, HeaderRole, LicenseType, UserRole } from '@/types/userRole'
import { navRoutes } from '@/utils/navRoutes'
// highlight-start
import { useLocale, useTranslations } from 'next-intl'
// Sử dụng các import tiêu chuẩn của Next.js
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
// highlight-end

export default function HeaderNavigation() {
  const pathname = usePathname()
  const t = useTranslations('Header')
  // highlight-next-line
  const locale = useLocale() // Lấy ngôn ngữ hiện tại

  // Lấy user và currentLicenseType từ Redux
  const user = useAppSelector((state) => state.auth.user)
  const currentRole = useAppSelector((state) => state.selectedOrganization.currentRole)

  // Xác định effectiveRole
  // Nêu userRole là MEMBER thì effectiveRole là currentLicenseType
  const isHeaderLicenseType = (role: any): role is LicenseType.STUDENT | LicenseType.TEACHER => {
    return role === LicenseType.STUDENT || role === LicenseType.TEACHER
  }

  // Default
  let headerRole: HeaderRole = UserRole.GUEST

  if (user?.userRole === UserRole.MEMBER && currentRole && isHeaderLicenseType(currentRole)) {
    headerRole = currentRole
  }

  const navItems = navRoutes[headerRole] ?? []

  return (
    <div className='flex h-20 items-center gap-10'>
      <div className='h-20'>
        <StemifyLogo />
      </div>
      <nav className='flex h-fit w-full items-center'>
        {/* Desktop Navigation */}
        <ul className='hidden h-full items-center justify-center gap-1 lg:flex'>
          {navItems.map((item, index) => {
            // highlight-start
            // Tạo đường dẫn đầy đủ để so sánh và để gán cho href
            const fullPath = `/${locale}${item.path === '/' ? '' : item.path}`
            const isActive = pathname === fullPath
            // highlight-end

            return (
              <li key={index} className={'relative flex h-full items-center'}>
                <Link
                  // highlight-next-line
                  href={fullPath} // Sử dụng đường dẫn đầy đủ có tiền tố ngôn ngữ
                  className={`group relative px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? 'text-amber-custom-600' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {t(item.name)}
                  <span
                    className={`bg-amber-custom-400 absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile Navigation */}
        <ul className='flex w-full flex-col space-y-1 lg:hidden'>
          {navItems.map((item, index) => {
            // highlight-start
            const fullPath = `/${locale}${item.path === '/' ? '' : item.path}`
            const isActive = pathname === fullPath
            // highlight-end
            return (
              <li key={index} className='w-full'>
                <Link
                  // highlight-next-line
                  href={fullPath} // Sử dụng đường dẫn đầy đủ có tiền tố ngôn ngữ
                  className={`block w-full rounded-lg px-4 py-2.5 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-amber-custom-50 text-amber-custom-600 border-amber-custom-400 border-l-4'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t(item.name)}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
