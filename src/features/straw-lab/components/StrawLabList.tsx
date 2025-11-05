'use client'
import { useSearchEmulationsQuery } from '@/features/emulator/api/emulatorApi'
import { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

export default function StrawLabList() {
  const router = useRouter()
  const locale = useLocale()

  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    dragFree: false,
    loop: true,
    containScroll: 'trimSnaps'
  })

  const { data, isLoading } = useSearchEmulationsQuery({})
  const emulators = data?.data.items || []

  const onSelect = useCallback((api: EmblaCarouselType) => setSelected(api.selectedScrollSnap()), [])
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
    router.push(`/${locale}/emulator-project/${id}`)
  }

  if (isLoading) {
    return <div className='flex h-[70vh] w-full items-center justify-center text-gray-500'>Đang tải mô hình...</div>
  }

  if (emulators.length === 0) {
    return (
      <div className='flex h-[70vh] w-full flex-col items-center justify-center text-gray-500'>
        <p>Không có mô hình nào trong cơ sở dữ liệu.</p>
      </div>
    )
  }

  return (
    <div>
      <div className='overflow-x-hidden overflow-y-visible py-8' ref={emblaRef}>
        <div className='flex touch-pan-y gap-10 md:gap-12'>
          {emulators.map((e, i) => {
            const active = i === selected
            return (
              <article
                key={e.emulationId}
                onClick={() => handleNavigate(e.emulationId)}
                className={`relative min-w-0 shrink-0 grow-0 basis-[85%] cursor-pointer px-2 sm:basis-[55%] md:basis-[42%] md:px-4 lg:basis-[33%]`}
              >
                <div
                  className={`group relative mx-auto aspect-square w-[74vw] max-w-[28rem] transform-gpu overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 via-blue-400 to-sky-400 ring-1 ring-black/5 transition-transform duration-300 ease-out sm:w-[60vw] md:w-[28rem] ${
                    active ? 'z-20 scale-105 shadow-2xl md:scale-110' : 'scale-95 opacity-95 shadow'
                  }`}
                >
                  <Image
                    src={e.thumbnailUrl || '/images/shape.png'}
                    alt={e.name}
                    fill
                    className='object-cover'
                    sizes='(max-width: 640px) 74vw, (max-width: 768px) 60vw, 28rem'
                    priority={i === 0}
                  />
                </div>

                <div className='mt-12 text-center'>
                  <h3 className='text-xl font-semibold text-zinc-900'>{e.name}</h3>
                  <p className='mt-1 line-clamp-2 text-sm text-zinc-500'>{e.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
      {/* Numbered pagination */}
      <div className='mt-8 flex items-center justify-center gap-2 md:gap-3'>
        {emulators.map((_, i) => (
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
  )
}
