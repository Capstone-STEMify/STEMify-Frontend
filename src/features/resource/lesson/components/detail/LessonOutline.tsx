import { Section } from '@/features/resource/section/types/section.type'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { cn } from '@/utils/shadcn/utils'
import { Check, GraduationCap, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { UserRole } from '@/types/userRole'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setSelectedSectionId } from '@/features/resource/lesson/slice/lessonDetailSlice'

type LessonOutlineProps = {
  sectionData?: Section[]
  sectionStatus?: ApiSuccessResponse<PaginatedResult<StudentProgress>>
}

export default function LessonOutline({ sectionData, sectionStatus }: LessonOutlineProps) {
  const dispatch = useAppDispatch()
  const { selectedSectionId } = useAppSelector((state) => state.lessonDetail)
  const t = useTranslations('LessonDetails')
  const { data: userData } = useSession()

  if (!sectionData || sectionData.length === 0) {
    return <div className='flex items-center justify-center'>{t('notFound.no_section_v2')}</div>
  }

  const completedSectionIds = new Set(
    sectionStatus?.data.items.filter((item) => item.status === ProgressStatus.COMPLETED).map((item) => item.sectionId)
  )

  const isLoggedIn = !!userData
  const role = userData?.user?.role
  const isVisibleSection = role === UserRole.TEACHER || role === UserRole.ADMIN || role === UserRole.STAFF

  return (
    <div className='px-4'>
      <h1 className='text-lg font-semibold'>{t('sections')}</h1>
      <div className='mt-5 flex flex-col space-y-2'>
        {sectionData
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .filter((sec) => {
            if (!sec.isVisibleToStudent && !isVisibleSection) {
              return false
            }
            return true
          })
          .map((sec) => {
            const isSelected = sec.id === selectedSectionId
            const isCompleted = completedSectionIds.has(sec.id)

            return (
              <div
                key={sec.id}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  isSelected ? 'bg-muted border-l-4 border-blue-500 font-semibold text-blue-700' : 'hover:bg-muted/60',
                  !isLoggedIn ? 'cursor-default' : 'cursor-pointer'
                )}
                onClick={() => {
                  if (isLoggedIn) {
                    dispatch(setSelectedSectionId(sec.id))
                  }
                }}
              >
                <div className='flex items-center gap-2'>
                  {!isLoggedIn ? (
                    <Lock size={16} className='text-gray-400' />
                  ) : (
                    isCompleted && <Check size={16} className='text-blue-500' />
                  )}
                  {isVisibleSection && !sec.isVisibleToStudent && <GraduationCap size={16} className='text-blue-500' />}
                  <div className={!isLoggedIn ? 'text-gray-500' : ''}>{sec.title}</div>
                </div>
                <div className={cn('text-muted-foreground', !isLoggedIn && 'text-gray-400')}>{sec.duration} mins</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
