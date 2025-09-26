'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ModelViewer from './ModelViewer'

const models = [
  { id: 0, name: 'Stemify', url: '/models/stemify.glb', scale: 2 },
  { id: 1, name: 'Robot', url: '/models/stemifrog.glb', scale: 2 },
  { id: 2, name: 'Rocket', url: '/models/stemicrocodile.glb', scale: 4 },
]

export default function ModelCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    emblaApi.on('select', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <div className="w-full">
      <div className="h-[70vh] w-full bg-gray-100">
        <ModelViewer model={models[selectedIndex]} />
      </div>

      <div className="relative overflow-hidden p-4" ref={emblaRef}>
        <div className="flex">
          {models.map(model => (
            <div
              className="relative flex min-w-0 shrink-0 basis-full items-center justify-center text-2xl font-bold"
              key={model.id}
              style={{ height: '150px' }}
            >
              {model.name}
            </div>
          ))}
        </div>
        <button
          className="absolute left-8 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-md"
          onClick={scrollPrev}
        >
          {'<'}
        </button>
        <button
          className="absolute right-8 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-md"
          onClick={scrollNext}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}