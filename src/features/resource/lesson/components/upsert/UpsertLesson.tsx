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
import { useParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import { ApiSuccessResponse } from '@/types/baseModel'
import { Lesson } from '@/features/resource/lesson/types/lesson.type'
import { useGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import { fileToBase64 } from '@/utils/index'
import { Skill } from '@/features/resource/skill/types/skill.type'
import { Category } from '@/features/resource/category/types/category.type'
import { Standard } from '@/features/resource/standard/types/standard.type'
import { useModal } from '@/providers/ModalProvider'
import { Button } from '@/components/shadcn/button'

type LessonFormData = {
  title: string
  description: string
  learningOutcome: string
  courseId: number
  requirement?: string
  topics: string[]
  skills: string[]
  standards: string[]
  imageUrl: File | null
  imagePreviewUrl?: string
}

const defaultLessonData = (courseId: number): LessonFormData => ({
  courseId,
  title: '',
  description: '',
  learningOutcome: '',
  requirement: '',
  topics: [],
  skills: [],
  standards: [],
  imageUrl: null,
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
    imageUrl: null,
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

async function PatchLessonJsonPayload(oldData: LessonFormData, newData: LessonFormData, userId: string) {
  const patchData: Record<string, any> = { createdByUserId: userId }
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
  onSuccess?: () => void
}

export default function UpsertLesson({ onSuccess }: UpsertLessonProps) {
  const t = useTranslations('LessonDetails')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tv = useTranslations('validation')

  const { closeModal } = useModal()
  const { courseId, lessonId } = useParams()

  const lessonSchema = z.object({
    title: z.string().min(10, tv('lesson.title', { length: 10 })),
    description: z.string().min(50, tv('lesson.description', { length: 50 })),
    courseId: z.number().positive({ message: tv('lesson.courseId') }),
    learningOutcome: z.string().min(20, tv('lesson.learningOutcome', { length: 20 })),
    requirement: z.string().optional(),
    topics: z.array(z.string()),
    skills: z.array(z.string()),
    standards: z.array(z.string()),
    imageUrl: z
      .union([z.instanceof(File), z.null()])
      .refine((file) => file === null || file.size > 0, tv('lesson.imageUrl'))
      .refine((file) => file === null || file.size < 5 * 1024 * 1024, tv('lesson.imageSize', { size: 5 })),
    imagePreviewUrl: z.string().optional()
  })

  const userId = useAppSelector((state) => state.auth.user?.userId)

  const imageFieldRef = useRef<any>(null)

  const params = useParams()
  const lessonIdRaw = params?.lessonId
  // const lessonId = lessonIdRaw ? Number(Array.isArray(lessonIdRaw) ? lessonIdRaw[0] : lessonIdRaw) : undefined

  const { data: skills } = useGetAllSkillQuery({ pageSize: 50 })
  const { data: categories } = useGetAllCategoryQuery({ pageSize: 50 })
  const { data: standards } = useGetAllStandardQuery({ pageSize: 50 })
  const { data: lessonData, isLoading: isLessonLoading } = useGetLessonByIdQuery(Number(lessonId), {
    skip: !lessonId
  })
  const { data: course, isLoading } = useGetCourseByIdQuery(Number(courseId), {
    skip: !courseId
  })

  const isCreating = !lessonId
  const showCourseMissingError = isCreating && !isLoading && (!courseId || !course?.data)

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()

  const skillItems = skills?.data?.items ?? []
  const categoryItems = categories?.data?.items ?? []
  const standardItems = standards?.data?.items ?? []

  const form = useAppForm({
    defaultValues:
      lessonId && lessonData?.data
        ? mapLessonData(lessonData, skillItems, categoryItems, standardItems)
        : defaultLessonData(Number(courseId)),
    validators: {
      onChange: lessonSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (lessonId) {
          const jsonPayload = await PatchLessonJsonPayload(initialCourseDataRef.current!, value, userId!)
          const res = await updateLesson({ id: Number(lessonId), body: jsonPayload }).unwrap()
          toast.success(tt('successMessage.update', { title: res.data.title }))
        } else {
          const jsonPayload = await CreateLessonJsonPayload(value, userId!, Number(courseId))
          const res = await createLesson(jsonPayload).unwrap()
          toast.success(tt('successMessage.create', { title: res.data.title }))
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
      <form.AppField
        name='imageUrl'
        children={(field) => {
          imageFieldRef.current = field
          return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
        }}
      />
      <div className='space-y-6 lg:col-span-2'>
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

        <form.AppField
          name='description'
          children={(field) => (
            <field.TextAreaField
              label={t('form.fields.description.label')}
              placeholder={t('form.fields.description.placeholder')}
              className='h-30 rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppField
          name='learningOutcome'
          children={(field) => (
            <field.TextAreaField
              label={t('form.fields.learningOutcome.label')}
              placeholder={t('form.fields.learningOutcome.placeholder')}
              className='h-30 rounded-lg border-gray-300'
            />
          )}
        />

        <form.AppField
          name='requirement'
          children={(field) => (
            <field.TextAreaField
              label={t('form.fields.requirements.label')}
              placeholder={t('form.fields.requirements.placeholder')}
              className='h-30 rounded-lg border-gray-300'
            />
          )}
        />
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <SCard
          className='gap-2'
          title={t('form.fields.skills.label')}
          content={
            <form.AppField
              name='skills'
              children={(field) => (
                <field.MultipleCheckboxField
                  options={skills?.data.items.map((s) => ({
                    value: s.id.toString(),
                    label: s.skillName
                  }))}
                  className='flex flex-wrap gap-x-4 gap-y-3'
                />
              )}
            />
          }
        />

        <SCard
          className='gap-2'
          title={t('form.fields.topics.label')}
          content={
            <form.AppField
              name='topics'
              children={(field) => (
                <field.MultipleCheckboxField
                  options={categories?.data.items.map((c) => ({
                    value: c.id.toString(),
                    label: c.name
                  }))}
                  className='flex flex-wrap gap-x-4 gap-y-3'
                />
              )}
            />
          }
        />

        <SCard
          className='gap-3'
          title={t('form.fields.standards.label')}
          content={
            <form.AppField
              name='standards'
              children={(field) => (
                <field.MultipleCheckboxField
                  options={standards?.data.items.map((s) => ({
                    value: s.id.toString(),
                    label: s.standardName
                  }))}
                  className='flex flex-wrap gap-x-4 gap-y-3'
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
          <form.SubmitButton className='bg-amber-custom-400'>{tc('button.submit')}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
