'use client'
import { SCard } from '@/components/shared/card/SCard'
import React, { useEffect } from 'react'
import {
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useSearchSectionQuery
} from '@/features/resource/section/api/sectionApi'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'

const sectionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(0, 'Duration must be a non-negative number'),
  lessonId: z.number().positive('Lesson ID must be a positive number')
})

type SectionFormData = z.infer<typeof sectionSchema>

const defaultSectionData: Omit<SectionFormData, 'lessonId'> = {
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
          description: sectionData.data.description || '',
          duration: sectionData.data.duration || 0,
          lessonId: sectionData.data.lessonId || lessonId || 0
        }
      : { ...defaultSectionData, lessonId: lessonId || 0 },

    onSubmit: async ({ value }) => {
      try {
        if (!lessonId) {
          toast.error('Lesson ID is missing.')
          return
        }

        if (sectionId) {
          const updatePayload = {
            description: value.description,
            duration: value.duration,
            status: 'Published'
          }
          await updateSection({ id: sectionId, body: updatePayload }).unwrap()
          toast.success('Section updated successfully')
        } else {
          const createPayload = {
            description: value.description,
            duration: value.duration,
            lessonId
          }
          const res = await createSection(createPayload).unwrap()
          toast.success('Section created successfully: ' + res.data.description)
          form.reset()
        }
        onSuccess?.()
      } catch (err) {
        toast.error('Failed to submit section')
        console.error(err)
      }
    }
  })

  // Effect to reset form values when fetched section data changes (for editing)
  useEffect(() => {
    if (sectionData?.data) {
      form.reset({
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
        Invalid Lesson ID. Cannot create or edit a section.
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
        {sectionId ? 'Update Section' : 'Create New Section'}
      </h1>

      <div className='w-xl space-y-10'>
        {/* Left Column: Description */}
        <div className='lg:col-span-2'>
          <SCard
            className='gap-3'
            title='Section Title'
            description='Provide a title for this section'
            content={
              <form.AppField
                name='description'
                children={(field) => (
                  <field.TextField placeholder='Enter section title' className='h-8 rounded-lg border-gray-300' />
                )}
              />
            }
          />
        </div>

        {/* Right Column: Inputs */}
        <div className='space-y-6'>
          <SCard
            className='w-full gap-3'
            title='Duration (minutes)'
            description='Enter the estimated duration of the section'
            content={
              <form.AppField
                name='duration'
                children={(field) => (
                  <field.TextField<number>
                    type='number'
                    placeholder='e.g., 15'
                    className='rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />
          <form.AppForm>
            <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full py-3 text-lg'>
              {sectionId ? 'Update Section' : 'Create Section'}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
