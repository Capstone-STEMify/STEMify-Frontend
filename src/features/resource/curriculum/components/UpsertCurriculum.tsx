'use client'

import BackButton from '@/components/shared/button/BackButton'
import { SCard } from '@/components/shared/card/SCard'
import { useAppForm } from '@/components/shared/form/items'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import z from 'zod'
import LearningOutcomeTable from '../../learning-outcome/components/list/LearningOutcomeTable'
import { Separator } from '@/components/shadcn/separator'
import CourseManagement from '../../course/components/table/CourseManagement'

const curriculumFormSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters long'),
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
  imageUrl: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => file === null || file.size > 0, 'Cover image is required')
    .refine((file) => file === null || file.size < 5 * 1024 * 1024, 'Max 5MB allowed')
    .optional(),
  imagePreviewUrl: z.string().optional()
})

type CurriculumForm = z.infer<typeof curriculumFormSchema>

const defaultCurriculum: CurriculumForm = {
  code: '',
  title: '',
  description: '',
  imageUrl: null,
  imagePreviewUrl: ''
}

export default function UpsertCurriculum({ curriculumId }: { curriculumId?: number }) {
  const t = useTranslations('Curriculum')
  const imageFieldRef = useRef<any>(null)

  const form = useAppForm({
    defaultValues: defaultCurriculum,
    validators: {},
    onSubmit: ({ value }) => {}
  })
  return (
    <div>
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <SCard
              className='gap-3'
              title={t('code.label')}
              description={t('code.note')}
              content={
                <form.AppField
                  name='code'
                  children={(field) => (
                    <field.TextField placeholder={t('code.placeholder')} className='rounded-lg border-gray-300' />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('title.label')}
              description={t('title.note')}
              content={
                <form.AppField
                  name='title'
                  children={(field) => (
                    <field.TextField placeholder={t('title.placeholder')} className='rounded-lg border-gray-300' />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('description.label')}
              description={t('description.note')}
              content={
                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextAreaField
                      placeholder={t('description.placeholder')}
                      className='h-30 rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
          </div>
          <div className='space-y-6'>
            <form.AppField
              name='imageUrl'
              children={(field) => {
                imageFieldRef.current = field
                return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
              }}
            />

            <form.AppForm>
              <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full'>{t('btn')}</form.SubmitButton>
            </form.AppForm>
          </div>
        </div>
      </form>
    </div>
  )
}
