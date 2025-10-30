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
    <div>
      <div className='mx-auto flex h-12 items-center gap-6 px-6 text-sm font-medium'>
        {subNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'transition-colors hover:text-black',
                isActive ? 'border-b-2 border-black pb-2 text-black' : 'text-muted-foreground'
              )}
            >
              {t(item.name)}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
