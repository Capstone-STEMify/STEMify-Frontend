'use client'
import { SCard } from '@/components/shared/card/SCard'
import React, { useRef, useEffect } from 'react'
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
import { useParams, useSearchParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/redux-hooks'

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

function buildLessonFormData(data: LessonFormData, userId: string) {
  const formData = new FormData()
  formData.append('Title', data.title || '')
  formData.append('Description', data.description || '')
  formData.append('createdByUserId', userId)
  formData.append('courseId', data.courseId.toString())
  formData.append('Status', 'Published')
  if (data.imageUrl) {
    formData.append('Image', data.imageUrl)
  }
  return formData
}

interface UpsertLessonProps {
  courseIdModal?: number
  onSuccess?: () => void
}

export default function UpsertLesson({ courseIdModal, onSuccess }: UpsertLessonProps) {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  const courseIdFromQuery = courseId ? Number(courseId) : 0
  const finalCourseId = courseIdModal || courseIdFromQuery

  const userId = useAppSelector((state) => state.auth.user?.userId)

  const { openModal } = useModal()
  const imageFieldRef = useRef<any>(null)

  // Get lessonId from URL
  const params = useParams()
  const lessonIdRaw = params?.lessonId
  const lessonId = lessonIdRaw ? Number(Array.isArray(lessonIdRaw) ? lessonIdRaw[0] : lessonIdRaw) : undefined

  const { data: lessonData, isLoading: isLessonLoading } = useGetLessonByIdQuery(lessonId as number, {
    skip: !lessonId
  })
  const { data: course, isLoading } = useGetCourseByIdQuery(finalCourseId, {
    skip: !finalCourseId || finalCourseId <= 0
  })

  const isCreating = !lessonId
  const showCourseMissingError = isCreating && !isLoading && (!finalCourseId || !course?.data)

  const [createLesson] = useCreateLessonWithFormDataMutation()
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
          courseId: finalCourseId
        },
    // validators: {
    //   onChange: lessonSchema
    // },
    onSubmit: async ({ value }) => {
      try {
        const formData = buildLessonFormData(value, userId!)

        if (lessonId) {
          await updateLesson({ id: lessonId, formData }).unwrap()
          toast.success('Lesson updated successfully')
        } else {
          await createLesson(formData).unwrap()
          toast.success('Lesson created successfully')
          form.reset()
        }
        onSuccess?.()
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

  if (showCourseMissingError) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4 text-center'>
        <h2 className='text-2xl font-semibold text-red-600'>Course not found</h2>
        <p className='text-gray-600'>You need to select a course before creating a lesson.</p>
        <Link
          href='/resource/courses'
          className='mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700'
        >
          Go to Course List
        </Link>
      </div>
    )
  }

  if (isLessonLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <form
      className='space-y-4'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <h1 className='mb-5 text-center text-5xl font-bold text-gray-800'>
        {lessonId ? 'Update Lesson' : 'Create New Lesson'}
      </h1>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          {/* {course?.data && (
            <SCard
              content={
                <>
                  <h2 className='mb-1 text-lg font-semibold'>Course: {course.data.title}</h2>
                  <p>{course.data.description}</p>
                </>
              }
            ></SCard>
          )} */}
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
                    className='h-50 rounded-lg border-gray-300'
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

          {/* <div className='flex flex-col gap-3 sm:flex-row'>
            <Button type='button' onClick={handleEditImage} className='flex-1 rounded-full py-5'>
              Edit Image
            </Button>
          </div> */}
          <form.AppForm>
            <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full'>Submit</form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
