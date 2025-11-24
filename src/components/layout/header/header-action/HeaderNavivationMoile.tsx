'use client'

import LanguageSwitcher from '@/components/layout/header/LanguageSwitcher'
import StemifyLogo from '@/components/shared/StemifyLogo'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { navRoutes } from '@/utils/navRoutes'
// highlight-start
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// highlight-end

export default function HeaderNavigationMobile() {
  const pathname = usePathname()
  const userRole = useAppSelector((state) => state.auth.user?.userRole) || UserRole.GUEST
  const navItems = navRoutes[userRole as keyof typeof navRoutes]
  const t = useTranslations('Header')
  const locale = useLocale()

  return (
    <div className='h-20 items-center gap-10'>
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
                  href={fullPath}
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
