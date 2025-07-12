'use client'
import { SCard } from '@/components/shared/card/SCard'
import React, { useRef } from 'react'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useCreateCourseWithFormDataMutation } from '@/features/resource/course/api/courseApi'

const courseSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  ageRange: z.string().min(1, 'Age range is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  standards: z.array(z.string()).min(1, 'At least one standard is required'),
  imageUrl: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Cover image is required')
    .refine((file) => file.size < 5 * 1024 * 1024, 'Max 5MB allowed')
})

type CourseFormData = z.infer<typeof courseSchema>

const defaultCourseData: CourseFormData = {
  title: '',
  description: '',
  ageRange: '',
  skills: [],
  categories: [],
  standards: [],
  imageUrl: null as any
}

function buildCourseFormData(data: CourseFormData) {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('ageRangeId', data.ageRange)
  formData.append('createdByUserId', 'b7e2c7e2-8c1a-4e2e-9b2a-2e7c8e2a1b3c')
  formData.append('courseId', '1')

  data.skills.forEach((skill) => formData.append('skillId', skill))
  data.categories.forEach((category) => formData.append('categoryId', category))
  data.standards.forEach((standard) => formData.append('standardId', standard))

  if (data.imageUrl) {
    formData.append('Image', data.imageUrl)
  }

  return formData
}

export default function CreateCourse() {
  const { openModal } = useModal()
  const imageFieldRef = useRef<any>(null)

  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: skills } = useGetAllSkillQuery()
  const { data: categories } = useGetAllCategoryQuery()
  const { data: standards } = useGetAllStandardQuery()
  const [createCourse, { data: courseCreateItem, error }] = useCreateCourseWithFormDataMutation()

  const form = useAppForm({
    defaultValues: defaultCourseData,
    validators: {
      onChange: courseSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = buildCourseFormData(value)
        await createCourse(formData).unwrap()
        toast.success('Course created successfully')
        form.reset()
      } catch (err) {
        toast.error('Failed to create course')
        console.error(err)
      }
    }
  })

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

  if (!ageRanges || !skills || !categories || !standards) {
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
      <div className='grid grid-cols-3 gap-8'>
        <div className='space-y-6 lg:col-span-2'>
          <SCard
            className='gap-3'
            title='Course Title'
            description='Enter a descriptive title for the course'
            content={
              <form.AppField
                name='title'
                children={(field) => (
                  <field.TextAreaField placeholder='Enter course title' className='rounded-lg border-gray-300' />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title='Course Description'
            description='Provide a brief description of the course'
            content={
              <form.AppField
                name='description'
                children={(field) => (
                  <field.TextAreaField
                    placeholder='Enter course description'
                    className='h-30 rounded-lg border-gray-300'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-2'
            title='Skills'
            description='Select the skills this course will help develop'
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
            title='Categories'
            description='Select the categories this course belongs to'
            content={
              <form.AppField
                name='categories'
                children={(field) => (
                  <field.MultipleCheckboxField
                    options={categories?.data.items.map((c) => ({
                      value: c.id.toString(),
                      label: c.categoryName
                    }))}
                    className='flex flex-wrap gap-x-8 gap-y-4'
                  />
                )}
              />
            }
          />

          <SCard
            className='gap-3'
            title='Standards'
            description='Select the education standards this course aligns with'
            content={
              <form.AppField
                name='standards'
                children={(field) => (
                  <field.MultipleCheckboxField
                    options={standards?.data.items.map((s) => ({
                      value: s.id.toString(),
                      label: s.standardName
                    }))}
                    className='flex flex-wrap gap-x-8 gap-y-4'
                  />
                )}
              />
            }
          />
        </div>

        <div className='space-y-6'>
          <SCard
            className='gap-2'
            title='Age Range'
            description='Select the age range this course is suitable for'
            content={
              <form.AppField
                name='ageRange'
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
          <form.AppField
            name='imageUrl'
            children={(field) => {
              imageFieldRef.current = field
              return <field.ImageField />
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
