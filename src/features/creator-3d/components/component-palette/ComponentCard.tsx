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
      className={`relative cursor-pointer rounded-lg`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={onDoubleClick}
    >
      {/* Component Icon */}
      <div>
        <div className='flex h-18 w-18 items-center justify-center overflow-hidden rounded-md bg-gray-100'>
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
        <p className='text-xs'>{template.shortName}</p>
      </div>
    </div>
  )
}
