'use client'
import Image from 'next/image'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { School } from 'lucide-react'
import KitInformationSection from './KitInformationSection'
import BackButton from '@/components/shared/button/BackButton'
import CurriculumCourseSection from '@/features/resource/curriculum/components/detail/CurriculumCourseSection'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'

type CurriculumDetailProps = {
  curriculumId?: number
}

export default function CurriculumDetail({ curriculumId }: CurriculumDetailProps) {
  const { data: curriculum, error, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId))

  return (
    <div className='mx-auto max-w-5xl px-4 py-12'>
      <BackButton />
      <div className='mt-5 grid grid-cols-1 gap-12 py-5 md:grid-cols-2'>
        {/* Content Section */}
        <div className='flex flex-col'>
          <h2 className='mb-2 text-sm text-gray-500 uppercase'>STEM_STRAW_K1</h2>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>STEM Starter Curriculum</h1>
          <div className='mb-6 h-1 w-12 bg-yellow-500' />

          <p className='mb-4 text-lg text-gray-700'>
            This is an introductory toolbox designed for educators in learning environments and young makers at home who
            are looking for a STEM solution.
          </p>
          <p className='mb-6 text-lg text-gray-700'>
            This kit is a great introduction to the world of STEM education and offers a fun and engaging way to learn
            about science, technology, engineering, art, and math.
          </p>

          <div className='mb-6 flex items-center gap-6'>
            <Card className='flex items-center gap-2 px-4 py-2'>
              <School className='h-5 w-5 text-yellow-500' />
              <CardContent className='p-0 text-sm font-medium'>Age 6–14 | Grade K–8</CardContent>
            </Card>
          </div>

          <Button className='bg-amber-custom-400 w-fit rounded-xl p-6 text-lg text-black hover:bg-yellow-600'>
            EXPLORE NOW
          </Button>
        </div>
        {/* Image Section */}
        <div className='relative overflow-hidden rounded-2xl shadow-md'>
          <Image
            src='https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
            alt='STEM Starter Curriculum'
            width={600}
            height={600}
            className='h-full w-full object-cover'
          />
        </div>
      </div>

      {/* Kit Information Section */}
      <KitInformationSection kitIds={curriculum?.data.kits} />

      {/* Course Section Carousel */}
      <CurriculumCourseSection />
    </div>
  )
}
