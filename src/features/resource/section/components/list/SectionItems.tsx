import ContentManagement from '@/features/content/components/UpsertContent'
import { Section } from '@/features/resource/section/types/section.type'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, Trash2 } from 'lucide-react'

export default function SectionItems({
  section,
  isExpanded,
  toggleSection
}: {
  section: Section
  isExpanded: (id: number) => boolean
  toggleSection: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className='rounded-lg border p-4 py-4'>
      <div className='flex items-center justify-between select-none' onClick={() => toggleSection(section.id)}>
        <div className='flex items-center gap-2'>
          <span className='cursor-grab text-gray-400' {...attributes} {...listeners}>
            ⠿
          </span>
          <h3 className='text-lg font-semibold'>{section.description}</h3>
          <Trash2
            size={15}
            className='text-red-500'
            onClick={(e) => {
              e.stopPropagation()
              console.log('Delete section:', section.id)
            }}
          />
          <Edit
            size={15}
            className='text-sky-600'
            onClick={(e) => {
              e.stopPropagation()
              console.log('Edit section:', section.id)
            }}
          />
        </div>{' '}
        <span className='text-sm text-gray-500'>{isExpanded(section.id) ? '▲' : '▼'}</span>
      </div>

      {isExpanded(section.id) && (
        <div className='mt-3 text-sm text-gray-700'>
          <div className='flex gap-10 px-5'>
            <p>
              <strong className='mr-2'>Duration:</strong> {section.duration} mins
            </p>
            <p>
              <strong className='mr-2'>Status:</strong> {section.status}
            </p>
          </div>
          <ContentManagement sectionId={section.id} />
        </div>
      )}
    </div>
  )
}
