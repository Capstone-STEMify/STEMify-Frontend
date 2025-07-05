'use client'
import { cn } from '@/utils/shadcn/utils'
import { Check } from 'lucide-react'
import { useLazySearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { useEffect } from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'

type LessonOutlineProps = {
  selectedId: number
  onSelect: (id: number) => void
}

export default function LessonOutline({ onSelect, selectedId }: LessonOutlineProps) {
  const [getSections, { data: sections, isLoading: sectionLoading }] = useLazySearchSectionQuery()

  useEffect(() => {
    getSections({ lessonId: 1 })
  }, [])

  if (sections && sections.data.items.length === 0) {
    return <div className='px-4 py-4'>No sections available</div>
  }

  if (sectionLoading || !sections) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <LoadingComponent size={80} />
      </div>
    )
  }

  return (
    <div className='px-4 py-4'>
      <h1 className='text-lg font-semibold'>Sections</h1>

      <div className='mt-5 flex flex-col space-y-2'>
        {sections.data.items.map((sec) => {
          const isSelected = sec.id === selectedId
          return (
            <button
              key={sec.id}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 pl-8 text-left text-sm font-medium transition-colors',
                isSelected ? 'bg-muted border-l-4 border-blue-500 font-semibold text-blue-700' : 'hover:bg-muted/60'
              )}
              onClick={() => onSelect(sec.id)}
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
