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
    <div className='relative mx-auto w-full py-4'>
      <AnimatedBackground />
      <div className='relative z-10 my-10'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 py-5 md:grid-cols-2 md:gap-12'>
          {/* Content Section */}
          <div className='flex flex-col'>
            <div className='space-y-4'>
              <BackButton />
              <span className='text-md m-4 font-semibold text-gray-700 uppercase'>{curriculumData?.data.code}</span>
              <h1 className='mb-4 text-4xl font-bold text-gray-900'>{curriculumData?.data.title}</h1>
              <div className='mb-6 h-1 w-24 bg-yellow-500' />
            </div>

            <ScrollArea className='text-gray-70 mb-4 text-base sm:text-lg'>
              {curriculumData?.data.description}
            </ScrollArea>

            <div className='mb-6 flex flex-wrap items-center gap-4 sm:gap-6'>
              <Card className='flex items-center gap-2 bg-white px-4 py-2'>
                <School className='h-5 w-5 text-yellow-500' />
                <CardContent className='p-0 text-sm font-medium'>Age 6–14 | Grade K–8</CardContent>
              </Card>
            </div>

            {/* <Button className='bg-amber-custom-400 w-fit rounded-xl p-6 text-lg text-black hover:bg-yellow-600'>
              EXPLORE NOW
            </Button> */}
          </div>
          {/* Image Section */}
          <div className='flex items-start justify-end'>
            <Image
              src={
                curriculumData?.data.imageUrl ||
                'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
              }
              alt='STEM Starter Curriculum'
              width={500}
              height={500}
              className='aspect-square rounded-2xl object-cover shadow-md'
            />
          </div>
        </div>

        {/* Kit Information Section */}
        <div className='relative z-10 mt-8 sm:mt-12'>
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
