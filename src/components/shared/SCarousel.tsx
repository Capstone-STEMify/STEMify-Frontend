'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/shadcn/carousel'
import { cn } from '@/utils/shadcn/utils'

type SCarouselProps = {
  variant?: 'plugin' | 'spacing'
  items: React.ReactNode[]
  className?: string
  autoplayDelay?: number
}

export function SCarousel({ variant = 'plugin', items, className, autoplayDelay = 3000 }: SCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: autoplayDelay, stopOnInteraction: true }))

  const usePlugin = variant === 'plugin'

  return (
    <Carousel
      plugins={usePlugin ? [plugin.current] : []}
      className={cn('w-full', className)}
      onMouseEnter={usePlugin ? plugin.current.stop : undefined}
      onMouseLeave={usePlugin ? plugin.current.reset : undefined}
    >
      <CarouselContent className={variant === 'spacing' ? '-ml-1' : ''}>
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className={variant === 'spacing' ? 'justify-items-center pl-1 md:basis-1/2 lg:basis-1/3' : ''}
          >
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
