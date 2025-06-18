import { Badge } from '@/components/shadcn/badge'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import clsx from 'clsx'

type CardSize = 'sm' | 'md' | 'lg' | 'xl'

interface LessonCardProps {
  imageSrc: string
  title: string
  description: string
  featured?: boolean
  onEdit?: () => void
  size?: CardSize
}

const sizeClasses: Record<CardSize, { width: string; height: string; imageHeight: string }> = {
  sm: { width: 'w-[200px]', height: 'h-[280px]', imageHeight: 'h-[140px]' },
  md: { width: 'w-[264px]', height: 'h-[350px]', imageHeight: 'h-[180px]' },
  lg: { width: 'w-[320px]', height: 'h-[400px]', imageHeight: 'h-[200px]' },
  xl: { width: 'w-[400px]', height: 'h-[500px]', imageHeight: 'h-[260px]' }
}

export function LessonCard({ imageSrc, title, description, featured = false, onEdit, size = 'md' }: LessonCardProps) {
  const { width, height, imageHeight } = sizeClasses[size]

  return (
    <div
      className={clsx(
        'hover:shadow-6 relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:scale-[1.02]',
        width,
        height
      )}
    >
      <div className={clsx('relative w-full', imageHeight)}>
        <Image src={imageSrc} alt={title} fill className='object-cover' />
        {featured && (
          <Badge className='absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-black'>Featured</Badge>
        )}
      </div>

      <div className='space-y-1 p-3'>
        <div className='text-xs font-semibold text-orange-500'>Lesson</div>
        <div className='text-sm leading-tight font-semibold text-gray-900'>{title}</div>
        <p className='line-clamp-2 text-xs leading-snug text-gray-600'>{description}</p>
      </div>

      {onEdit && (
        <button onClick={onEdit} className='absolute top-2 right-2 rounded-full bg-white p-1 hover:bg-gray-100'>
          <Pencil className='h-4 w-4 text-gray-500' />
        </button>
      )}
    </div>
  )
}
