import { Section } from '@/features/resource/section/types/section.type'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { cn } from '@/utils/shadcn/utils'
import { Check } from 'lucide-react'

type LessonOutlineProps = {
  sectionData?: Section[]
  selectedSectionId: number | null
  onSelectSection: (sectionId: number) => void
  sectionStatus?: ApiSuccessResponse<PaginatedResult<StudentProgress>>
}

export default function LessonOutline({
  sectionData,
  selectedSectionId,
  onSelectSection,
  sectionStatus
}: LessonOutlineProps) {
  if (!sectionData || sectionData.length === 0) {
    return <div className='flex h-screen items-center justify-center'>No Sections Available</div>
  }

  const completedSectionIds = new Set(
    sectionStatus?.data.items.filter((item) => item.status === ProgressStatus.COMPLETED).map((item) => item.sectionId)
  )

  return (
    <div className='px-4'>
      <h1 className='text-lg font-semibold'>Sections</h1>
      <div className='mt-5 flex flex-col space-y-2'>
        {sectionData
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((sec) => {
            const isSelected = sec.id === selectedSectionId
            const isCompleted = completedSectionIds.has(sec.id)

            return (
              <button
                key={sec.id}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  isSelected ? 'bg-muted border-l-4 border-blue-500 font-semibold text-blue-700' : 'hover:bg-muted/60'
                )}
                onClick={() => onSelectSection(sec.id)}
              >
                {isCompleted && <Check size={16} className='text-blue-500' />}
                {sec.description}
              </button>
            )
          })}
      </div>
    </div>
  )
}
