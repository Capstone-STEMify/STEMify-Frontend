import { Section } from '@/features/resource/section/types/section.type'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { cn } from '@/utils/shadcn/utils'
import { Check, GraduationCap, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { LicenseType, UserRole } from '@/types/userRole'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setSelectedSectionId } from '@/features/resource/lesson/slice/lessonDetailSlice'

type LessonOutlineProps = {
  sectionData?: Section[]
  sectionStatus?: ApiSuccessResponse<PaginatedResult<StudentProgress>>
}

export default function LessonOutline({ sectionData, sectionStatus }: LessonOutlineProps) {
  const dispatch = useAppDispatch()
  const { selectedSectionId } = useAppSelector((state) => state.lessonDetail)
  console.log('Selected Section ID:', selectedSectionId)
  const role = useAppSelector((state) => state.selectedOrganization.currentRole)

  const t = useTranslations('LessonDetails')
  const { data: userData } = useSession()

  const getSectionStatus = (sectionId: number) => {
    return sectionStatus?.data.items.find((item) => item.sectionId === sectionId)?.status
  }

  const completedSectionIds = new Set(
    sectionStatus?.data.items.filter((item) => item.status === ProgressStatus.COMPLETED).map((item) => item.sectionId)
  )

  const isLoggedIn = !!userData
  const isVisibleSection = role === LicenseType.TEACHER || role === UserRole.ADMIN || role === UserRole.STAFF

  if (!sectionData || sectionData.length === 0) {
    return <div className='flex items-center justify-center'>{t('notFound.no_section_v2')}</div>
  }

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
            const status = getSectionStatus(sec.id)
            const isLocked = status === ProgressStatus.LOCKED
            const isCompleted = status === ProgressStatus.COMPLETED
            const isSelected = sec.id === selectedSectionId

            // ✅ Determine if section is clickable
            const isClickable = isLoggedIn && !isLocked

            return (
              <div
                key={sec.id}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  // ✅ Selected state styling
                  isSelected ? 'bg-muted border-l-4 border-blue-500 font-semibold text-blue-700' : '',
                  // ✅ Hover and cursor styling based on clickable state
                  isClickable ? 'hover:bg-muted/60 cursor-pointer' : 'cursor-not-allowed',
                  // ✅ Locked section styling
                  isLocked ? 'bg-slate-50 opacity-60' : ''
                )}
                onClick={() => {
                  // ✅ Only allow click if section is clickable
                  if (isClickable) {
                    dispatch(setSelectedSectionId(sec.id))
                  }
                }}
              >
                <div className='flex items-center gap-2'>
                  {/* ✅ Icon logic: Lock for not logged in OR locked status */}
                  {!isLoggedIn || isLocked ? (
                    <Lock size={16} className={cn(isLocked ? 'text-orange-500' : 'text-gray-400')} />
                  ) : (
                    isCompleted && <Check size={16} className='text-green-500' />
                  )}

                  {/* ✅ Teacher-only section indicator */}
                  {isVisibleSection && !sec.isVisibleToStudent && <GraduationCap size={16} className='text-blue-500' />}

                  {/* ✅ Section title with appropriate styling */}
                  <div className={cn(!isLoggedIn && 'text-gray-500', isLocked && 'text-slate-600')}>{sec.title}</div>
                </div>

                {/* ✅ Duration with appropriate styling */}
                <div className={cn('text-muted-foreground', (!isLoggedIn || isLocked) && 'text-gray-400')}>
                  {sec.duration} {t('mins')}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
