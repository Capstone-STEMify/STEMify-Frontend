'use client'
import React, { useEffect } from 'react'
import {
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation
} from '@/features/resource/section/api/sectionApi'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'

type SectionFormData = {
  title: string
  description: string
  duration: number
  lessonId: number
  isVisibleToStudent: boolean
}

const defaultSectionData: Omit<SectionFormData, 'lessonId'> = {
  title: '',
  description: '',
  duration: 0,
  isVisibleToStudent: true
}

interface UpsertSectionProps {
  lessonId?: number
  sectionId?: number
  onSuccess?: () => void
}

export default function UpsertSection({
  lessonId: propLessonId,
  sectionId: propSectionId,
  onSuccess
}: UpsertSectionProps) {
  const params = useParams()
  const token = useAppSelector((state) => state.auth.token)

  const t = useTranslations('section')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tv = useTranslations('validation')

  const sectionSchema = z.object({
    title: z.string().min(1, tv('section.title')),
    description: z.string().min(1, tv('section.description')),
    duration: z.number().min(1, tv('section.duration')),
    lessonId: z.number().positive(tv('section.lessonId')),
    isVisibleToStudent: z.boolean()
  })

  const lessonIdRaw = propLessonId ?? params?.lessonId
  const sectionIdRaw = propSectionId ?? params?.sectionId

  const lessonId = lessonIdRaw ? Number(Array.isArray(lessonIdRaw) ? lessonIdRaw[0] : lessonIdRaw) : undefined
  const sectionId = sectionIdRaw ? Number(Array.isArray(sectionIdRaw) ? sectionIdRaw[0] : sectionIdRaw) : undefined

  const { data: sectionData, isLoading: isSectionLoading } = useGetSectionByIdQuery(sectionId as number, {
    skip: !sectionId || !token
  })

  const [createSection] = useCreateSectionMutation()
  const [updateSection] = useUpdateSectionMutation()

  const form = useAppForm({
    defaultValues: sectionData?.data
      ? {
          title: sectionData.data.title || '',
          description: sectionData.data.description || '',
          duration: sectionData.data.duration || 0,
          isVisibleToStudent: sectionData.data.isVisibleToStudent || true,
          lessonId: sectionData.data.lessonId || lessonId || 0
        }
      : { ...defaultSectionData, lessonId: lessonId || 0 },
    validators: {
      onChange: sectionSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (!lessonId) {
          toast.error(tt('errorSpecific.id'))
          return
        }

        if (sectionId) {
          const updatePayload = {
            title: value.title,
            description: value.description,
            duration: Number(value.duration),
            isVisibleToStudent: value.isVisibleToStudent
          }
          await updateSection({ id: sectionId, body: updatePayload }).unwrap()
          toast.success(tt('successMessage.update', { title: value.title }))
        } else {
          const createPayload = {
            lessonId,
            title: value.title,
            description: value.description,
            duration: Number(value.duration),
            isVisibleToStudent: value.isVisibleToStudent
          }
          const res = await createSection(createPayload).unwrap()
          toast.success(tt('successMessage.create', { title: res.data.title }))
          form.reset()
        }
        onSuccess?.()
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  useEffect(() => {
    if (sectionData?.data) {
      form.reset({
        title: sectionData.data.title || '',
        description: sectionData.data.description || '',
        duration: sectionData.data.duration || 0,
        isVisibleToStudent: sectionData.data.isVisibleToStudent || true,
        lessonId: sectionData.data.lessonId || lessonId || 0
      })
    }
  }, [sectionData, lessonId, form])

  if (isSectionLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!lessonId && !isSectionLoading) {
    return (
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-red-600'>
        {t('lessonNotFound.description')}
      </div>
    )
  }

  return (
    <form
      className='space-y-8 md:px-4'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='w-xl space-y-6'>
        <form.AppField
          name='title'
          children={(field) => (
            <field.TextField
              label={t('form.fields.title.label')}
              placeholder={t('form.fields.title.placeholder')}
              className='h-8 rounded-lg border-gray-300'
            />
          )}
        />
        <div className='grid grid-cols-2 gap-6'>
          <form.AppField
            name='duration'
            children={(field) => (
              <field.TextField
                type='number'
                label={t('form.fields.duration.label')}
                placeholder={t('form.fields.duration.placeholder')}
                className='mx-auto rounded-lg border-gray-300'
              />
            )}
          />
          <form.AppField
            name='isVisibleToStudent'
            children={(field) => (
              <field.SwitchField label={t('form.fields.isVisibleToStudent.label')} className='mt-5' />
            )}
          />
        </div>
        <form.AppField
          name='description'
          children={(field) => (
            <field.TextAreaField
              label={t('form.fields.description.label')}
              placeholder={t('form.fields.description.placeholder')}
              className='h-25 rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppForm>
          <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full py-3 text-lg'>
            {tc('button.save')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
