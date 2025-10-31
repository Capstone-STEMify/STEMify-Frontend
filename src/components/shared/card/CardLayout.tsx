'use client'

import { Card, CardContent, CardFooter } from '@/components/shadcn/card'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { GraduationCap } from 'lucide-react'

interface CardLayoutProps {
  imageSrc?: string
  alt?: string
  badge?: React.ReactNode
  infor?: React.ReactNode
  action?: React.ReactNode
  href?: string
  onClick?: () => void
  children?: React.ReactNode
  imageRatio?: string
  className?: string
  footer?: React.ReactNode
  imageClassName?: string
}

export default function CardLayout({
  imageSrc,
  alt = 'card image',
  badge,
  infor,
  action,
  href,
  onClick,
  children,
  imageRatio = 'aspect-[4/3]',
  className,
  footer,
  imageClassName = 'object-cover'
}: CardLayoutProps) {
  const cardContent = (
    <Card
      className={clsx(
        'flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md',
        className
      )}
      onClick={href ? undefined : onClick}
    >
      {/* Image section */}
      <div className={clsx('relative w-full overflow-hidden', imageRatio)}>
        {imageSrc ? (
          <Image
            src={imageSrc || '/images/fallback.png'}
            alt={alt}
            fill
            className={imageClassName}
            sizes='(max-width: 768px) 100vw, 33vw'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-blue-400'>
            <GraduationCap className='h-12 w-12 text-white/60' />
          </div>
        )}
        {badge && <div className='absolute top-2 left-2'>{badge}</div>}
        {infor && <div className='absolute bottom-2 left-2'>{infor}</div>}
        {action && <div className='absolute top-2 right-2'>{action}</div>}
      </div>

      {/* Content */}
      <CardContent className='flex-1 p-4'>{children}</CardContent>

      {/* Footer */}
      {footer && <CardFooter className='px-4 pt-0 pb-4'>{footer}</CardFooter>}
    </Card>
  )

  return href ? (
    <Link href={href} className='block'>
      {cardContent}
    </Link>
  ) : (
    cardContent
  )
}
