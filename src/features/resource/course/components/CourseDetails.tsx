'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NavigationBar from './detail/NavigationBar'
import AboutSection from './detail/AboutSection'
import SkillSection from './detail/SkillSection'
import ContentSection from './detail/ContentSection'
import RecommendationSection from './detail/RecommendationSection'
import HeroSection from './detail/HeroSection'
import StatsSection from './detail/StatSection'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { BookOpen } from 'lucide-react'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'

export default function CourseDetails() {
  const params = useParams()
  const courseId = params.courseId
  const {
    data: course,
    error,
    isLoading
  } = useGetCourseByIdQuery(Number(courseId), {
    skip: !courseId,
    refetchOnMountOrArgChange: true, // Refetch when component mounts or courseId changes
    refetchOnFocus: true,
    refetchOnReconnect: true
  })

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
  if (!course?.data)
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
        <HeroSection course={course.data} />
        <StatsSection course={course.data} />
      </div>
      {/* <NavigationBar activeSection={activeSection} setActiveSection={setActiveSection} /> */}

      <AboutSection />

      <ContentSection />

      <RecommendationSection />
    </div>
  )
}
