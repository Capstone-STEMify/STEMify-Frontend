'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import { Settings, ChevronUp, Star, Cpu, FolderKanban } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaVectorSquare } from 'react-icons/fa'

export type CarouselItem = {
  id: string
  title: string
  image: string
  bg: string
  rating?: number
  isAvailable?: boolean
}

const ITEMS: CarouselItem[] = [
  {
    id: 'police',
    title: 'Octahedron Platonic Solid',
    image:
      'https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fres_les_intro-octahedron-platonic-solid_cover.jpg&w=1920&q=75',
    bg: 'bg-indigo-400',
    rating: 3.5,
    isAvailable: true
  },
  {
    id: 'obstacle',
    title: ' Tetrahedron Platonic Solid',
    image:
      'https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fres_les_intro-tetrahedron-platonic-solid_cover.jpg&w=1920&q=75',
    bg: 'bg-rose-400',
    rating: 4.2,
    isAvailable: false
  },
  {
    id: 'sweeper',
    title: 'Hexahedron Platonic Solid',
    image:
      'https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fres_les_intro-hexahedron-platonic-solid_cover.jpg&w=1920&q=75',
    bg: 'bg-amber-300',
    rating: 3.1,
    isAvailable: false
  },
  {
    id: 'robotarm',
    title: 'Dodecahedron Platonic Solid',
    image:
      'https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fres_les_intro-dodecahedron-platonic-solid_cover.jpg&w=1920&q=75',
    bg: 'bg-green-400',
    rating: 4.6,
    isAvailable: false
  },
  {
    id: 'forklift',
    title: 'Icosahedron Platonic Solid',
    image:
      'https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fres_les_intro-icosahedron-platonic-solid_cover.jpg&w=1920&q=75',
    bg: 'bg-sky-400',
    rating: 3.8,
    isAvailable: false
  }
]

function RatingStars({ value = 0 }: { value?: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const stars = new Array(5).fill(0).map((_, i) => {
    const active = i < full || (i === full && half)
    return <Star key={i} className={`h-4 w-4 ${active ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-zinc-300'}`} />
  })
  return <div className='flex items-center gap-1'>{stars}</div>
}

function HeaderBar() {
  return (
    <div className='flex items-center justify-between gap-2 pb-5 md:gap-6'>
      {/* Left badge */}
      <div className='inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur'>
        <FaVectorSquare className='h-5 w-5' />
        <span className='text-lg font-semibold'>Straw Assembly</span>
      </div>

      {/* Center tabs */}
      <nav className='hidden items-center gap-10 md:flex'>
        <button className='group inline-flex flex-col items-center text-zinc-700 hover:text-zinc-900'>
          <div className='flex items-center gap-2'>
            <Cpu className='h-6 w-6' />
            <span className='text-lg font-semibold'>Micro:bit</span>
          </div>
          <ChevronUp className='mt-1 hidden h-4 w-4 text-zinc-900 group-hover:block' />
        </button>
        <button className='inline-flex flex-col items-center text-zinc-500 hover:text-zinc-900'>
          <div className='flex items-center gap-2'>
            <FolderKanban className='h-6 w-6' />
            <span className='text-lg font-medium'>My Project</span>
          </div>
        </button>
      </nav>

      {/* Settings */}
      <button className='ml-auto inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 p-2 shadow-sm hover:bg-white'>
        <Settings className='h-5 w-5' />
      </button>
    </div>
  )
}

export default function CarouselShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    dragFree: false,
    loop: true,
    containScroll: 'trimSnaps' // ⚙️ mượt ở seam
  })
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelected(api.selectedScrollSnap())
  }, [])

  const onScroll = useCallback((api: EmblaCarouselType) => {
    const p = Math.max(0, Math.min(1, api.scrollProgress()))
    setProgress(p)
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    onScroll(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('reInit', onScroll)
  }, [emblaApi, onSelect, onScroll])

  const scrollTo = (i: number) => emblaApi?.scrollTo(i)

  const handleNavigate = (id: string) => {
    router.push(`/straw-lab/${id}`)
  }

  return (
    <div className=''>
      <div className='mx-auto px-4 py-6 md:py-10'>
        <HeaderBar />

        {/* Carousel */}
        <div className='overflow-x-hidden overflow-y-visible py-8' ref={emblaRef}>
          <div className='flex touch-pan-y gap-10 md:gap-12'>
            {ITEMS.map((item, i) => {
              const active = i === selected
              return (
                <article
                  key={item.id}
                  onClick={() => item.isAvailable && handleNavigate(item.id)}
                  className={`relative min-w-0 shrink-0 grow-0 basis-[85%] px-2 sm:basis-[55%] md:basis-[42%] md:px-4 lg:basis-[33%] ${
                    item.isAvailable ? 'cursor-pointer' : 'pointer-events-none'
                  }`}
                >
                  {/* Single circle container — scale ở đây để không bị cắt */}
                  <div
                    className={`group relative mx-auto aspect-square w-[74vw] max-w-[28rem] overflow-hidden rounded-full ${item.bg} transform-gpu ring-1 ring-black/5 transition-transform duration-300 ease-out sm:w-[60vw] md:w-[28rem] ${
                      active ? 'z-20 scale-105 shadow-2xl md:scale-110' : 'scale-95 opacity-95 shadow'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className='object-cover'
                      sizes='(max-width: 640px) 74vw, (max-width: 768px) 60vw, 28rem'
                      priority={i === 0}
                    />
                    {/* Overlay khi chưa mở */}
                    {!item.isAvailable && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
                        <span className='text-2xl font-semibold text-white drop-shadow-md'>Coming Soon</span>
                      </div>
                    )}
                  </div>

                  <div className='mt-12 text-center'>
                    <h3 className='text-xl font-semibold text-zinc-900'>{item.title}</h3>
                    <div className='mt-2 flex items-center justify-center gap-2'>
                      <RatingStars value={item.rating ?? 0} />
                      <span className='text-sm text-zinc-500'>{(item.rating ?? 0).toFixed(1)}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Numbered pagination */}
        <div className='mt-8 flex items-center justify-center gap-2 md:gap-3'>
          {ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-full text-sm transition-all md:h-9 md:min-w-9 md:text-base ${
                selected === i ? 'bg-zinc-900 px-3 font-semibold text-white' : 'text-zinc-700 hover:bg-zinc-100'
              }`}
              aria-label={`Go to item ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className='relative mx-auto mt-4 h-2 w-[86%] max-w-xl rounded-full bg-zinc-200'>
          <div
            className='absolute inset-y-0 left-0 rounded-full bg-zinc-900'
            style={{ width: `${Math.max(10, progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
