'use client'
import { SCard } from '@/components/shared/card/SCard'
import React from 'react'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import { Upload } from 'lucide-react'
import { useCreateLessonMutation } from '@/features/resource/lesson/api/lessonApi'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { Button } from '@/components/shadcn/button'

const lessonSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long'),
  description: z.string().min(50, 'Description must be at least 50 characters long'),
  ageRange: z.string().min(1, 'Age range is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  standards: z.array(z.string()).min(1, 'At least one standard is required'),
  imageUrl: z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, 'Max 5MB allowed')
})

type LessonFormData = z.infer<typeof lessonSchema>

const defaultLessonData: LessonFormData = {
  title: '',
  description: '',
  ageRange: '',
  skills: [],
  categories: [],
  standards: [],
  imageUrl: new File([], '', { type: 'image/png' })
}

export default function CreateLesson() {
  const { data: ageRanges } = useGetAllAgeRangeQuery()
  const { data: skills } = useGetAllSkillQuery()
  const { data: categories } = useGetAllCategoryQuery()
  const { data: standards } = useGetAllStandardQuery()
  const [createLesson, { data: lessonCreateItem, error }] = useCreateLessonMutation()

  const form = useAppForm({
    defaultValues: defaultLessonData,
    validators: {
      onChange: lessonSchema
    },
    onSubmit: ({ value }) => {
      console.log('Form submitted:', value)
    }
  })

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
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <SCard
            className='gap-3'
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

          <SCard
            className='gap-2'
            title='Age Range'
            description='Select the age range this lesson is suitable for'
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

          <SCard
            className='gap-2'
            title='Skills'
            description='Select the skills this lesson will help develop'
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
            description='Select the categories this lesson belongs to'
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
            description='Select the education standards this lesson aligns with'
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
          <form.AppField name='imageUrl' children={(field) => <field.ImageField />} />

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button className='flex-1 rounded-full py-5'>Edit Image</Button>
          </div>
        </div>
      </div>
      <form.AppForm>
        <form.SubmitButton className='rounded-full'>Submit</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
