'use client'
import { SCard } from '@/components/shared/card/SCard'
import React, { useRef, useEffect } from 'react'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import {
  useCreateLessonWithFormDataMutation,
  useGetLessonByIdQuery,
  useUpdateLessonWithFormDataMutation
} from '@/features/resource/lesson/api/lessonApi'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'

const lessonSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  courseId: z.number().positive({ message: 'Course ID must be a positive number' }),
  imageUrl: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => file === null || file.size > 0, 'Cover image is required')
    .refine((file) => file === null || file.size < 5 * 1024 * 1024, 'Max 5MB allowed'),
  imagePreviewUrl: z.string().optional()
})

type LessonFormData = z.infer<typeof lessonSchema>

const defaultLessonData: LessonFormData = {
  title: '',
  description: '',
  courseId: 0,
  imageUrl: null as any,
  imagePreviewUrl: ''
}

function buildLessonFormData(data: LessonFormData) {
  const formData = new FormData()
  formData.append('Title', data.title || '')
  formData.append('Description', data.description || '')
  formData.append('createdByUserId', 'b7e2c7e2-8c1a-4e2e-9b2a-2e7c8e2a1b3c')
  formData.append('courseId', data.courseId.toString())
  if (data.imageUrl) {
    formData.append('Image', data.imageUrl)
  }
  return formData
}

import { useParams, useSearchParams } from 'next/navigation'

export default function CreateLesson() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  const courseIdFromQuery = courseId ? Number(courseId) : 0

  const { openModal } = useModal()
  const imageFieldRef = useRef<any>(null)

  // Get lessonId from URL
  const params = useParams()
  const lessonIdRaw = params?.lessonId
  const lessonId = lessonIdRaw ? Number(Array.isArray(lessonIdRaw) ? lessonIdRaw[0] : lessonIdRaw) : undefined

  const { data: lessonData, isLoading: isLessonLoading } = useGetLessonByIdQuery(lessonId as number, {
    skip: !lessonId
  })

  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: skills } = useGetAllSkillQuery()
  const { data: categories } = useGetAllCategoryQuery()
  const { data: standards } = useGetAllStandardQuery()
  const [createLesson, { data: lessonCreateItem, error }] = useCreateLessonWithFormDataMutation()
  const [updateLesson] = useUpdateLessonWithFormDataMutation()

  // Initialize form with lesson data if it exists
  const form = useAppForm({
    defaultValues: lessonData?.data
      ? {
          title: lessonData.data.title || '',
          description: lessonData.data.description || '',
          courseId: lessonData.data.courseId || 0,
          imageUrl: null
        }
      : {
          ...defaultLessonData,
          courseId: courseIdFromQuery
        },
    // validators: {
    //   onChange: lessonSchema
    // },
    onSubmit: async ({ value }) => {
      try {
        const formData = buildLessonFormData(value)

        if (lessonId) {
          await updateLesson({ id: lessonId, formData }).unwrap()
          toast.success('Lesson updated successfully')
        } else {
          await createLesson(formData).unwrap()
          toast.success('Lesson created successfully')
          form.reset()
        }
      } catch (err) {
        toast.error('Failed to submit lesson')
        console.error(err)
      }
    }
  })

  // if has lesson data, update form value when lessonData changed
  useEffect(() => {
    if (lessonData?.data) {
      form.reset({
        title: lessonData.data.title || '',
        description: lessonData.data.description || '',
        courseId: lessonData.data.courseId || 0,
        imageUrl: null,
        imagePreviewUrl: lessonData.data.imageUrl || ''
      })
    }
  }, [lessonData])

  const handleEditImage = () => {
    const currentImage = form.state.values.imageUrl
    if (!currentImage) return

    const imageUrl = URL.createObjectURL(currentImage)

    openModal('editImage', {
      imageSrc: imageUrl,
      onConfirm: (croppedFile: File) => {
        imageFieldRef.current?.handleChange(croppedFile)
        URL.revokeObjectURL(imageUrl)
      }
    })
  }

  if (!ageRanges || !skills || !categories || !standards || isLessonLoading) {
    return (
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-gray-600'>Loading...</div>
    )
  }

  return (
    <form
      className='mx-auto min-h-screen max-w-7xl space-y-8 p-4 md:p-8'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='flex justify-between gap-2'>
            <SCard
              className='w-full gap-3'
              title='Lesson Title'
              description='Enter a descriptive title for the lesson'
              content={
                <form.AppField
                  name='title'
                  children={(field) => (
                    <field.TextAreaField placeholder='Enter lesson title' className='rounded-lg border-gray-300' />
                  )}
                />
              }
            />

            <SCard
              className='w-full gap-3'
              title='Course Id'
              description='Select the course this lesson belongs to'
              content={
                <form.AppField
                  name='courseId'
                  children={(field) => (
                    <field.TextField<number>
                      type='number'
                      placeholder='Course ID'
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
          </div>
          <SCard
            className='gap-3'
            title='Lesson Description'
            description='Provide a brief description of the lesson'
            content={
              <form.AppField
                name='description'
                children={(field) => (
                  <field.TextAreaField
                    placeholder='Enter lesson description'
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

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button type='button' onClick={handleEditImage} className='flex-1 rounded-full py-5'>
              Edit Image
            </Button>
          </div>
          <form.AppForm>
            <form.SubmitButton className='w-full rounded-full'>Submit</form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
