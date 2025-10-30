'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/shadcn/utils'
import { useLocale, useTranslations } from 'next-intl'

export default function ClassroomSubHeader() {
  const t = useTranslations('Header')
  const pathname = usePathname()
  const locale = useLocale()

  const subNavItems = [
    { name: 'overview', href: `/${locale}/classroom/overview` },
    { name: 'course', href: `/${locale}/classroom/course` },
    { name: 'quiz', href: `/${locale}/classroom/quiz` },
    { name: 'assignment', href: `/${locale}/classroom/assignments` }
  ]

  return (
    <div className='sticky top-2 z-40 flex justify-center'>
      {/* Subheader floating bar */}
      <div className='relative mt-2 w-fit rounded-full border border-gray-200 bg-white/80 px-15 shadow-md backdrop-blur-lg transition-all duration-300 hover:shadow-lg'>
        <nav className='flex h-12 items-center justify-center gap-12'>
          {subNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative flex h-full items-center text-sm font-medium transition-all duration-200 hover:text-black',
                  isActive ? 'text-black' : 'text-gray-500'
                )}
              >
                {t(item.name)}
                {isActive && (
                  <span className='absolute right-0 -bottom-1 left-0 mx-auto h-[2px] w-full rounded-full bg-black transition-all duration-300' />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
