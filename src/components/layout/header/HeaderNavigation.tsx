'use client'

import StemifyLogo from '@/components/shared/StemifyLogo'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { navRoutes } from '@/utils/navRoutes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HeaderNavigation() {
  const pathname = usePathname()
  // const navItems = navRoutes[UserRole.GUEST]
  const userRole = useAppSelector((state) => state.auth.user?.role) || UserRole.GUEST
  const navItems = navRoutes[userRole as UserRole]

  return (
    <div className='flex h-20 items-center gap-10'>
      <div className='h-20'>
        <StemifyLogo />
      </div>
      <nav className='flex h-fit w-full items-center'>
        {/* Desktop Navigation - Horizontal */}
        <ul className='hidden h-full items-center justify-center gap-1 lg:flex'>
          {navItems.map((item, index) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname === item.path
            return (
              <li key={index} className={'relative flex h-full items-center'}>
                <Link
                  href={item.path}
                  className={`group relative px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive ? 'text-amber-custom-600' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
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

        {/* Mobile Navigation - Vertical Stack */}
        <ul className='flex w-full flex-col space-y-1 lg:hidden'>
          {navItems.map((item, index) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname === item.path
            return (
              <li key={index} className='w-full'>
                <Link
                  href={item.path}
                  className={`block w-full rounded-lg px-4 py-2.5 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-amber-custom-50 text-amber-custom-600 border-amber-custom-400 border-l-4'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
