import { SCard } from '@/components/shared/card/SCard'
import { useTranslations } from 'next-intl'
import React from 'react'

type CourseBasicInfoSectionProps = {
  form: any
}

export default function CourseBasicInfoSection({ form }: CourseBasicInfoSectionProps) {
  const t = useTranslations('courseManagement')
  return (
    <>
      <SCard
        className='gap-3'
        title={t('title.label')}
        description={t('title.note')}
        content={
          <form.AppField
            name='title'
            children={(field: any) => (
              <field.TextAreaField placeholder={t('title.placeholder')} className='rounded-lg border-gray-300' />
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
        title={t('description.label')}
        description={t('description.note')}
        content={
          <form.AppField
            name='description'
            children={(field: any) => (
              <field.TextAreaField placeholder={t('description.placeholder')} className='h-30 rounded-lg border-gray-300' />
            )}
          />
        }
      />
    </>
  )
}
