'use client'
import React, { useState, useEffect } from 'react'
import HeroSection from './hero-section/HeroSection'
import StatsSection from './stats-section/StatSection'
import NavigationBar from './navigation-bar/NavigationBar'
import AboutSection from './about-section/AboutSection'
import SkillSection from './skill-section/SkillSection'
import ContentSection from './content-section/ContentSection'
import ReviewSection from './review-section/ReviewSection'
import RecommendationSection from './recommendation-section/RecommendationSection'

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
