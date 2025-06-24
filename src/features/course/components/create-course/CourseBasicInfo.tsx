'use client'
import { Textarea } from '@/components/shadcn/textarea'
import React from 'react'

interface CourseBasicInfoProps {
  courseTitle: string
  courseDescription: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

export function CourseBasicInfo({
  courseTitle,
  courseDescription,
  onTitleChange,
  onDescriptionChange
}: CourseBasicInfoProps) {
  return (
    <>
      {/* Course Title */}
      <div className='rounded-lg bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold'>Course Title</h3>
        <Textarea
          value={courseTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder='Enter course title'
        />
      </div>

      {/* Course Description */}
      <div className='rounded-lg bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold'>Course Description</h3>
        <Textarea
          value={courseDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder='Enter course description...'
          className='h-28'
        />
      </div>
    </>
  )
}
