import { ComponentTemplate } from '@/features/creator-3d/types/creator.types'
import Image from 'next/image'

interface ComponentCardProps {
  template: ComponentTemplate
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDoubleClick: () => void
}

export function ComponentCard({ template, isDragging, onDragStart, onDragEnd, onDoubleClick }: ComponentCardProps) {
  return (
    <div
      className={`relative cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
        isDragging
          ? 'scale-105 border-blue-300 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      } `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {/* Component Icon */}
      <div className='flex items-center gap-3'>
        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100'>
          <Image
            src={template.icon}
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
              span.textContent = template.type === 'connector_3leg' ? '⚡' : '📏'
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
            template.type === 'connector_3leg' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          } `}
        >
          {template.type === 'connector_3leg' ? 'Connector' : 'Straw'}
        </span>
      </div>

      {/* Drag Overlay */}
      {isDragging && (
        <div className='bg-opacity-20 absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 bg-blue-500' />
      )}
    </div>
  )
}
