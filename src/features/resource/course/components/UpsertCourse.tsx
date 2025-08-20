'use client'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { Course, CourseLevel } from '../types/course.type'
import { useModal } from '@/providers/ModalProvider'
import { ApiSuccessResponse } from '@/types/baseModel'
import { useEffect, useRef } from 'react'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useAppForm } from '@/components/shared/form/items'
import {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseMutation
} from '@/features/resource/course/api/courseApi'
import {
  CourseFormData,
  createCourseSchema,
  updateCourseSchema
} from '@/features/resource/course/forms/courseForm.schema'
import { useAppSelector } from '@/hooks/redux-hooks'
import { fileToBase64 } from '@/utils/index'
import { SCard } from '@/components/shared/card/SCard'
import { useTranslations } from 'next-intl'

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

export default function UpsertCourse() {
  const userId = useAppSelector((state) => state.auth.user?.userId)
  const { openModal } = useModal()
  const router = useRouter()
  const imageFieldRef = useRef<any>(null)
  const params = useParams()
  const courseId = params.courseId
  const t = useTranslations('courseManagement')
  const initialCourseDataRef = useRef<CourseFormData | null>(null)

  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId ? Number(courseId) : 0, {
    skip: !courseId
  })

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()
  const isSubmitting = isCreating || isUpdating

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
          toast.success(`Course updated successfully (${res.data.title})`, {
            action: {
              label: 'View Course',
              onClick: () => {
                router.push(`/resource/course/${res.data.id}`)
              }
            }
          })
        } else {
          const jsonPayload = await CreateCourseJsonPayload(value, userId!)
          const res = await createCourse(jsonPayload).unwrap()
          toast.success(`Course created successfully (${res.data.title})`)
          router.push(`/resource/course/${res.data.id}`)
        }
      } catch (err) {
        toast.error('Failed to submit course')
        console.error(err)
      }
    }
  })

  // const didResetOnce = useRef(false)

  // useEffect(() => {
  //   console.log('courseData: ', courseData)

  //   if (!didResetOnce.current && courseData?.data) {
  //     const mapped = mapCourseToFormData(courseData)
  //     console.log('Mapped form data:', mapped)

  //     form.reset(mapped)
  //     initialCourseDataRef.current = mapped
  //     didResetOnce.current = true
  //   }
  // }, [courseData])

  if ((courseId && (!courseData || isLoading)) || !ageRanges) {
    return (
      <div className='flex h-screen items-center justify-center text-lg font-semibold text-gray-600'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <form
      className='mb-20'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='grid grid-cols-3 gap-8'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='grid grid-cols-2 gap-5'>
            <SCard
              className='gap-3'
              title={t('code.label')}
              description={t('code.note')}
              content={
                <form.AppField
                  name='code'
                  children={(field: any) => (
                    <field.TextAreaField placeholder={t('code.placeholder')} className='rounded-lg border-gray-300' />
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
                  children={(field: any) => (
                    <field.TextAreaField placeholder={t('title.placeholder')} className='rounded-lg border-gray-300' />
                  )}
                />
              }
            />
          </div>

          <SCard
            className='gap-3'
            title={t('description.label')}
            description={t('description.note')}
            content={
              <form.AppField
                name='description'
                children={(field: any) => (
                  <field.TextAreaField
                    placeholder={t('description.placeholder')}
                    className='h-30 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title={t('prerequisites.label')}
            description={t('prerequisites.note')}
            content={
              <form.AppField
                name='prerequisites'
                children={(field: any) => (
                  <field.TextAreaField
                    placeholder={t('prerequisites.placeholder')}
                    className='h-30 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title={t('studentTasks.label')}
            description={t('studentTasks.note')}
            content={
              <form.AppField
                name='studentTasks'
                children={(field: any) => (
                  <field.TextAreaField
                    placeholder={t('studentTasks.placeholder')}
                    className='h-30 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />
        </div>

        <div className='space-y-6'>
          <SCard
            className='gap-2'
            title={t('ageRange.label')}
            description={t('ageRange.note')}
            content={
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
                    className='grid grid-cols-4 gap-y-4'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-2'
            title={t('level.label')}
            description={t('level.note')}
            content={
              <form.AppField
                name='level'
                children={(field) => (
                  <field.RadioField
                    options={[
                      { value: CourseLevel.BEGINNER, label: t('level.options.beginner') },
                      { value: CourseLevel.INTERMEDIATE, label: t('level.options.intermediate') },
                      { value: CourseLevel.ADVANCED, label: t('level.options.advanced') }
                    ]}
                    className='flex gap-y-4'
                  />
                )}
              />
            }
          />

          <form.AppField
            name='imageUrl'
            children={(field) => {
              imageFieldRef.current = field
              return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
            }}
          />

          <form.AppForm>
            <form.SubmitButton loading={isSubmitting} className='bg-amber-custom-400 w-full rounded-full'>
              {t('btn')}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
