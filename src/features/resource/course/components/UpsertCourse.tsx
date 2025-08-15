'use client'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import CourseBasicInfoSection from '@/features/resource/course/components/upsert/CourseBasicInfoSection'
import CourseAttributesSection from '@/features/resource/course/components/upsert/CourseAttributesSection'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { Course } from '../types/course.type'
import { useModal } from '@/providers/ModalProvider'
import { ApiSuccessResponse } from '@/types/baseModel'
import { useEffect, useRef } from 'react'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import { useAppForm } from '@/components/shared/form/items'
import { CourseSidebarSection } from '@/features/resource/course/components/upsert/CourseSidebarSection'
import {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from '@/features/resource/course/api/courseApi'
import {
  CourseFormData,
  createCourseSchema,
  updateCourseSchema
} from '@/features/resource/course/forms/courseForm.schema'
import { useAppSelector } from '@/hooks/redux-hooks'
import { fileToBase64 } from '@/utils/index'

const defaultCourseData: CourseFormData = {
  code: '',
  title: '',
  slug: '',
  description: '',
  ageRangeId: '1',
  prerequisites: '',
  studentTasks: '',
  level: '',
  imageUrl: null as any
}

/**
 *
 * @param data The course form data to be submitted.
 * @returns The FormData object containing the course form data.
 */
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
    image: imageBase64
  }
}

/**
 *
 * @param oldData The original course form data.
 * @param newData The updated course form data.
 * @returns The FormData object containing the updated course form data.
 */
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
    level: course.data.level ?? '',
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

  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: skills } = useGetAllSkillQuery()
  const { data: categories } = useGetAllCategoryQuery()
  const { data: standards } = useGetAllStandardQuery()
  const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId ? Number(courseId) : 0, {
    skip: !courseId
  })

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useAppForm({
    defaultValues: defaultCourseData,
    // validators: {
    //   onChange: (courseId ? updateCourseSchema : createCourseSchema) as any
    // },
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

  const initialCourseDataRef = useRef<CourseFormData | null>(null)

  const didResetOnce = useRef(false)

  useEffect(() => {
    const skillItems = skills?.data?.items ?? []
    const categoryItems = categories?.data?.items ?? []
    const standardItems = standards?.data?.items ?? []

    if (
      !didResetOnce.current &&
      courseData?.data &&
      skillItems.length > 0 &&
      categoryItems.length > 0 &&
      standardItems.length > 0
    ) {
      const mapped = mapCourseToFormData(courseData)

      form.reset(mapped)
      initialCourseDataRef.current = mapped
      didResetOnce.current = true
    }
  }, [courseData, skills, categories, standards])

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

  if (!ageRanges || !skills || !categories || !standards || (isLoading && !courseData)) {
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
          <CourseBasicInfoSection form={form} />
        </div>

        <div className='space-y-6'>
          <CourseSidebarSection
            form={form}
            ageRanges={ageRanges}
            imageFieldRef={imageFieldRef}
            handleEditImage={handleEditImage}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}
