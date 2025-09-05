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
import {
  CourseFormData,
  createCourseSchema,
  updateCourseSchema
} from '@/features/resource/course/forms/courseForm.schema'
import { useAppSelector } from '@/hooks/redux-hooks'
import { fileToBase64 } from '@/utils/index'
import { SCard } from '@/components/shared/card/SCard'
import { useLocale, useTranslations } from 'next-intl'
import { Course, CourseLevel } from '@/features/resource/course/types/course.type'

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
  const router = useRouter()
  const imageFieldRef = useRef<any>(null)
  const params = useParams()
  const courseId = params.courseId
  const t = useTranslations('course')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const initialCourseDataRef = useRef<CourseFormData | null>(null)
  const locale = useLocale()

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
          toast.success(tt('successMessage.update', {title: res.data.title}), {
            action: {
              label: 'View Course',
              onClick: () => {
                router.push(`/${locale}/resource/course/${res.data.id}`)
              }
            }
          })
        } else {
          const jsonPayload = await CreateCourseJsonPayload(value, userId!)
          const res = await createCourse(jsonPayload).unwrap()
          toast.success(tt('successMessage.create', {title: res.data.title}))
          router.push(`/${locale}/resource/course/${res.data.id}`)
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
              title={t('form.fields.code.label')}
              description={t('form.fields.code.note')}
              content={
                <form.AppField
                  name='code'
                  children={(field: any) => (
                    <field.TextAreaField
                      placeholder={t('form.fields.code.placeholder')}
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
            <SCard
              className='gap-3'
              title={t('form.fields.title.label')}
              description={t('form.fields.title.note')}
              content={
                <form.AppField
                  name='title'
                  children={(field: any) => (
                    <field.TextAreaField
                      placeholder={t('form.fields.title.placeholder')}
                      className='rounded-lg border-gray-300'
                    />
                  )}
                />
              }
            />
          </div>

          <SCard
            className='gap-3'
            title={t('form.fields.description.label')}
            description={t('form.fields.description.note')}
            content={
              <form.AppField
                name='description'
                children={(field: any) => (
                  <field.TextAreaField
                    placeholder={t('form.fields.description.placeholder')}
                    className='h-30 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title={t('form.fields.prerequisites.label')}
            description={t('form.fields.prerequisites.note')}
            content={
              <form.AppField
                name='prerequisites'
                children={(field: any) => (
                  <field.TextAreaField
                    placeholder={t('form.fields.prerequisites.placeholder')}
                    className='h-30 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title={t('form.fields.studentTasks.label')}
            description={t('form.fields.studentTasks.note')}
            content={
              <form.AppField
                name='studentTasks'
                children={(field: any) => (
                  <field.TextAreaField
                    placeholder={t('form.fields.studentTasks.placeholder')}
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
            title={t('form.fields.ageRange.label')}
            description={t('form.fields.ageRange.note')}
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
            title={t('form.fields.level.label')}
            description={t('form.fields.level.note')}
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
              {tc('button.submit')}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
