'use client'
import { cn } from '@/utils/shadcn/utils'
import { Check } from 'lucide-react'
import { useLazySearchSectionQuery, useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { useEffect } from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useParams } from 'next/navigation'
import { useSearchStudentProgressQuery } from '@/features/student-progress/api/studentProgressApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { ProgressStatus } from '@/features/student-progress/types/studentProgress.type'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'

export default function LessonOutline() {
  const param = useParams()
  const dispatch = useAppDispatch()
  console.log('Lesson Outline Params:', param)
  const lessonId = param?.lessonId ? Number(param.lessonId) : undefined
  const enrollmentId = useAppSelector((state) => state.studentProgress.selectedEnrollmentId)
  const selectedSectionId = useAppSelector((state) => state.studentProgress.selectedSectionId)
  // Fetch sections and their progress
  const { data: sections, isLoading: loadingSections } = useSearchSectionQuery({ lessonId }, { skip: !lessonId })
  const { data: sectionsProgress, isLoading: loadingProgress } = useSearchStudentProgressQuery(
    { enrollmentId: enrollmentId ?? 0, lessonId: lessonId ?? 0 },
    { skip: !enrollmentId || !lessonId }
  )

  // Create a progress map for quick access
  // This maps sectionId to its progress status
  const progressMap =
    sectionsProgress?.data?.items?.reduce(
      (acc, progress) => {
        if ('sectionId' in progress) {
          acc[progress.sectionId] = progress.status
        }
        return acc
      },
      {} as Record<number, ProgressStatus>
    ) ?? {}

  // Get the section with the smallest orderIndex
  const initialSectionId =
    sections?.data?.items?.reduce((minSection, currentSection) => {
      return currentSection.orderIndex < minSection.orderIndex ? currentSection : minSection
    })?.id ?? 0

  const updateSelectedSection = (sectionId: number) => {
    const status = progressMap[sectionId] || ProgressStatus.NOT_STARTED
    dispatch(studentProgressSlice.actions.setSelectedSectionId(sectionId))
    dispatch(studentProgressSlice.actions.setSelectedSectionStatus(status))
  }
  // Auto-select the initial section after data is loaded
  useEffect(() => {
    if (!loadingSections && !loadingProgress && sections && sections.data.items.length > 0 && sectionsProgress) {
      updateSelectedSection(initialSectionId)
    }
  }, [loadingSections, loadingProgress, sections, sectionsProgress, initialSectionId, updateSelectedSection])

  // Handle section selection
  const handleClickSectionId = (id: number) => {
    updateSelectedSection(id)
  }

  // If loading sections or progress, show a loading indicator
  if (loadingSections || loadingProgress || !sections || !sectionsProgress) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <LoadingComponent size={80} />
      </div>
    )
  }
  // If no sections are available, show a message
  if (sections && sections.data.items.length === 0) {
    return <div className='px-4 py-4'>No sections available</div>
  }

  return (
    <div className='px-4'>
      <h1 className='text-lg font-semibold'>Sections</h1>

      <div className='mt-5 flex flex-col space-y-2'>
        {sections.data.items.map((sec) => {
          const isSelected = sec.id === selectedSectionId
          return (
            <button
              key={sec.id}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 pl-8 text-left text-sm font-medium transition-colors',
                isSelected ? 'bg-muted border-l-4 border-blue-500 font-semibold text-blue-700' : 'hover:bg-muted/60'
              )}
              onClick={() => handleClickSectionId(sec.id)}
            >
              {isSelected && <Check size={16} className='text-blue-500' />}
              {sec.description}
            </button>
          )
        })}
      </div>
    </div>
  )
}
