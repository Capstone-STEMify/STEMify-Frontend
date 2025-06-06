'use client'
import HeroSection from '@/components/shared/hero-section/HeroSection'
import StatsSection from '@/features/home/components/stats-section/StatsSection'
import React, { useState, useEffect } from 'react'
import NavigationBar from './details/NavigationBar'
import AboutSection from './details/AboutSection'
import SkillSection from './details/SkillSection'
import ContentSection from './details/ContentSection'
import ReviewSection from './details/ReviewSection'
import RecommendationSection from './details/RecommendationSection'

export default function CourseDetails() {
  const [activeSection, setActiveSection] = useState('about')

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skill', 'courses', 'reviews', 'suggestions']
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      <div className='relative mb-36'>
        <HeroSection />
        <StatsSection />
      </div>
      <NavigationBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <AboutSection />
      <SkillSection />
      <ContentSection />
      <ReviewSection />
      <RecommendationSection />
    </div>
  )
}
