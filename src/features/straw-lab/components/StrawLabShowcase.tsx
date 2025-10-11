'use client'

import React, { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import Image from 'next/image'
import { Star, Settings, ChevronUp, Cpu, FolderKanban } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { FaVectorSquare } from 'react-icons/fa'
import { supabase } from '@/libs/supabase/client'
import { toast } from 'sonner'

// 🧩 Interface cho model
interface CarouselItem {
  id: number
  name: string
  description: string
  category: string
  image_url: string
  rating?: number
  is_available: boolean
}

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
  const locale = useLocale()
  return (
    <div className='flex items-center justify-between gap-2 pb-5 md:gap-6'>
      <Link href={`/${locale}/straw-lab`}>
        <div className='inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur'>
          <FaVectorSquare className='h-5 w-5' />
          <span className='text-lg font-semibold'>Straw Assembly</span>
        </div>
      </Link>
      <nav className='hidden items-center gap-10 md:flex'>
        <div className='inline-flex flex-col items-center text-zinc-700 hover:text-zinc-900'>
          <div className='flex items-center gap-2'>
            <Cpu className='h-6 w-6' />
            <span className='text-lg font-semibold'>Micro:bit</span>
          </div>
          <ChevronUp className='mt-1 hidden h-4 w-4 text-zinc-900 group-hover:block' />
        </div>
        <Link href={`/${locale}/workspace-3d`} className='group'>
          <button className='inline-flex flex-col items-center text-zinc-500 hover:text-zinc-900'>
            <div className='flex items-center gap-2'>
              <FolderKanban className='h-6 w-6' />
              <span className='text-lg font-medium'>My Project</span>
            </div>
          </button>
        </Link>
      </nav>
      <button className='ml-auto inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/80 p-2 shadow-sm hover:bg-white'>
        <Settings className='h-5 w-5' />
      </button>
    </div>
  )
}

export default function StrawLabShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    dragFree: false,
    loop: true,
    containScroll: 'trimSnaps'
  })
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(0)
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const locale = useLocale()

  // 🧭 Fetch từ Supabase
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('assembly_data')
        .select('id, name, description, category, image_url, rating, is_available')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching models:', error)
        toast.error('Không thể tải danh sách mô hình!')
        setLoading(false)
        return
      }

      setItems(data || [])
      setLoading(false)
    }

    fetchModels()
  }, [])

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

  const handleNavigate = (id: number) => {
    router.push(`/${locale}/workspace-3d/${id}`)
  }

  // 🌀 Loading state
  if (loading) {
    return <div className='flex h-[70vh] w-full items-center justify-center text-gray-500'>Đang tải mô hình...</div>
  }

  // ❌ Empty state
  if (!items.length) {
    return (
      <div className='flex h-[70vh] w-full flex-col items-center justify-center text-gray-500'>
        <p>Không có mô hình nào trong cơ sở dữ liệu.</p>
      </div>
    )
  }

  return (
    <div className=''>
      <div className='mx-auto px-4 py-6 md:py-10'>
        <HeaderBar />

        {/* Carousel */}
        <div className='overflow-x-hidden overflow-y-visible py-8' ref={emblaRef}>
          <div className='flex touch-pan-y gap-10 md:gap-12'>
            {items.map((item, i) => {
              const active = i === selected
              return (
                <article
                  key={item.id}
                  onClick={() => item.is_available && handleNavigate(item.id)}
                  className={`relative min-w-0 shrink-0 grow-0 basis-[85%] px-2 sm:basis-[55%] md:basis-[42%] md:px-4 lg:basis-[33%] ${
                    item.is_available ? 'cursor-pointer' : 'pointer-events-none'
                  }`}
                >
                  <div
                    className={`group relative mx-auto aspect-square w-[74vw] max-w-[28rem] transform-gpu overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 via-blue-400 to-sky-400 ring-1 ring-black/5 transition-transform duration-300 ease-out sm:w-[60vw] md:w-[28rem] ${
                      active ? 'z-20 scale-105 shadow-2xl md:scale-110' : 'scale-95 opacity-95 shadow'
                    }`}
                  >
                    <Image
                      src={item.image_url || '/images/shape.png'}
                      alt={item.name}
                      fill
                      className='object-cover'
                      sizes='(max-width: 640px) 74vw, (max-width: 768px) 60vw, 28rem'
                      priority={i === 0}
                    />
                    {!item.is_available && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
                        <span className='text-2xl font-semibold text-white drop-shadow-md'>Coming Soon</span>
                      </div>
                    )}
                  </div>

                  <div className='mt-12 text-center'>
                    <h3 className='text-xl font-semibold text-zinc-900'>{item.name}</h3>
                    <p className='mt-1 line-clamp-2 text-sm text-zinc-500'>{item.description}</p>
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
          {items.map((_, i) => (
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
