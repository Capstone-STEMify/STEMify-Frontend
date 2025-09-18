'use client'
import Image from 'next/image'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { School } from 'lucide-react'
import KitInformationSection from '../../../kit/components/list/KitInformationSection'
import BackButton from '@/components/shared/button/BackButton'
import CurriculumCourseSection from '@/features/resource/curriculum/components/detail/CurriculumCourseSection'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useParams } from 'next/navigation'
import AnimatedBackground from '@/components/layout/animation/AnimatedBackground'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import CurriculumHeroSection from './CurriculumHeroSection'
import CurriculumStatsSection from './CurriculumStatSection'
import LearningObjectives from './CurriculumOutcome'

export default function CurriculumDetail() {
  const { curriculumId } = useParams()
  const { data: curriculumData, error, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId))

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <div className='relative mx-auto w-full pb-4'>
      <AnimatedBackground />
      <div className='relative'>
          {/* Content Section */}
          <div className='relative'>
            <CurriculumHeroSection curriculum={curriculumData?.data} />
            <CurriculumStatsSection curriculum={curriculumData?.data} />
          </div>

        <div className='mt-30 sm:mt-32'>
          <LearningObjectives/>
        </div>

        {/* Kit Information Section */}
        <div className='relative z-10 mt-20 sm:mt-20'>
          <KitInformationSection kits={curriculumData?.data.kits || []} />
        </div>

        {/* Course Section Carousel */}
        <div className='relative z-10 mt-8 sm:mt-12'>
          <CurriculumCourseSection courses={curriculumData?.data.courses || []} />
        </div>
      </div>
    </div>
  )
}
