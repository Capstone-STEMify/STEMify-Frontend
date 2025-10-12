'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface HeroSectionProps {
  onAnimationComplete: (complete: boolean) => void
  animationProgress: number
}

export default function HeroSection({ onAnimationComplete, animationProgress }: HeroSectionProps) {
  const t = useTranslations('HeroSection')
  const tc = useTranslations('common')
  const containerRef = useRef(null)
  const subtitleRef = useRef(null)
  const titleRef = useRef(null)
  const brandRef = useRef(null)
  const searchRef = useRef(null)
  const blob1Ref = useRef(null)
  const blob2Ref = useRef(null)
  const router = useRouter()
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Course')

  const [animatedElements, setAnimatedElements] = useState({
    subtitle: false,
    title: false,
    // brand: false,
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
          // !animatedElements.brand &&
          !animatedElements.search
        ) {
          gsap.set([subtitleRef.current, titleRef.current, searchRef.current], {
            opacity: 0,
            y: 50
          })

          gsap.set(brandRef.current, { opacity: 1, y: 0 })

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

        // if (progress >= 0.75 && !animatedElements.brand) {
        //   gsap.to(brandRef.current, {
        //     opacity: 1,
        //     y: 0,
        //     duration: 0.6,
        //     delay: 0.4,
        //     ease: 'power2.out'
        //   })
        //   setAnimatedElements((prev) => ({ ...prev, brand: true }))
        // }

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

  const handleChangeType = (value: string) => {
    setSelectedType(value)
  }

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6'>
      <div className='absolute inset-0 h-full w-full'>
        <Image
          src='https://res.cloudinary.com/dgdi9wvpz/image/upload/strawbee_mh1shg.png'
          alt='Hero Image'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-slate-800/30' />
      </div>

      <div ref={containerRef} className='relative z-40 mx-auto w-full max-w-4xl text-center'>
        {/* Subtitle */}
        <p ref={subtitleRef} className='mb-3 text-lg font-medium text-white/90 drop-shadow-lg sm:mb-4 sm:text-xl'>
          {t('subtitle')}
        </p>

        {/* Main Title */}
        <div ref={titleRef} className='mb-3 sm:mb-4'>
          <h1 className='text-3xl leading-tight font-bold text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl'>
            {t('title')}
          </h1>
        </div>

        {/* Brand Name */}
        <div ref={brandRef} className='mb-10 overflow-visible sm:mb-14'>
          <p className='from-orange-custom-500 inline-block bg-gradient-to-r via-amber-500 to-orange-200 bg-clip-text pb-2 text-6xl leading-[1.15] font-bold tracking-tight text-transparent drop-shadow-lg sm:text-7xl md:pb-3 md:text-8xl lg:text-9xl'>
            Stemify
          </p>
        </div>

        {/* Search Bar */}
        <div
          ref={searchRef}
          className='mx-auto w-full max-w-3xl rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-sm'
        >
          {/* Mobile Layout */}
          <div className='block sm:hidden'>
            {/* Type selector on top for mobile */}
            <div className='mb-2 flex items-center justify-center border-b border-gray-200 px-4 py-2'>
              <div className='flex items-center space-x-2'>
                <Sparkles className='h-4 w-4 text-amber-400' />
                <Select onValueChange={handleChangeType} defaultValue={'Course'}>
                  <SelectTrigger className='w-[100px] border-none bg-transparent text-sm shadow-none focus-visible:ring-0'>
                    <SelectValue placeholder={selectedType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Course'>{t('course')}</SelectItem>
                    <SelectItem value='Lesson'>{t('lesson')}</SelectItem>
                    <SelectItem value='Activity'>{t('activity')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search input and button */}
            <div className='flex items-center'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className='flex-1 border-none bg-transparent px-4 py-3 text-base text-gray-700 placeholder-gray-500 outline-none'
              />

              <button className='m-1 flex transform items-center justify-center rounded-xl bg-amber-400 p-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'>
                <Search className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className='hidden items-center sm:flex'>
            <div className='flex items-center space-x-2 border-r border-gray-200 px-4 py-3'>
              <Sparkles className='h-5 w-5 text-amber-400' />
              <Select onValueChange={handleChangeType} defaultValue={'Course'}>
                <SelectTrigger className='w-[120px] border-none bg-transparent shadow-none focus-visible:ring-0'>
                  <SelectValue placeholder={selectedType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Course'>{t('course')}</SelectItem>
                  <SelectItem value='Lesson'>{t('lesson')}</SelectItem>
                  <SelectItem value='Activity'>{t('activity')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className='flex-1 border-none bg-transparent px-6 py-3 text-lg text-gray-700 placeholder-gray-500 outline-none'
            />

            <button
              className='flex transform items-center space-x-2 rounded-xl bg-amber-400 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'
              onClick={() => {
                router.push(`/${locale}/resource/courses`)
              }}
            >
              <Search className='h-5 w-5' />
              <span className='hidden sm:inline'>{tc('button.explore')}</span>
            </button>
          </div>
        </div>

        {/* Floating Blobs */}
        <div
          ref={blob1Ref}
          className='animate-float absolute -top-10 -left-10 h-24 w-24 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-2xl sm:-top-20 sm:-left-20 sm:h-40 sm:w-40 sm:blur-3xl'
        ></div>
        <div
          ref={blob2Ref}
          className='animate-float-delayed absolute -right-10 -bottom-5 h-20 w-20 rounded-full bg-gradient-to-r from-pink-400/20 to-yellow-400/20 blur-2xl sm:-right-20 sm:-bottom-10 sm:h-32 sm:w-32 sm:blur-3xl'
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
