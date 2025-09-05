'use client'
import { SCard } from '@/components/shared/card/SCard'
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

const tv = useTranslations('validation')

const sectionSchema = z.object({
  title: z.string().min(1, tv('section.title')),
  description: z.string().min(1, tv('section.description')),
  duration: z.number().min(0, tv('section.duration')),
  lessonId: z.number().positive(tv('section.lessonId'))
})

type SectionFormData = z.infer<typeof sectionSchema>

const defaultSectionData: Omit<SectionFormData, 'lessonId'> = {
  title: '',
  description: '',
  duration: 0
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

  const t = useTranslations('sectionManagement')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  // Get lessonId and sectionId from URL and parse them to numbers
  const lessonIdRaw = propLessonId ?? params?.lessonId
  const sectionIdRaw = propSectionId ?? params?.sectionId

  const lessonId = lessonIdRaw ? Number(Array.isArray(lessonIdRaw) ? lessonIdRaw[0] : lessonIdRaw) : undefined
  const sectionId = sectionIdRaw ? Number(Array.isArray(sectionIdRaw) ? sectionIdRaw[0] : sectionIdRaw) : undefined

  // Fetch section data if sectionId exists (for editing)
  const { data: sectionData, isLoading: isSectionLoading } = useGetSectionByIdQuery(sectionId as number, {
    skip: !sectionId || !token
  })

  // API mutations for creating and updating a section
  const [createSection] = useCreateSectionMutation()
  const [updateSection] = useUpdateSectionMutation()

  // Initialize the form
  const form = useAppForm({
    defaultValues: sectionData?.data
      ? {
          title: sectionData.data.title || '',
          description: sectionData.data.description || '',
          duration: sectionData.data.duration || 0,
          lessonId: sectionData.data.lessonId || lessonId || 0
        }
      : { ...defaultSectionData, lessonId: lessonId || 0 },

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
            duration: Number(value.duration)
          }
          await updateSection({ id: sectionId, body: updatePayload }).unwrap()
          toast.success(tt('successMessage.update'))
        } else {
          const createPayload = {
            title: value.title,
            description: value.description,
            duration: Number(value.duration),
            lessonId
          }
          const res = await createSection(createPayload).unwrap()
          toast.success(tt('successMessage.create', {title: res.data.title}))
          form.reset()
        }
        onSuccess?.()
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  // Effect to reset form values when fetched section data changes (for editing)
  useEffect(() => {
    if (sectionData?.data) {
      form.reset({
        title: sectionData.data.title || '',
        description: sectionData.data.description || '',
        duration: sectionData.data.duration || 0,
        lessonId: sectionData.data.lessonId || lessonId || 0
      })
    }
  }, [sectionData, lessonId, form])

  // Show loading state while fetching data for the edit form or the sections list for creation
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
        `${t('lessonNotFound.description')}`
      </div>
    )
  }

  return (
    <form
      className='space-y-8 md:p-4'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <h1 className='text-center text-3xl font-bold text-gray-800'>
        {sectionId ? `${t('updateTitle')}` : `${t('createTitle')}`}
      </h1>

      <div className='w-xl space-y-10'>
        {/* Left Column: Description */}
        <div className='lg:col-span-2'>
          <SCard
            className='gap-3'
            title={t('title.label')}
            description={t('title.note')}
            content={
              <form.AppField
                name='title'
                children={(field) => (
                  <field.TextField placeholder={t('title.placeholder')} className='h-8 rounded-lg border-gray-300' />
                )}
              />
            }
          />
        </div>

        <div className='lg:col-span-2'>
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
                    className='h-25 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />
        </div>

        {/* Right Column: Inputs */}
        <div className='space-y-6'>
          <SCard
            className='w-full gap-3'
            title={t('duration.label')}
            description={t('duration.note')}
            content={
              <form.AppField
                name='duration'
                children={(field) => (
                  <field.TextField<number>
                    type='number'
                    placeholder={t('duration.placeholder')}
                    className='rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />
          <form.AppForm>
            <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full py-3 text-lg'>
              {sectionId ? `${t('button.updateSection')}` : `${t('button.createSection')}`}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
