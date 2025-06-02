'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HeaderNavigation() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Resource', href: '/resource' },
    { label: 'Classroom', href: '/classroom' },
    { label: 'STEM', href: '/stem' },
    { label: 'Project', href: '/project' }
  ]

  return (
    <nav className='flex h-full items-center'>
      <ul className='flex h-full items-center justify-center gap-1'>
        {navItems.map((item, index) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname === item.href
          return (
            <li key={index} className={'relative flex h-full items-center'}>
              <Link
                href={item.href}
                className={`group relative px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive ? 'text-amber-custom-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
                {/* Underline effect */}
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
    </nav>
  )
}
