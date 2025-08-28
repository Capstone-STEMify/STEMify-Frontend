import Image from 'next/image'
import clsx from 'clsx'
import { Size } from '@/types/general'
import Link from 'next/link'

interface CardCarouselProps {
  imageSrc?: string
  alt?: string
  size?: Size
  badge?: React.ReactNode
  infor?: React.ReactNode
  children?: React.ReactNode
  action?: React.ReactNode
  href?: string
  isScale?: boolean
  onClick?: () => void
  className?: string
}

const sizeClasses: Record<Size, { width: string; height: string; imageHeight: string }> = {
  sm: { width: 'w-[200px]', height: 'h-[280px]', imageHeight: 'h-[140px]' },
  md: { width: 'w-[264px]', height: 'h-[350px]', imageHeight: 'h-[180px]' },
  lg: { width: 'w-[320px]', height: 'h-[400px]', imageHeight: 'h-[200px]' },
  xl: { width: 'w-[400px]', height: 'h-[500px]', imageHeight: 'h-[260px]' }
}

const sizeToSizes: Record<Size, string> = {
  sm: '200px',
  md: '264px',
  lg: '320px',
  xl: '400px'
}

export default function CardCarousel({
  imageSrc,
  alt = 'card image',
  size = 'md',
  badge,
  infor,
  children,
  action,
  href,
  isScale = true,
  onClick,
  className
}: CardCarouselProps) {
  const { width, height, imageHeight } = sizeClasses[size]
  const sizes = sizeToSizes[size]

  const cardContent = (
    <div
      className={clsx(
        `hover:shadow-6 relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300`,
        isScale && 'hover:scale-[1.02]',
        width,
        height,
        className // <- NEW
      )}
      onClick={href ? undefined : onClick}
    >
      <div className={clsx('relative w-full', imageHeight)}>
        {imageSrc === '' ? (
          <Image src={'/images/fallback.png'} alt={alt} fill className='object-cover' priority sizes={sizes} />
        ) : (
          <Image src={imageSrc || 'No image'} alt={alt} fill className='object-cover' sizes={sizes} />
        )}
        {badge && <div className='absolute top-2 left-2'>{badge}</div>}
        {infor && <div className='absolute bottom-2 left-2'>{infor}</div>}
      </div>
      <div className='flex min-h-0 flex-1 flex-col p-3'>{children}</div>
      {action && <div className='absolute top-2 right-2'>{action}</div>}
    </div>
  )

  return href ? (
    <Link href={href} className='block'>
      {cardContent}
    </Link>
  ) : (
    cardContent
  )
}
