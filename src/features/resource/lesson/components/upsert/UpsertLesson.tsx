'use client'
import { SCard } from '@/components/shared/card/SCard'
import React, { useRef, useEffect } from 'react'
import {
  useCreateLessonMutation,
  useGetLessonByIdQuery,
  useUpdateLessonMutation
} from '@/features/resource/lesson/api/lessonApi'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useLocale, useTranslations } from 'next-intl'
import { ApiSuccessResponse } from '@/types/baseModel'
import { Lesson } from '@/features/resource/lesson/types/lesson.type'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import { fileToBase64 } from '@/utils/index'
import { Skill } from '@/features/resource/skill/types/skill.type'
import { Category } from '@/features/resource/category/types/category.type'
import { Standard } from '@/features/resource/standard/types/standard.type'
import { UserRole } from '@/types/userRole'

const lessonSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  courseId: z.number().positive({ message: 'Course ID must be a positive number' }),
  learningOutcome: z.string().min(20, 'Learning outcome must be at least 20 characters long'),
  requirement: z.string().optional(),
  topics: z.array(z.string()),
  skills: z.array(z.string()),
  standards: z.array(z.string()),
  imageUrl: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => file === null || file.size > 0, 'Cover image is required')
    .refine((file) => file === null || file.size < 5 * 1024 * 1024, 'Max 5MB allowed'),
  imagePreviewUrl: z.string().optional()
})

type LessonFormData = z.infer<typeof lessonSchema>

const defaultLessonData: (courseId: number) => LessonFormData = (courseId) => ({
  courseId,
  title: '',
  description: '',
  learningOutcome: '',
  requirement: '',
  topics: [],
  skills: [],
  standards: [],
  imageUrl: null as any,
  imagePreviewUrl: ''
})

function mapLessonData(
  lesson: ApiSuccessResponse<Lesson>,
  allSkills: Skill[],
  allCategories: Category[],
  allStandards: Standard[]
): LessonFormData {
  const skillNames = lesson.data.skillNames ?? []
  const topicNames = lesson.data.topicNames ?? []
  const standardNames = lesson.data.standardNames ?? []

  const skillIds = allSkills
    .filter(
      (s) =>
        typeof s.skillName === 'string' &&
        skillNames.some((n) => typeof n === 'string' && n.trim().toLowerCase() === s.skillName.trim().toLowerCase())
    )
    .map((s) => s.id)

  const topicIds = allCategories
    .filter(
      (c) =>
        typeof c.name === 'string' &&
        topicNames.some((n) => typeof n === 'string' && n.trim().toLowerCase() === c.name.trim().toLowerCase())
    )
    .map((c) => c.id)

  const standardIds = allStandards
    .filter(
      (s) =>
        typeof s.standardName === 'string' &&
        standardNames.some(
          (n) => typeof n === 'string' && n.trim().toLowerCase() === s.standardName.trim().toLowerCase()
        )
    )
    .map((s) => s.id)

  return {
    title: lesson.data.title ?? '',
    description: lesson.data.description ?? '',
    learningOutcome: lesson.data.learningOutcome ?? '',
    courseId: lesson.data.courseId ?? 0,
    requirement: lesson.data.requirement ?? '',
    topics: topicIds.map(String),
    skills: skillIds.map(String),
    standards: standardIds.map(String),
    imageUrl: null as any,
    imagePreviewUrl: lesson.data.imageUrl ?? ''
  }
}

async function CreateLessonJsonPayload(data: LessonFormData, userId: string, courseId: number) {
  let imageBase64: string | null = null

  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    imageBase64 = await fileToBase64(data.imageUrl)
  }

  return {
    title: data.title,
    description: data.description,
    learningOutcome: data.learningOutcome,
    topicIds: data.topics.map(Number),
    skillIds: data.skills.map(Number),
    standardIds: data.standards.map(Number),
    requirement: data.requirement,
    courseId: courseId,
    createdByUserId: userId,
    image: imageBase64
  }
}

async function PatchLessonJsonPayload(oldData: LessonFormData, newData: LessonFormData, userId: string): Promise<any> {
  const patchData: Record<string, any> = {
    createdByUserId: userId
  }

  if (oldData.title !== newData.title) patchData.title = newData.title
  if (oldData.description !== newData.description) patchData.description = newData.description
  if (oldData.learningOutcome !== newData.learningOutcome) patchData.learningOutcome = newData.learningOutcome
  if (oldData.courseId !== newData.courseId) patchData.courseId = newData.courseId
  if (oldData.requirement !== newData.requirement) patchData.requirement = newData.requirement
  if (oldData.topics !== newData.topics) patchData.topicIds = newData.topics.map(Number)
  if (oldData.skills !== newData.skills) patchData.skillIds = newData.skills.map(Number)
  if (oldData.standards !== newData.standards) patchData.standardIds = newData.standards.map(Number)

  if (newData.imageUrl && typeof newData.imageUrl !== 'string') {
    const base64 = await fileToBase64(newData.imageUrl)
    patchData.image = base64
  }

  return patchData
}

interface UpsertLessonProps {
  courseIdModal?: number
  onSuccess?: () => void
}

