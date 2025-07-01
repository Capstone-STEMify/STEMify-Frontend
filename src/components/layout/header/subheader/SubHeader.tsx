'use client'
import { UserRole } from '@/types/userRole'
import { navRoutes } from '@/utils/navRoutes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type SubHeaderProps = {
  role: UserRole
}

export default function SubHeader({ role }: SubHeaderProps) {
  const pathName = usePathname()
  const routes = navRoutes[role]

  return (
    <nav className='mt-4'>
      <ul className='from-sky-custom-300 flex items-center justify-center gap-8 rounded-xl border border-white/20 bg-gradient-to-r to-blue-300 px-6 py-3 shadow-md backdrop-blur-sm'>
        {routes.map((item, index) => {
          const isActivePath = item.path === '/' ? pathName === '/' : pathName.startsWith(item.path)

          return (
            <li key={index}>
              <Link
                href={item.path}
                className={`group relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActivePath
                    ? 'bg-sky-custom-600 font-semibold text-white shadow-lg'
                    : 'text-sky-custom-600 hover:bg-sky-custom-600/80 hover:text-white'
                } `}
              >
                {item.name}
                {/* Active indicator */}
                {isActivePath && (
                  <div className='absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rounded-full bg-white shadow-sm' />
                )}
                {/* Hover effect */}
                <div className='absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
