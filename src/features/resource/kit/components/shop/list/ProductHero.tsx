'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

type Slide = {
  id: string
  src: string
  alt?: string
}

const SLIDES: Slide[] = [
  {
    id: 'sale-1',
    src: 'https://strawbees.com/hubfs/2024_home_classroom_features_4-1-1.jpg',
    alt: 'Robotics back to school'
  },
  {
    id: 'sale-2',
    src: 'https://stem-supplies.com/media/catalog/product/s/-/s-36509-strawbeesstarterkits-8.jpg?optimize=low&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:',
    alt: 'STEM kits'
  }
  // {
  //   id: 'sale-4',
  //   src: 'https://stem-supplies.com/media/catalog/product/s/-/s-36509-strawbeesstarterkits-79.jpg?optimize=low&bg-color=255,255,255&fit=bounds&height=744&width=744&canvas=744:744',
  //   alt: 'Makerspace'
  // }
]

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: false
    },
    [
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        playOnInit: true,
        stopOnMouseEnter: true
      })
    ]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi])

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className='relative mb-10 w-full bg-black text-white'
      aria-label='Hero Carousel'
    >
      {/* Carousel */}
      <div className='group relative'>
        <div className='embla__viewport overflow-hidden' ref={emblaRef}>
          <div className='embla__container flex touch-pan-y'>
            {SLIDES.map((s) => (
              <div key={s.id} className='embla__slide relative aspect-video h-[60vh] min-w-full flex-[0_0_100%]'>
                <img
                  src={s.src}
                  alt={s.alt ?? 'slide'}
                  className='h-full w-full bg-black object-cover'
                  draggable={false}
                />

                <div className='pointer-events-none absolute inset-0' />
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label='Previous slide'
          onClick={scrollPrev}
          className='absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 hover:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none md:left-5'
        >
          <ChevronLeft className='h-5 w-5' />
        </button>
        <button
          aria-label='Next slide'
          onClick={scrollNext}
          className='absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 hover:bg-white focus:ring-2 focus:ring-yellow-400 focus:outline-none md:right-5'
        >
          <ChevronRight className='h-5 w-5' />
        </button>

        <div className='pointer-events-none absolute right-0 bottom-4 left-0 flex justify-center gap-2'>
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition ${i === selectedIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