export default function UpsertLesson({ courseIdModal, onSuccess }: UpsertLessonProps) {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('lessonManagement')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  const courseIdFromQuery = courseId ? Number(courseId) : 0
  const finalCourseId = courseIdModal || courseIdFromQuery

  const role = useAppSelector((state) => state.auth.user?.role)
  const userId = useAppSelector((state) => state.auth.user?.userId)

  const imageFieldRef = useRef<any>(null)

  // Get lessonId from URL
  const params = useParams()
  const lessonIdRaw = params?.lessonId
  const lessonId = lessonIdRaw ? Number(Array.isArray(lessonIdRaw) ? lessonIdRaw[0] : lessonIdRaw) : undefined

  const { data: skills } = useGetAllSkillQuery({ pageSize: 50 })
  const { data: categories } = useGetAllCategoryQuery({ pageSize: 50 })
  const { data: standards } = useGetAllStandardQuery({ pageSize: 50 })
  const { data: lessonData, isLoading: isLessonLoading } = useGetLessonByIdQuery(lessonId as number, {
    skip: !lessonId
  })
  const { data: course, isLoading } = useGetCourseByIdQuery(finalCourseId, {
    skip: !finalCourseId || finalCourseId <= 0
  })

  const isCreating = !lessonId
  const showCourseMissingError = isCreating && !isLoading && (!finalCourseId || !course?.data)

  // const [createLesson] = useCreateLessonWithFormDataMutation()
  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()

  const skillItems = skills?.data?.items ?? []
  const categoryItems = categories?.data?.items ?? []
  const standardItems = standards?.data?.items ?? []
  // Initialize form with lesson data if it exists
  const form = useAppForm({
    defaultValues:
      lessonId && lessonData?.data
        ? mapLessonData(lessonData, skillItems, categoryItems, standardItems)
        : defaultLessonData(finalCourseId),
    validators: {
      onChange: lessonSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (lessonId) {
          const jsonPayload = await PatchLessonJsonPayload(initialCourseDataRef.current!, value, userId!)
          const res = await updateLesson({ id: lessonId, body: jsonPayload }).unwrap()
          toast.success(tt('successMessage.update', {title: res.data.title}))
        } else {
          const jsonPayload = await CreateLessonJsonPayload(value, userId!, finalCourseId)
          const res = await createLesson(jsonPayload).unwrap()
          toast.success(tt('successMessage.create', {title: res.data.title}))
          if (role === UserRole.STAFF) router.push(`/${locale}/resource/lesson/update/${res.data.id}`)
          else if (role === UserRole.ADMIN) router.push(`/${locale}/admin/lesson/update/${res.data.id}`)
        }
        onSuccess?.()
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  const initialCourseDataRef = useRef<LessonFormData | null>(null)

  useEffect(() => {
    if (lessonData?.data && lessonId) {
      initialCourseDataRef.current = mapLessonData(
        lessonData,
        skills?.data?.items ?? [],
        categories?.data?.items ?? [],
        standards?.data?.items ?? []
      )
    }
  }, [lessonData, lessonId, skills, categories, standards])

  if (showCourseMissingError) {
    return (
      <div className='flex h-screen flex-col items-center justify-center gap-4 text-center'>
        <h2 className='text-2xl font-semibold text-red-600'>{t('courseNotFound.title')}</h2>
        <p className='text-gray-600'>{t('courseNotFound.description')}</p>
        <Link
          href='/resource/courses'
          className='mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700'
        >
          {tc('button.goToCourseList')}
        </Link>
      </div>
    )
  }

  if (isLessonLoading || !skills || !categories || !standards) {
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
        {lessonId ? `${t('updateTitle')}` : `${t('createTitle')}`}
      </h1>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='flex justify-between gap-2'>
            <SCard
              className='w-full gap-3'
              title={t('title.label')}
              description={t('title.note')}
              content={
                <form.AppField
                  name='title'
                  children={(field) => (
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
                children={(field) => (
                  <field.TextAreaField
                    placeholder={t('description.placeholder')}
                    className='h-50 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title={t('learningOutcome.label')}
            description={t('learningOutcome.note')}
            content={
              <form.AppField
                name='learningOutcome'
                children={(field) => (
                  <field.TextAreaField
                    placeholder={t('learningOutcome.placeholder')}
                    className='h-50 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title={t('requirement.label')}
            description={t('requirement.note')}
            content={
              <form.AppField
                name='requirement'
                children={(field) => (
                  <field.TextAreaField
                    placeholder={t('requirement.placeholder')}
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
            title={t('skill.label')}
            description={t('skill.note')}
            content={
              <form.AppField
                name='skills'
                children={(field) => (
                  <field.MultipleCheckboxField
                    options={skills?.data.items.map((s) => ({
                      value: s.id.toString(),
                      label: s.skillName
                    }))}
                    className='flex flex-wrap gap-x-8 gap-y-4'
                  />
                )}
              />
            }
          />
          <SCard
            className='gap-2'
            title={t('topic.label')}
            description={t('topic.note')}
            content={
              <form.AppField
                name='topics'
                children={(field: any) => (
                  <field.MultipleCheckboxField
                    options={categories?.data.items.map((c) => ({
                      value: c.id.toString(),
                      label: c.name
                    }))}
                    className='flex flex-wrap gap-x-8 gap-y-4'
                  />
                )}
              />
            }
          />
          <SCard
            className='gap-3'
            title={t('standard.label')}
            description={t('standard.note')}
            content={
              <form.AppField
                name='standards'
                children={(field) => (
                  <field.MultipleCheckboxField
                    options={standards?.data.items.map((s) => ({
                      value: s.id.toString(),
                      label: `${s.standardName}`
                    }))}
                    className='flex flex-wrap gap-x-8 gap-y-4'
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
            <form.SubmitButton className='bg-amber-custom-400 w-full rounded-full'>{tc('button.submit')}</form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
