'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NavigationBar from './details/NavigationBar'
import AboutSection from './details/AboutSection'
import SkillSection from './details/SkillSection'
import ContentSection from './details/ContentSection'
import RecommendationSection from './details/RecommendationSection'
import HeroSection from './details/HeroSection'
import StatsSection from './details/StatSection'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { BookOpen } from 'lucide-react'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'

export default function CourseDetails() {
  const params = useParams()
  const courseId = typeof params?.courseId === 'string' ? params.courseId : undefined
  const { data: courseDetailsData, error, isLoading } = useGetCourseByIdQuery(courseId ?? '', { skip: !courseId })

  // const [activeSection, setActiveSection] = useState('about')
  // Handle scroll to update active section
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const sections = ['about', 'skill', 'lessons', 'suggestions']
  //     const scrollPosition = window.scrollY + 100

  //     for (const sectionId of sections) {
  //       const element = document.getElementById(sectionId)
  //       if (element) {
  //         const { offsetTop, offsetHeight } = element
  //         if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
  //           setActiveSection(sectionId)
  //           break
  //         }
  //       }
  //     }
  //   }
  //   window.addEventListener('scroll', handleScroll)
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [])

  if (isLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  if (error) return <div className='p-8 text-red-500'>Error loading course details.</div>
  if (!courseDetailsData?.data)
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <SEmpty
          title='Course not found'
          description='The course you are looking for does not exist or has been removed.'
          icon={<BookOpen className='h-12 w-12 text-gray-400' />}
        />
      </div>
    )

  return (
    <div className='min-h-screen bg-white'>
      <div className='relative mb-36'>
        <HeroSection course={courseDetailsData.data} />
        <StatsSection course={courseDetailsData.data} />
      </div>
      {/* <NavigationBar activeSection={activeSection} setActiveSection={setActiveSection} /> */}

      <AboutSection />

      <SkillSection course={courseDetailsData.data} />

      <ContentSection />

      <RecommendationSection />
    </div>
  )
}
