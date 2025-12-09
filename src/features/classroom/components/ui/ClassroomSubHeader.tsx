'use client'

import { cn } from '@/utils/shadcn/utils'
import { useLocale, useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Calendar, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { Classroom } from '@/features/classroom/types/classroom.type'
import { ClassroomNavItems } from 'app/[locale]/classroom/[classroomId]/page'
import { formatDate, useStatusTranslation } from '@/utils/index'
import BackButton from '@/components/shared/button/BackButton'
import { useAppSelector } from '@/hooks/redux-hooks'

interface Props {
  classroom: Classroom
  currentTab: ClassroomNavItems
  setCurrentTab: (tab: ClassroomNavItems) => void
}

export default function ClassroomSubHeader({ classroom, currentTab, setCurrentTab }: Props) {
  const locale = useLocale()
  const t = useTranslations('Header')
  const statusTranslation = useStatusTranslation()
  const tClassroom = useTranslations('classroom.detail')
  const currentRole = useAppSelector((state) => state.selectedOrganization.currentRole)

  const MAX_VISIBLE = 2
  const totalStudents = classroom.students.length
  const visibleStudents = classroom.students.slice(0, MAX_VISIBLE)
  const remaining = totalStudents - MAX_VISIBLE

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
  const studentSubNavItems: { name: string; currentTab: ClassroomNavItems }[] = [
    { name: 'overview', currentTab: 'overview' },
    {
      name: 'course',
      currentTab: 'course'
    }
  ]
  const finalSubNavItems = currentRole === 'Student' ? studentSubNavItems : subNavItems

  return (
    <div className='sticky top-0 z-40 border-b border-gray-200 bg-white pt-4 shadow-sm'>
      <div className='container mx-auto px-6'>
        {/* Top Row - Classroom Info */}
        <div className='flex h-16 items-center justify-between border-b border-gray-100'>
          {/* Left - Classroom Info */}
          <div className='flex items-center gap-3'>
            <BackButton />
            <div className='h-8 w-px bg-gray-200' />
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-200 to-sky-600 shadow-md'>
              <span className='text-xl font-bold text-white'>{classroom.name?.charAt(0).toUpperCase() ?? 'C'}</span>
            </div>
            <div>
              <div className='flex items-center gap-4'>
                <h2 className='text-lg font-bold text-slate-900'>{classroom.name ?? 'Classroom'}</h2>
                <Badge className={`border ${getStatusBadgeClass(classroom.status)}`}>
                  {statusTranslation(classroom.status)}
                </Badge>
                <Badge className='flex items-center gap-2 bg-sky-100 text-xs font-medium text-sky-700'>
                  <GraduationCap className='h-3 w-3' />
                  <span className='text-xs'>
                    {tClassroom('grade')} {classroom.grade}
                  </span>
                </Badge>
              </div>

              <div className='mt-0.5 flex items-center gap-1.5'>
                <span className='text-xs text-slate-500'>{tClassroom('students.label')}:</span>
                {visibleStudents.map((student, index) => (
                  <Avatar
                    key={student.id}
                    className={cn('ring-0.5 h-6 w-6 border-2 border-white ring-slate-200', index > 0 && '-ml-2.5')}
                  >
                    <AvatarImage src={student.imageUrl} />
                    <AvatarFallback className='bg-blue-100 text-xs font-medium text-blue-700'>
                      {student.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {remaining > 0 && (
                  <Avatar className='-ml-2.5 h-6 w-6 border-2 border-white bg-slate-200'>
                    <AvatarFallback className='text-[10px] font-semibold text-slate-700'>+{remaining}</AvatarFallback>
                  </Avatar>
                )}

                <div className='ml-4 flex items-center gap-2'>
                  <Calendar className='h-3 w-3' />
                  <span className='text-xs'>
                    {formatDate(classroom.startDate, { locale })} - {formatDate(classroom.endDate, { locale })}
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
          {finalSubNavItems.map((item) => {
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
