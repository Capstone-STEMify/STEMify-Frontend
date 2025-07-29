import { SCard } from '@/components/shared/card/SCard'
import React from 'react'

type CourseBasicInfoSectionProps = {
  form: any
}

export default function CourseBasicInfoSection({ form }: CourseBasicInfoSectionProps) {
  return (
    <>
      <SCard
        className='gap-3'
        title='Course Title'
        description='Enter a descriptive title for the course'
        content={
          <form.AppField
            name='title'
            children={(field: any) => (
              <field.TextAreaField placeholder='Enter course title' className='rounded-lg border-gray-300' />
            )}
          />
        }
      />
      {/* <SCard
        className='gap-3'
        title='Course Slug'
        description='Enter a descriptive slug for the course'
        content={
          <form.AppField
            name='slug'
            children={(field: any) => (
              <field.TextAreaField placeholder='Enter course slug' className='rounded-lg border-gray-300' />
            )}
          />
        }
      /> */}
      <SCard
        className='gap-3'
        title='Course Description'
        description='Provide a brief description of the course'
        content={
          <form.AppField
            name='description'
            children={(field: any) => (
              <field.TextAreaField placeholder='Enter course description' className='h-30 rounded-lg border-gray-300' />
            )}
          />
        }
      />
    </>
  )
}
