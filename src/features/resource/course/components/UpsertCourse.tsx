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
  useCreateCourseWithFormDataMutation,
  useGetCourseByIdQuery,
  useUpdateCourseWithFormDataMutation
} from '@/features/resource/course/api/courseApi'
import {
  CourseFormData,
  createCourseSchema,
  updateCourseSchema
} from '@/features/resource/course/forms/courseForm.schema'
import { useAppSelector } from '@/hooks/redux-hooks'

const defaultCourseData: CourseFormData = {
  title: '',
  slug: '',
  description: '',
  ageRangeId: '1',
  skills: [],
  categories: [],
  standards: [],
  imageUrl: null as any
}

/**
 *
 * @param data The course form data to be submitted.
 * @returns The FormData object containing the course form data.
 */
function CreateCourseFormData(data: CourseFormData, userId: string) {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('ageRangeId', data.ageRangeId.toString())
  formData.append('createdByUserId', userId)
  formData.append('courseId', '1')
  formData.append('slug', data.slug ?? '')

  data.skills.forEach((skill) => formData.append('SkillIds', skill))
  data.categories.forEach((category) => formData.append('CategoryIds', category))
  data.standards.forEach((standard) => formData.append('StandardIds', standard))

  if (data.imageUrl) {
    formData.append('Image', data.imageUrl)
  }

  return formData
}

/**
 *
 * @param oldData The original course form data.
 * @param newData The updated course form data.
 * @returns The FormData object containing the updated course form data.
 */
function PatchCourseFormData(oldData: CourseFormData, newData: CourseFormData): FormData {
  const formData = new FormData()

  if (oldData.title !== newData.title) formData.append('title', newData.title)
  if (oldData.slug !== newData.slug) formData.append('slug', newData.slug ?? '')
  if (oldData.description !== newData.description) formData.append('description', newData.description)
  if (oldData.ageRangeId !== newData.ageRangeId) formData.append('ageRangeId', newData.ageRangeId)

  if (JSON.stringify(oldData.skills) !== JSON.stringify(newData.skills)) {
    newData.skills.forEach((s) => formData.append('SkillIds', s))
  }

  if (JSON.stringify(oldData.categories) !== JSON.stringify(newData.categories)) {
    newData.categories.forEach((c) => formData.append('CategoryIds', c))
  }

  if (JSON.stringify(oldData.standards) !== JSON.stringify(newData.standards)) {
    newData.standards.forEach((s) => formData.append('StandardIds', s))
  }

  if (newData.imageUrl && typeof newData.imageUrl !== 'string') {
    formData.append('Image', newData.imageUrl)
  }

  return formData
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // loại bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '') // tiếp tục loại dấu
    .replace(/[^\w\s-]/g, '') // loại ký tự đặc biệt
    .replace(/\s+/g, '-') // thay khoảng trắng bằng '-'
    .replace(/-+/g, '-') // gộp nhiều '-' thành một
    .replace(/^-+|-+$/g, '') // xóa '-' ở đầu và cuối
}

function mapCourseToFormData(
  course: ApiSuccessResponse<Course>,
  allSkills: any[],
  allCategories: any[],
  allStandards: any[]
): CourseFormData {
  const skillNames = course.data.skillNames ?? []
  const categoryNames = course.data.categoryNames ?? []
  const standardNames = course.data.standardNames ?? []
  console.log('>> skillNames from API:', course.data.skillNames)
  console.log(
    '>> allSkills from API:',
    allSkills.map((s) => s.skillName)
  )

  const skillIds = allSkills
    .filter((s) => skillNames.some((n) => n.trim().toLowerCase() === s.skillName.trim().toLowerCase()))
    .map((s) => s.id.toString())
  const categoryIds = allCategories
    .filter((c) => categoryNames.some((n) => n.trim().toLowerCase() === c.categoryName.trim().toLowerCase()))
    .map((c) => c.id.toString())
  const standardIds = allStandards
    .filter((s) => standardNames.some((n) => n.trim().toLowerCase() === s.standardName.trim().toLowerCase()))
    .map((s) => s.id.toString())

  return {
    title: course.data.title ?? '',
    slug: course.data.slug ?? '',
    description: course.data.description ?? '',
    ageRangeId: course.data.ageRangeId?.toString() ?? '',
    skills: skillIds,
    categories: categoryIds,
    standards: standardIds,
    imageUrl: null as any,
    imagePreviewUrl: course.data.imageUrl ?? null
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

  const [createCourse, { isLoading: isCreating }] = useCreateCourseWithFormDataMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseWithFormDataMutation()
  const isSubmitting = isCreating || isUpdating

  const form = useAppForm({
    defaultValues: defaultCourseData,
    validators: {
      onChange: (courseId ? updateCourseSchema : createCourseSchema) as any
    },
    onSubmit: async ({ value }) => {
      try {
        value.slug = generateSlug(value.title)
        if (courseId) {
          const patchFormData = PatchCourseFormData(initialCourseDataRef.current!, value)
          const res = await updateCourse({ id: Number(courseId), body: patchFormData }).unwrap()
          toast.success(`Course updated successfully (${res.data.title})`, {
            action: {
              label: 'View Course',
              onClick: () => {
                router.push(`/resource/course/${res.data.id}`)
              }
            }
          })
        } else {
          const formData = CreateCourseFormData(value, userId!)
          const res = await createCourse(formData).unwrap()
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
      const mapped = mapCourseToFormData(courseData, skillItems, categoryItems, standardItems)

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
          <CourseAttributesSection form={form} skills={skills} categories={categories} standards={standards} />
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
