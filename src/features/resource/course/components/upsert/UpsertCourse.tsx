'use client'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { ApiSuccessResponse } from '@/types/baseModel'
import { useEffect, useRef } from 'react'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useAppForm } from '@/components/shared/form/items'
import {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseMutation
} from '@/features/resource/course/api/courseApi'
import { CourseFormData, useCourseSchemas } from '@/features/resource/course/forms/courseForm.schema'
import { useAppSelector } from '@/hooks/redux-hooks'
import { fileToBase64 } from '@/utils/index'
import { SCard } from '@/components/shared/card/SCard'
import { useLocale, useTranslations } from 'next-intl'
import { Course, CourseLevel } from '@/features/resource/course/types/course.type'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'

const defaultCourseData: CourseFormData = {
  code: '',
  title: '',
  slug: '',
  description: '',
  ageRangeId: '1',
  prerequisites: '',
  studentTasks: '',
  level: CourseLevel.BEGINNER,
  imageUrl: null as any
}

async function CreateCourseJsonPayload(data: CourseFormData, userId: string) {
  let imageBase64: string | null = null

  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    imageBase64 = await fileToBase64(data.imageUrl)
  }

  return {
    code: data.code,
    title: data.title,
    slug: data.slug,
    description: data.description,
    ageRangeId: parseInt(data.ageRangeId),
    createdByUserId: userId,
    studentTasks: data.studentTasks,
    prerequisites: data.prerequisites,
    level: data.level,
    image: imageBase64
  }
}

