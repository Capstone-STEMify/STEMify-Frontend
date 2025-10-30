'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/shadcn/utils'
import { useLocale, useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { Bell, Settings, Users } from 'lucide-react'

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
    <div className='sticky top-0 z-40 border-b border-gray-200 bg-white'>
      <div className='container mx-auto px-6'>
        <div className='relative flex h-16 items-center'>
          {/* Left: Classroom Info */}
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500'>
              <span className='text-lg font-bold text-white'>F</span>
            </div>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-bold text-slate-900'>Fikri Studio</h2>
              <div className='flex items-center gap-1'>
                <Avatar className='h-6 w-6 border border-slate-200'>
                  <AvatarImage src='' />
                  <AvatarFallback className='bg-orange-100 text-xs text-orange-700'>ST</AvatarFallback>
                </Avatar>
                <Avatar className='h-6 w-6 border border-slate-200'>
                  <AvatarImage src='' />
                  <AvatarFallback className='bg-blue-100 text-xs text-blue-700'>AI</AvatarFallback>
                </Avatar>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 w-6 rounded-full border border-slate-200 p-0 text-slate-600 hover:bg-slate-100'
                >
                  <span className='text-xs'>+</span>
                </Button>
              </div>
            </div>
          </div>

          <nav className='absolute left-1/2 flex -translate-x-1/2 items-center gap-8'>
            {subNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative flex h-16 items-center text-sm font-medium transition-colors duration-200 hover:text-slate-900',
                    isActive ? 'text-slate-900' : 'text-slate-600'
                  )}
                >
                  {t(item.name)}
                  {isActive && <span className='absolute right-0 bottom-0 left-0 h-0.5 bg-slate-900' />}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
