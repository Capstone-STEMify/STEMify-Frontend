import React from 'react'
import HeroSection from './hero-section/HeroSection'
import ExploreResourcesSection from './course-section/CourseSection'
import ToolsSection from './tools-section/ToolsSection'
import BenefitsSection from './benefit-section/BenefitSection'
import StatsSection from './stats-section/StatsSection'
import TestimonialsSection from './testimonials-section/TestimonialsSection'
import FAQSection from './faq-section/FAQSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ExploreResourcesSection />
      <ToolsSection />
      <BenefitsSection />
      <StatsSection />
      <TestimonialsSection/>
      <FAQSection/>
    </div>
  )
}
