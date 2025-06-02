'use client'
import React, { useEffect, useRef, useState } from 'react'
import HeroSection from './hero-section/HeroSection'
import ExploreResourcesSection from './course-section/CourseSection'
import ToolsSection from './tools-section/ToolsSection'
import BenefitsSection from './benefit-section/BenefitSection'
import StatsSection from './stats-section/StatsSection'
import TestimonialsSection from './testimonials-section/TestimonialsSection'
import FAQSection from './faq-section/FAQSection'

export default function HomePage() {
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(false)
  const containerRef = useRef(null)
  const heroScrollProgress = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault()
      
      if (!heroAnimationComplete) {
        let delta: number = 0;
        if ('deltaY' in e && typeof e.deltaY === 'number') {
          delta = e.deltaY;
        } else if ('detail' in e && typeof (e as any).detail === 'number') {
          delta = (e as any).detail;
        } else if ('wheelDelta' in e && typeof (e as any).wheelDelta === 'number') {
          delta = (e as any).wheelDelta;
        } else if ('touches' in e && (e as TouchEvent).touches.length > 0) {
          delta = 0;
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

    interface KeyScrollEvent extends KeyboardEvent {
      key: string;
    }

    const handleKeyScroll = (e: KeyScrollEvent) => {
      if (
        !heroAnimationComplete &&
        (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === ' ' ||
          e.key === 'PageDown' ||
          e.key === 'PageUp'
        )
      ) {
        e.preventDefault();

        const delta: number =
          e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown'
            ? 50
            : -50;
        const scrollSensitivity: number = 0.002;

        heroScrollProgress.current += delta * scrollSensitivity;
        heroScrollProgress.current = Math.max(0, Math.min(1, heroScrollProgress.current));

        setAnimationProgress(heroScrollProgress.current);

        if (heroScrollProgress.current >= 1) {
          setIsScrollingEnabled(true);
        }
      }
    };

    if (!isScrollingEnabled) {
      // Disable normal scrolling until hero animation is complete
      document.body.style.overflow = 'hidden'
      window.addEventListener('wheel', handleScroll, { passive: false })
      window.addEventListener('keydown', handleKeyScroll)
      window.addEventListener('touchmove', handleScroll, { passive: false })
    } else {
      // Enable normal scrolling
      document.body.style.overflow = 'auto'
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('keydown', handleKeyScroll)
      window.removeEventListener('touchmove', handleScroll)
    }

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('keydown', handleKeyScroll)
      window.removeEventListener('touchmove', handleScroll)
      document.body.style.overflow = 'auto'
    }
  }, [heroAnimationComplete, isScrollingEnabled])

  interface HandleAnimationCompleteProps {
    (isComplete: boolean): void;
  }

  const handleAnimationComplete: HandleAnimationCompleteProps = (isComplete) => {
    setHeroAnimationComplete(isComplete)
    if (isComplete) {
      setTimeout(() => {
        setIsScrollingEnabled(true)
      }, 500) 
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen">
      <HeroSection 
        onAnimationComplete={handleAnimationComplete}
        animationProgress={animationProgress}
      />
      <ExploreResourcesSection />
      <ToolsSection />
      <BenefitsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      
      {!heroAnimationComplete && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <div className="w-16 h-16 rounded-full border-4 border-white/30 relative">
              <div 
                className="absolute inset-0 rounded-full border-4 border-orange-400 border-t-transparent transition-all duration-300"
                style={{
                  transform: `rotate(${animationProgress * 360}deg)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                {Math.round(animationProgress * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
