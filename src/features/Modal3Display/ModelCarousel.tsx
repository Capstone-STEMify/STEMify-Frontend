'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import ModelViewer from './ModelViewer'
import Autoplay from 'embla-carousel-autoplay'

const models = [
  { id: 0, name: 'Stemify', url: '/models/stemify.glb', scale: 5 },
  { id: 1, name: 'Frog', url: '/models/stemifrog.glb', scale: 4 },
  { id: 2, name: 'Croco', url: '/models/stemicrocodile.glb', scale: 6 },
  { id: 3, name: 'Buffalo', url: '/models/stemibuffalo.glb', scale: 5 }
]

export default function ModelCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 70 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ])

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
    <div className='h-full w-full overflow-hidden' ref={emblaRef}>
      <div className='flex h-full'>
        {models.map((model, index) => (
          <div className='h-full w-full flex-none' key={model.id}>
            {index === selectedIndex && <ModelViewer model={model} />}
          </div>
        ))}
      </div>
    </div>
  )
}
