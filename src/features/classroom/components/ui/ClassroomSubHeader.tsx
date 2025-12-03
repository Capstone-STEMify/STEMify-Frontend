'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/shadcn/utils'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { ArrowLeft, Calendar, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { Classroom } from '@/features/classroom/types/classroom.type'
import { format } from 'date-fns'
import { ClassroomNavItems } from 'app/[locale]/classroom/[classroomId]/page'

interface Props {
  curriculumId?: number
  classroom: Classroom
  currentTab: ClassroomNavItems
  setCurrentTab: (tab: ClassroomNavItems) => void
}

export default function ClassroomSubHeader({ classroom, curriculumId, currentTab, setCurrentTab }: Props) {
  const t = useTranslations('Header')
  const pathname = usePathname()

  const subNavItems: { name: string; currentTab: ClassroomNavItems }[] = [
    { name: 'overview', currentTab: 'overview' },
    {
      name: 'course',
      currentTab: 'course'
    },
    { name: 'quiz', currentTab: 'quiz' },
    { name: 'assignment', currentTab: 'assignment' },
    { name: 'student', currentTab: 'student' }
  ]

  return (
    <div className='sticky top-0 z-40 border-b border-gray-200 bg-white pt-4 shadow-sm'>
      <div className='container mx-auto px-6'>
        {/* Top Row - Classroom Info */}
        <div className='flex h-16 items-center justify-between border-b border-gray-100'>
          {/* Left - Classroom Info */}
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              onClick={() => window.history.back()}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div className='h-8 w-px bg-gray-200' />
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-200 to-sky-600 shadow-md'>
              <span className='text-xl font-bold text-white'>{classroom.name?.charAt(0).toUpperCase() ?? 'C'}</span>
            </div>
            <div>
              <div className='flex items-center gap-4'>
                <h2 className='text-lg font-bold text-slate-900'>{classroom.name ?? 'Classroom'}</h2>
                <Badge className={`border ${getStatusBadgeClass(classroom.status)}`}>{classroom.status}</Badge>
                <Badge className='flex items-center gap-2 bg-sky-100 text-xs font-medium text-sky-700'>
                  <GraduationCap className='h-3 w-3' />
                  <span className='text-xs'>{classroom.grade}</span>
                </Badge>
              </div>

              <div className='mt-0.5 flex items-center gap-1.5'>
                <span className='text-xs text-slate-500'>Students:</span>
                <div className='flex items-center -space-x-1.5'>
                  <Avatar className='h-6 w-6 border-2 border-white ring-1 ring-slate-200'>
                    <AvatarImage src='' />
                    <AvatarFallback className='bg-orange-100 text-xs font-medium text-orange-700'>ST</AvatarFallback>
                  </Avatar>
                  <Avatar className='h-6 w-6 border-2 border-white ring-1 ring-slate-200'>
                    <AvatarImage src='' />
                    <AvatarFallback className='bg-blue-100 text-xs font-medium text-blue-700'>AI</AvatarFallback>
                  </Avatar>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 rounded-full border-2 border-white bg-slate-50 p-0 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                  >
                    <span className='text-xs font-semibold'>+</span>
                  </Button>
                </div>
                <div className='ml-4 flex items-center gap-2'>
                  <Calendar className='h-3 w-3' />
                  <span className='text-xs'>
                    {format(new Date(classroom.startDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(classroom.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Actions (optional) */}
          <div className='flex items-center gap-2'>{/* Add any action buttons here if needed */}</div>
        </div>

        {/* Bottom Row - Navigation Tabs */}
        <nav className='flex items-center gap-6'>
          {subNavItems.map((item) => {
            const isActive = currentTab === item.currentTab
            return (
              <div
                key={item.name}
                onClick={() => setCurrentTab(item.currentTab)}
                className={cn(
                  'relative flex h-12 items-center px-1 text-sm font-semibold transition-colors duration-200',
                  isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {t(item.name)}
                {isActive && <span className='absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-blue-600' />}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
