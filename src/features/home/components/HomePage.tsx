'use client'
import React, { useEffect, useRef, useState } from 'react'
import HeroSection from './hero-section/HeroSection'
import ExploreResourcesSection from './course-section/CourseSection'
import ToolsSection from './tools-section/ToolsSection'
import BenefitsSection from './benefit-section/BenefitSection'
import StatsSection from './stats-section/StatsSection'
import TestimonialsSection from './testimonials-section/TestimonialsSection'
import FAQSection from './faq-section/FAQSection'
import { usePathname } from 'next/navigation'

interface RegisterSectionRef {
  current: HTMLElement | null
}

interface RegisterSection {
  (ref: RegisterSectionRef, sectionId: string): void
}

interface GetSectionClasses {
  (sectionId: string, variant?: keyof typeof ANIMATION_VARIANTS | string, duration?: number, delay?: number): string
}

interface KeyScrollEvent extends KeyboardEvent {
  key: string
}

interface HandleAnimationCompleteProps {
  (isComplete: boolean): void
}

const ANIMATION_VARIANTS = {
  fadeUp: 'opacity-0 translate-y-16',
  fadeUpVisible: 'opacity-100 translate-y-0',
  fadeLeft: 'opacity-0 -translate-x-16',
  fadeLeftVisible: 'opacity-100 translate-x-0',
  fadeRight: 'opacity-0 translate-x-16',
  fadeRightVisible: 'opacity-100 translate-x-0',
  scaleUp: 'opacity-0 scale-90',
  scaleUpVisible: 'opacity-100 scale-100',
  slideDown: 'opacity-0 -translate-y-16',
  slideDownVisible: 'opacity-100 translate-y-0'
}

