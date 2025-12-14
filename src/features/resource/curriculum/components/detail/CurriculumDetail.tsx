'use client'
import Image from 'next/image'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { BookOpen, School } from 'lucide-react'
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
import LearningObjectives from '../../../../../components/shared/outcome/LearningObjectives'
import { useSearchLearningOutcomeQuery } from '@/features/resource/learning-outcome/api/learningOutcomeApi'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useTranslations } from 'next-intl'
import CurriculumEmulatorSection from '@/features/resource/curriculum/components/detail/CurriculumEmulatorSection'

export default function CurriculumDetail() {
  const { curriculumId } = useParams()
  const { data: curriculumData, error, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId))
  const {
    data: LearningOutcome,
    isLoading: outcomeLoading,
    isFetching: outcomeFetching
  } = useSearchLearningOutcomeQuery({ curriculumId: Number(curriculumId) })
  const tc = useTranslations('common.message')

  if (isLoading || outcomeLoading || outcomeFetching) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!curriculumData?.data)
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <SEmpty
          title='Curriculum not found'
          description='The Curriculum you are looking for does not exist or has been removed.'
          icon={<BookOpen className='h-12 w-12 text-gray-400' />}
        />
      </div>
    )

  return (
    <div className='relative mx-auto w-full pb-40'>
      <AnimatedBackground />
      <div className='relative'>
        {/* Content Section */}
        <div className='relative'>
          <CurriculumHeroSection curriculum={curriculumData.data} />
          <CurriculumStatsSection curriculum={curriculumData.data} />
        </div>

        <div className='mt-30 sm:mt-32'>
          <LearningObjectives title={tc('learnTitle')} outcomes={LearningOutcome?.data.items} />
        </div>
        {/* Course Section Carousel */}
        <div className='relative z-10 mt-8 sm:mt-12'>
          <CurriculumCourseSection courses={curriculumData?.data.courses || []} />
        </div>
        <div className='relative z-10 mt-8 sm:mt-12'>
          <CurriculumEmulatorSection emulations={curriculumData?.data.emulations || []} />
        </div>
        {/* Kit Information Section */}
        <div className='relative z-10 mt-20 sm:mt-20'>
          <KitInformationSection kitIds={curriculumData?.data.kitIds || []} />
        </div>
      </div>
    </div>
  )
}
