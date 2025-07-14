'use client'
import React from 'react'
import HeroSection from '@/components/shared/hero-section/HeroSection'
import TeachingSection from './landing/TeachingSection'
import LearningSection from './landing/LearningSection'
import ToolSection from './landing/ToolSection'

export default function ClassroomLanding() {
  return (
    <div className='min-h-screen bg-white'>
      <HeroSection />
      <TeachingSection />
      <LearningSection />
      <ToolSection />
    </div>
  )
}
