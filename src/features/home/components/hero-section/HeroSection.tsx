'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Sparkles } from 'lucide-react'

interface HeroSectionProps {
  onAnimationComplete: (complete: boolean) => void
  animationProgress: number
}

export default function HeroSection({ onAnimationComplete, animationProgress }: HeroSectionProps) {
  const containerRef = useRef(null)
  const subtitleRef = useRef(null)
  const titleRef = useRef(null)
  const brandRef = useRef(null)
  const searchRef = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Course')

  const [animatedElements, setAnimatedElements] = useState({
    subtitle: false,
    title: false,
    brand: false,
    search: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap')

        if (
          !animatedElements.subtitle &&
          !animatedElements.title &&
          !animatedElements.brand &&
          !animatedElements.search
        ) {
          gsap.set([subtitleRef.current, titleRef.current, brandRef.current, searchRef.current], {
            opacity: 0,
            y: 50
          })

          gsap.set([blob1Ref.current, blob2Ref.current], {
            opacity: 0,
            scale: 0
          })
        }

        const progress = animationProgress

        if (progress >= 0.25 && !animatedElements.subtitle) {
          gsap.to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
          setAnimatedElements((prev) => ({ ...prev, subtitle: true }))
        }

        if (progress >= 0.5 && !animatedElements.title) {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: 'power2.out'
          })
          setAnimatedElements((prev) => ({ ...prev, title: true }))
        }

        if (progress >= 0.75 && !animatedElements.brand) {
          gsap.to(brandRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out'
          })
          setAnimatedElements((prev) => ({ ...prev, brand: true }))
        }

        if (progress >= 1 && !animatedElements.search) {
          gsap.to(searchRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.6,
            ease: 'power2.out'
          })
          setAnimatedElements((prev) => ({ ...prev, search: true }))
        }

        gsap.to([blob1Ref.current, blob2Ref.current], {
          opacity: Math.min(progress * 1.5, 1),
          scale: Math.min(progress * 1.2, 1),
          duration: 0.3,
          ease: 'power2.out'
        })

        if (progress >= 1) {
          onAnimationComplete(true)
        } else {
          onAnimationComplete(false)
        }
      } catch (error) {
        console.log('GSAP not available', error)
        onAnimationComplete(true)
      }
    }

    loadGSAP()
  }, [animationProgress, onAnimationComplete, animatedElements])

  return (
    <section className='relative flex h-screen items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 h-full w-full'>
        <video autoPlay loop muted playsInline className='h-full w-full object-cover'>
          <source src='https://res.cloudinary.com/dtjgueyp2/video/upload/vd-63.mp4' type='video/mp4' />
          <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400'></div>
        </video>

        <div className='absolute inset-0 z-10'></div>
        <div className='absolute right-0 bottom-0 left-0 z-20 h-80 bg-gradient-to-t from-white via-white/70 to-transparent'></div>
        <div className='absolute right-0 bottom-0 left-0 z-25 h-60 bg-gradient-to-t from-white via-white/50 to-transparent'></div>
        <div className='absolute right-0 bottom-0 left-0 z-30 h-40 bg-gradient-to-t from-white via-white/30 to-transparent'></div>
      </div>

      <div ref={containerRef} className='relative z-40 mx-auto max-w-4xl px-6 text-center'>
        <p ref={subtitleRef} className='mb-4 text-lg font-medium text-white/90 drop-shadow-lg'>
          Turn STEM into a game - Inspire passion, creativity
        </p>

        <div ref={titleRef} className='mb-4'>
          <h1 className='text-6xl leading-tight font-bold text-white drop-shadow-2xl md:text-7xl'>
            The students light bulbs is coming on
          </h1>
        </div>

        <div ref={brandRef} className='mb-12'>
          <p className='animate-pulse bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 bg-clip-text text-6xl font-bold text-transparent drop-shadow-lg md:text-7xl'>
            STEMify
          </p>
        </div>

        <div
          ref={searchRef}
          className='mx-auto max-w-3xl rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-sm'
        >
          <div className='flex items-center'>
            <div className='flex items-center space-x-2 border-r border-gray-200 px-4 py-3'>
              <Sparkles className='h-5 w-5 text-amber-400' />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='cursor-pointer border-none bg-transparent font-medium text-gray-700 outline-none'
              >
                <option value='Course'>Course</option>
                <option value='Lesson'>Lesson</option>
                <option value='Activity'>Activity</option>
              </select>
            </div>

            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='What would you like to explore today?'
              className='flex-1 border-none bg-transparent px-6 py-3 text-lg text-gray-700 placeholder-gray-500 outline-none'
            />

            <button className='flex transform items-center space-x-2 rounded-xl bg-amber-400 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'>
              <Search className='h-5 w-5' />
              <span>Explore</span>
            </button>
          </div>
        </div>

        <div
          ref={blob1Ref}
          className='animate-float absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl'
        ></div>
        <div
          ref={blob2Ref}
          className='animate-float-delayed absolute -right-20 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-r from-pink-400/20 to-yellow-400/20 blur-3xl'
        ></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-3deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
