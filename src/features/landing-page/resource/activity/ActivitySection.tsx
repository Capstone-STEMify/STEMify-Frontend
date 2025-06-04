import CourseCard from '@/features/landing-page/resource/course/CourseCard'
import { dummyCardData } from '@/utils/mockData'
import React from 'react'

export default function ActivitySection() {
  return (
    <main className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {dummyCardData.map((course, index) => {
        return (
          <CourseCard
            key={index}
            resource={{
              title: course.title,
              description: course.description,
              image: course.image,
              category: 'Math',
              age: '8-9',
              duration: '2 hours'
            }}
          />
        )
      })}
    </main>
  )
}
