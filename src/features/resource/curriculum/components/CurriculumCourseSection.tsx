import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { SCarousel } from '@/components/shared/SCarousel'
import React from 'react'

export default function CurriculumCourseSection() {
  return (
    <div className='space-y-10 py-10'>
      <div className='text-center'>
        <h1 className='text-5xl'>Curriculum Aligned Resources</h1>
        <hr className='mx-auto my-6 w-1/4 border-2 border-amber-400' />
        <p className='mx-auto w-180 py-5'>
          You will have access to a full range of lessons, activities and explorations as well as different ways to
          navigate through it, highlighting different learning strategies and expected outcomes you can directly
          distribute to students via Strawbees Classroom.
        </p>
      </div>
      <SCarousel
        variant='spacing'
        autoplayDelay={2000}
        items={Array.from({ length: 5 }).map((_, i) => (
          <div className='p-1' key={i}>
            <CardLayout
              imageSrc='https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
              size='md'
              children={
                <div>
                  <h4 className='text-amber-custom-400 text-xs font-semibold'>COURSE</h4>
                  <p className='text-md font-semibold text-gray-700'>Course title</p>
                  <p className='mt-3 line-clamp-3 text-sm text-gray-500'>
                    {' '}
                    Course description Course description Course descriptionCourse descriptionCourse descriptionCourse
                    descriptionCourse descriptionCourse description
                  </p>
                </div>
              }
            />
          </div>
        ))}
      />
    </div>
  )
}
