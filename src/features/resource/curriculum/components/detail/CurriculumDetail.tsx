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
    <div className='relative bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* <AnimatedBackground /> */}
      <div className='relative z-10 my-10'>
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-10 py-5 md:grid-cols-2 md:gap-12'>
          {/* Content Section */}
          <div className='flex flex-col'>
            <div>
              <BackButton />
              <h2 className='mb-2 text-sm text-gray-500 uppercase'>{curriculumData?.data.code}</h2>
              <h1 className='mb-4 text-4xl font-bold text-gray-900'>{curriculumData?.data.title}</h1>
              <div className='mb-6 h-1 w-24 bg-yellow-500' />
            </div>

            <ScrollArea className='mb-4 h-[150px] text-base text-gray-700 sm:h-[200px] sm:text-lg'>
              {curriculumData?.data.description}
            </ScrollArea>

            <div className='mb-6 flex flex-wrap items-center gap-4 sm:gap-6'>
              <Card className='flex items-center gap-2 bg-white px-4 py-2'>
                <School className='h-5 w-5 text-yellow-500' />
                <CardContent className='p-0 text-sm font-medium'>Age 6–14 | Grade K–8</CardContent>
              </Card>
            </div>

            <Button className='bg-amber-custom-400 w-fit rounded-xl p-6 text-lg text-black hover:bg-yellow-600'>
              EXPLORE NOW
            </Button>
          </div>
          {/* Image Section */}
          <div className='relative order-1 overflow-hidden rounded-2xl shadow-md md:order-2'>
            <Image
              src={
                curriculumData?.data.imageUrl ||
                'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
              }
              alt='STEM Starter Curriculum'
              width={600}
              height={600}
              className='aspect-square object-cover'
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
