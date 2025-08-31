'use client'

import { SCard } from '@/components/shared/card/SCard'
import { useAppForm } from '@/components/shared/form/items'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import z from 'zod'

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
interface UpsertCurriculumProps {
  curriculumId?: number
  onSuccess?: () => void
  inModal?: boolean
}

export default function UpsertCurriculum({ curriculumId, onSuccess, inModal }: UpsertCurriculumProps) {
  // Translations
  const t = useTranslations('curriculum')
  const tBtn = useTranslations('button')
  const imageFieldRef = useRef<any>(null)
  const gridCols = inModal ? 'grid-cols-1' : 'sm:grid-cols-1 lg:grid-cols-3'

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
        <div className={`grid gap-8 ${gridCols}`}>
          <div className='space-y-6 lg:col-span-2'>
            <SCard
              className='gap-3'
              title={t('form.fields.code.label')}
              description={t('form.fields.code.note')}
              content={
                <form.AppField
                  name='code'
                  children={(field) => (
                    <field.TextField
                      placeholder={t('form.fields.code.placeholder')}
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('form.fields.name.label')}
              description={t('form.fields.name.note')}
              content={
                <form.AppField
                  name='title'
                  children={(field) => (
                    <field.TextField
                      placeholder={t('form.fields.name.placeholder')}
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('form.fields.description.label')}
              description={t('form.fields.description.note')}
              content={
                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextAreaField
                      placeholder={t('form.fields.description.placeholder')}
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
              <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full'>{tBtn('save')}</form.SubmitButton>
            </form.AppForm>
          </div>
        </div>
      </form>
    </div>
  )
}
