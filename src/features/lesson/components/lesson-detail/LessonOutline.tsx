import { cn } from '@/utils/shadcn/utils'
import { Check } from 'lucide-react'

type LessonOutlineProps = {
  sections: {
    id: number
    label: string
  }[]
  selectedId: number
  onSelect: (id: number) => void
}

export default function LessonOutline({ onSelect, sections, selectedId }: LessonOutlineProps) {
  return (
    <div className='px-4'>
      {/* Sections */}
      <h1>Sections</h1>
      <div className='mt-5 flex flex-col space-y-3'>
        {sections.map((sec) => {
          const isSelected = sec.id === selectedId
          return (
            <button
              key={sec.id}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 pl-10 text-sm font-medium transition-colors',
                isSelected ? 'bg-muted border-l-4 border-blue-500' : 'hover:bg-muted/60'
              )}
              onClick={() => onSelect(sec.id)}
            >
              <Check />
              {sec.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
