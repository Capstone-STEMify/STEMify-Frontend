'use client'
import Image from 'next/image'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { BadgeCheck, Users, School } from 'lucide-react'
import { useGetCurriculumByIdQuery } from '../api/curriculumApi'
import KitInformationSection from './KitInformationSection'

type CurriculumDetailProps = {
  curriculumId?: number
}

export default function CurriculumDetail({ curriculumId }: CurriculumDetailProps) {
  const { data: curriculum, error, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId))

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='grid grid-cols-1 gap-12 px-4 py-12 md:grid-cols-2'>
        {/* Image Section */}
        <div className='relative overflow-hidden rounded-2xl shadow-md'>
          <Image
            src='/images/curriculum/curriculum-detail.jpg'
            alt='STEM Starter Curriculum'
            width={600}
            height={600}
            className='h-full w-full object-cover'
          />
        </div>

        {/* Content Section */}
        <div className='flex flex-col justify-center'>
          <h2 className='mb-2 text-sm text-gray-500 uppercase'>Stemify Curriculum</h2>
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
      </div>
      {/* Kit Information Section */}
      <KitInformationSection kitIds={curriculum?.data.kitIds} />
    </div>
  )
}
