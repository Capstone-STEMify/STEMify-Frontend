import { ComponentTemplate } from '@/features/assembly/types/assembly.types'
import { setDraggingTemplate } from '@/features/creator-3d/slice/creatorSceneSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import Image from 'next/image'

interface ComponentCardProps {
  template: ComponentTemplate
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDoubleClick: () => void
}

export function ComponentCard({ template, isDragging, onDragStart, onDoubleClick }: ComponentCardProps) {
  const dispatch = useAppDispatch()
  const handleDragEnd = () => {
    dispatch(setDraggingTemplate(null))
  }

  return (
    <div
      className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
        isDragging
          ? 'scale-105 border-blue-300 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      } `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {/* Component Icon */}
      <div className='flex items-center gap-3'>
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100'>
          <Image
            src={template.previewImageUrl || ''}
            alt={template.name}
            width={40}
            height={40}
            className='object-contain'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = ''
              target.style.display = 'none'
              const fallbackDiv = document.createElement('div')
              fallbackDiv.className = 'w-8 h-8 bg-gray-300 rounded flex items-center justify-center'
              const span = document.createElement('span')
              span.className = 'text-xs text-gray-600'
              span.textContent = template.category === 'connector_3leg' ? '⚡' : '📏'
              fallbackDiv.appendChild(span)
              target.parentElement?.appendChild(fallbackDiv)
            }}
          />
        </div>

        <div className='min-w-0 flex-1'>
          <h3 className='truncate text-sm font-medium text-gray-900'>{template.name}</h3>
          <p className='mt-1 line-clamp-2 text-xs text-gray-500'>{template.description}</p>
        </div>
      </div>
      {/* Type Badge */}
      <div className='absolute top-2 right-2'>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            template.category === 'connector_3leg' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          } `}
        >
          {template.category === 'connector_3leg' ? 'Connector' : 'Straw'}
        </span>
      </div>
    </div>
  )
}
