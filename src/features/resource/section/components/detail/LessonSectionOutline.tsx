import { Button } from '@/components/shadcn/button'
import { Section } from '@/features/resource/section/types/section.type'
import { useModal } from '@/providers/ModalProvider'
import { cn } from '@/utils/shadcn/utils'
import { Check } from 'lucide-react'

type LessonSectionOutlineProps = {
  sectionData?: Section[]
  selectedSectionId: number | null
  onSelectSection: (sectionId: number) => void
}

export default function LessonSectionOutline({
  sectionData,
  selectedSectionId,
  onSelectSection
}: LessonSectionOutlineProps) {
  const { openModal } = useModal()

  if (!sectionData || sectionData.length === 0) {
    return <div className='flex h-screen items-center justify-center'>No Sections Available</div>
  }

  const handleAddSection = (lessonId: number) => {
    openModal('addSection')
  }
  return (
    <div className='px-4'>
      <h1 className='text-lg font-semibold'>Sections</h1>
      <div className='mt-5 flex flex-col space-y-2'>
        {sectionData
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((sec) => {
            const isSelected = sec.id === selectedSectionId
            return (
              <button
                key={sec.id}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  isSelected ? 'bg-muted border-l-4 border-blue-500 font-semibold text-blue-700' : 'hover:bg-muted/60'
                )}
                onClick={() => onSelectSection(sec.id)}
              >
                {isSelected && <Check size={16} className='text-blue-500' />}
                {sec.description}
              </button>
            )
          })}
        <Button
          className='mt-4 bg-sky-300'
          onClick={() => openModal('addSection', { lessonId: sectionData[0].lessonId })}
        >
          Add New Section
        </Button>
      </div>
    </div>
  )
}