async function PatchCourseJsonPayload(oldData: CourseFormData, newData: CourseFormData, userId: string): Promise<any> {
  const patchData: Record<string, any> = {
    createdByUserId: userId
  }

  if (oldData.title !== newData.title) patchData.title = newData.title
  if (oldData.slug !== newData.slug) patchData.slug = newData.slug
  if (oldData.description !== newData.description) patchData.description = newData.description
  if (oldData.ageRangeId !== newData.ageRangeId) patchData.ageRangeId = parseInt(newData.ageRangeId)
  if (oldData.studentTasks !== newData.studentTasks) patchData.studentTasks = newData.studentTasks
  if (oldData.code !== newData.code) patchData.code = newData.code
  if (oldData.prerequisites !== newData.prerequisites) patchData.prerequisites = newData.prerequisites
  if (oldData.level !== newData.level) patchData.level = newData.level

  if (newData.imageUrl && typeof newData.imageUrl !== 'string') {
    const base64 = await fileToBase64(newData.imageUrl)
    patchData.image = base64
  }

  return patchData
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapCourseToFormData(course: ApiSuccessResponse<Course>): CourseFormData {
  return {
    code: course.data.code ?? '',
    title: course.data.title ?? '',
    slug: course.data.slug ?? '',
    description: course.data.description ?? '',
    level: course.data.level ?? CourseLevel.BEGINNER,
    studentTasks: course.data.studentTasks ?? '',
    prerequisites: course.data.prerequisites ?? '',
    ageRangeId: course.data.ageRangeId?.toString() ?? '',
    imageUrl: null as any,
    imagePreviewUrl: course.data.imageUrl ?? undefined
  }
}

type UpsertCourseProps = {
  courseId?: number
  onSuccess?: () => void
}

export default function UpsertCourse({ courseId, onSuccess }: UpsertCourseProps) {
  const userId = useAppSelector((state) => state.auth.user?.userId)
  const router = useRouter()
  const imageFieldRef = useRef<any>(null)
  const t = useTranslations('course')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const initialCourseDataRef = useRef<CourseFormData | null>(null)
  const locale = useLocale()
  const { closeModal } = useModal()

  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId
  })

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()
  const isSubmitting = isCreating || isUpdating

  const { createCourseSchema, updateCourseSchema } = useCourseSchemas()

  const form = useAppForm({
    defaultValues: courseId && courseData?.data ? mapCourseToFormData(courseData) : defaultCourseData,
    validators: {
      onChange: (courseId ? updateCourseSchema : createCourseSchema) as any
    },
    onSubmit: async ({ value }) => {
      try {
        value.slug = generateSlug(value.title)
        if (courseId) {
          const patchJson = await PatchCourseJsonPayload(initialCourseDataRef.current!, value, userId!)
          const res = await updateCourse({ id: Number(courseId), body: patchJson }).unwrap()
          onSuccess?.()
          toast.success(tt('successMessage.update', { title: res.data.title }), {
            action: {
              label: 'View Course',
              onClick: () => {
                router.push(`/${locale}/admin/course/${res.data.id}`)
              }
            }
          })
        } else {
          const jsonPayload = await CreateCourseJsonPayload(value, userId!)
          const res = await createCourse(jsonPayload).unwrap()
          toast.success(tt('successMessage.create', { title: res.data.title }))
          onSuccess?.()
          router.push(`/${locale}/admin/course/${res.data.id}`)
        }
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  useEffect(() => {
    if (courseData?.data && courseId) {
      initialCourseDataRef.current = mapCourseToFormData(courseData)
    }
  }, [courseData, courseId])

  if ((courseId && (!courseData || isLoading)) || !ageRanges) {
    return (
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-gray-600'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <form
      className='space-y-5'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='space-y-6'>
        <form.AppField
          name='imageUrl'
          children={(field) => {
            imageFieldRef.current = field
            return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
          }}
        />

        <div className='grid grid-cols-2 gap-5'>
          <form.AppField
            name='code'
            children={(field) => (
              <field.TextField
                label={t('form.fields.code.label')}
                placeholder={t('form.fields.code.placeholder')}
                className='rounded-lg border-gray-300'
                disabled={!!courseId}
              />
            )}
          />
          <form.AppField
            name='title'
            children={(field) => (
              <field.TextField
                label={t('form.fields.title.label')}
                placeholder={t('form.fields.title.placeholder')}
                className='rounded-lg border-gray-300'
              />
            )}
          />
        </div>

        <form.AppField
          name='description'
          children={(field: any) => (
            <field.TextAreaField
              label={t('form.fields.description.label')}
              placeholder={t('form.fields.description.placeholder')}
              className='h-30 rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppField
          name='prerequisites'
          children={(field: any) => (
            <field.TextAreaField
              label={t('form.fields.prerequisites.label')}
              placeholder={t('form.fields.prerequisites.placeholder')}
              className='h-30 rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppField
          name='studentTasks'
          children={(field: any) => (
            <field.TextAreaField
              label={t('form.fields.studentTasks.label')}
              placeholder={t('form.fields.studentTasks.placeholder')}
              className='h-30 rounded-lg border-gray-300'
            />
          )}
        />
      </div>

      <div className='grid grid-cols-2 gap-5'>
        <SCard
          title={t('form.fields.ageRange.label')}
          content={
            <>
              <form.AppField
                name='ageRangeId'
                children={(field) => (
                  <field.RadioField
                    options={ageRanges?.data.items
                      .slice()
                      .sort((a, b) => a.id - b.id)
                      .map((a) => ({
                        value: a.id.toString(),
                        label: a.ageRangeLabel
                      }))}
                    className='grid grid-cols-3 gap-y-4'
                  />
                )}
              />
            </>
          }
        />

        <SCard
          title={t('form.fields.level.label')}
          content={
            <form.AppField
              name='level'
              children={(field) => (
                <field.RadioField
                  options={[
                    { value: CourseLevel.BEGINNER, label: t('form.fields.level.options.beginner') },
                    { value: CourseLevel.INTERMEDIATE, label: t('form.fields.level.options.intermediate') },
                    { value: CourseLevel.ADVANCED, label: t('form.fields.level.options.advanced') }
                  ]}
                  className='grid grid-cols-3 gap-y-4'
                />
              )}
            />
          }
        />
      </div>
      <div className='mb-3 flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={closeModal}>
          {tc('button.cancel')}
        </Button>
        <form.AppForm>
          <form.SubmitButton loading={isSubmitting} className='bg-amber-custom-400'>
            {tc('button.submit')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