// Hook for scroll-based animations
const useScrollAnimation = () => {
  const [visibleSections, setVisibleSections] = useState(new Set<string>())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section')
            if (sectionId) {
              setVisibleSections((prev) => new Set([...prev, sectionId]))
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '-15% 0px -15% 0px',
        threshold: 0.1
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const getSectionClasses: GetSectionClasses = (sectionId, variant, duration, delay) => {
    const isVisible = visibleSections.has(sectionId)
    const baseClass = `transition-all duration-${duration} ease-out`
    const delayValue = delay ?? 0
    const delayClass = delayValue > 0 ? `delay-${delayValue}` : ''

    const hiddenClass = ANIMATION_VARIANTS[variant as keyof typeof ANIMATION_VARIANTS] || ANIMATION_VARIANTS.fadeUp
    const visibleClass =
      ANIMATION_VARIANTS[(variant + 'Visible') as keyof typeof ANIMATION_VARIANTS] || ANIMATION_VARIANTS.fadeUpVisible

    return `${baseClass} ${delayClass} ${isVisible ? visibleClass : hiddenClass}`
  }

  return { observerRef, getSectionClasses, visibleSections }
}

export default function HomePage() {
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(false)
  const containerRef = useRef(null)
  const heroScrollProgress = useRef(0)
  const { observerRef, getSectionClasses } = useScrollAnimation()

  // Section refs
  const exploreRef = useRef<HTMLDivElement | null>(null)
  const toolsRef = useRef<HTMLDivElement | null>(null)
  const benefitsRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const testimonialsRef = useRef<HTMLDivElement | null>(null)
  const faqRef = useRef<HTMLDivElement | null>(null)

  // Register sections for scroll animation
  useEffect(() => {
    const refs = [
      { ref: exploreRef, id: 'explore' },
      { ref: toolsRef, id: 'tools' },
      { ref: benefitsRef, id: 'benefits' },
      { ref: statsRef, id: 'stats' },
      { ref: testimonialsRef, id: 'testimonials' },
      { ref: faqRef, id: 'faq' }
    ]
    refs.forEach(({ ref, id }) => {
      if (ref.current && observerRef.current) {
        ref.current.setAttribute('data-section', id)
        observerRef.current.observe(ref.current)
      }
    })
    return () => {
      refs.forEach(({ ref }) => {
        if (ref.current && observerRef.current) {
          observerRef.current.unobserve(ref.current)
        }
      })
    }
  }, [observerRef])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = (e: WheelEvent | TouchEvent) => {
      if (!heroAnimationComplete) {
        e.preventDefault()
        let delta: number = 0
        if ('deltaY' in e && typeof e.deltaY === 'number') {
          delta = e.deltaY
        } else if ('detail' in e && typeof (e as any).detail === 'number') {
          delta = (e as any).detail * 40
        } else if ('wheelDelta' in e && typeof (e as any).wheelDelta === 'number') {
          delta = -(e as any).wheelDelta / 2
        } else if ('touches' in e && (e as TouchEvent).touches.length > 0) {
          delta = 0
        }
        const scrollSensitivity: number = 0.002

        heroScrollProgress.current += delta * scrollSensitivity
        heroScrollProgress.current = Math.max(0, Math.min(1, heroScrollProgress.current))

        setAnimationProgress(heroScrollProgress.current)

        // Enable normal scrolling only when hero animation is complete
        if (heroScrollProgress.current >= 1) {
          setIsScrollingEnabled(true)
        }
      }
    }

    const handleKeyScroll = (e: KeyScrollEvent) => {
      if (
        !heroAnimationComplete &&
        (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'PageDown' || e.key === 'PageUp')
      ) {
        e.preventDefault()

        const delta: number = e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown' ? 50 : -50
        const scrollSensitivity: number = 0.002

        heroScrollProgress.current += delta * scrollSensitivity
        heroScrollProgress.current = Math.max(0, Math.min(1, heroScrollProgress.current))

        setAnimationProgress(heroScrollProgress.current)

        if (heroScrollProgress.current >= 1) {
          setIsScrollingEnabled(true)
        }
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('keydown', handleKeyScroll, { passive: false })
    window.addEventListener('touchmove', handleScroll, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('keydown', handleKeyScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [heroAnimationComplete])

  const handleAnimationComplete: HandleAnimationCompleteProps = (isComplete) => {
    setHeroAnimationComplete(isComplete)
    if (isComplete) {
      setTimeout(() => {
        setIsScrollingEnabled(true)
      }, 100)
    } else {
      setIsScrollingEnabled(false)
    }
  }
  return (
    <div ref={containerRef} className='min-h-screen'>
      {/* Hero Section */}
      <div>
        <HeroSection onAnimationComplete={handleAnimationComplete} animationProgress={animationProgress} />
      </div>

      {/* Animated Sections with different variants */}
      <div ref={exploreRef} className={getSectionClasses('explore', 'fadeUp', 9000, 1200)}>
        <ExploreResourcesSection />
      </div>

      <div ref={toolsRef} className={getSectionClasses('tools', 'fadeLeft', 9000, 1400)}>
        <ToolsSection />
      </div>

      <div ref={benefitsRef} className={getSectionClasses('benefits', 'scaleUp', 9000, 1600)}>
        <BenefitsSection />
      </div>

      <div ref={statsRef} className={getSectionClasses('stats', 'slideDown', 9000, 1800)}>
        <StatsSection />
      </div>

      <div ref={testimonialsRef} className={getSectionClasses('testimonials', 'fadeRight', 9000, 2000)}>
        <TestimonialsSection />
      </div>

      <div ref={faqRef} className={getSectionClasses('faq', 'fadeUp', 9000, 2200)}>
        <FAQSection />
      </div>

      {/* Progress indicator */}
      {!heroAnimationComplete && (
        <div className='fixed right-8 bottom-8 z-50'>
          <div className='rounded-full bg-white/20 p-4 backdrop-blur-sm'>
            <div className='relative h-16 w-16 rounded-full border-4 border-white/30'>
              <div
                className='absolute inset-0 rounded-full border-4 border-orange-400 border-t-transparent transition-all duration-300'
                style={{ transform: `rotate(${animationProgress * 360}deg)` }}
              />
              <div className='absolute inset-0 flex items-center justify-center text-xs font-bold text-white'>
                {Math.round(animationProgress * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll indicator when hero is complete */}
      {heroAnimationComplete && isScrollingEnabled && (
        <div className='fixed right-8 bottom-8 z-40'>
          <div className='animate-bounce rounded-full bg-white/10 p-3 backdrop-blur-sm'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/60'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-white/80'></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
