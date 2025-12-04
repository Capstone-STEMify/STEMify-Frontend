import { useAppForm } from '@/components/shared/form/items'
import { useGetClassroomByIdQuery, useUpdateClassroomCourseMutation } from '@/features/classroom/api/classroomApi'
import CourseDetailDescription from '@/features/resource/course/components/detail/enrolled/CourseDetailDescription'
import { useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { getOptions } from '@/utils/index'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import z from 'zod'

type UpdateClassroomCourseProps = {
  classroomId: number
  onSuccess?: () => void
}

const courseDefaultValues = {
  courseId: 1
}

export default function UpdateClassroomCourse({ classroomId, onSuccess }: UpdateClassroomCourseProps) {
  const tc = useTranslations('common')

  const selectedSubscriptionId = useAppSelector((state) => state.selectedOrganization.selectedSubscriptionOrderId)

  const { data: organizationSubscriptionData, isLoading } = useGetSubscriptionByIdQuery(selectedSubscriptionId!, {
    skip: !selectedSubscriptionId
  })
  const { data: classroomData } = useGetClassroomByIdQuery(classroomId!, { skip: !classroomId })

  const [updateClassroomCourse, { isLoading: isUpdating }] = useUpdateClassroomCourseMutation()

  const courseOptions = getOptions(organizationSubscriptionData?.data.curriculums, 'title', 'imageUrl', 'lessonCount')

  const courseSchema = z.object({
    courseId: z.number().min(1, 'Course is required')
  })

  const form = useAppForm({
    defaultValues: courseDefaultValues,
    validators: { onChange: courseSchema },
    onSubmit: async ({ value }) => {
      await updateClassroomCourse({
        classroomId: classroomId,
        courseId: value.courseId
      })
      onSuccess?.()
    }
  })

  useEffect(() => {
    if (classroomData?.data) {
      const c = classroomData.data
      form.reset({
        courseId: c.course.id
      })
    }
  }, [classroomData, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className='space-y-6'>
        <form.AppField
          name='courseId'
          children={(field: any) => (
            <field.SingleSelectWithSearch
              value={form.getFieldValue('courseId')?.toString()}
              options={courseOptions}
              placeholder='Choose course'
              onChange={(val: any) => form.setFieldValue('courseId', Number(val))}
            />
          )}
        />

        <div className='flex justify-end'>
          <form.AppForm>
            <form.SubmitButton
              loading={isUpdating}
              className='bg-amber-custom-400 cursor-pointer rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
            >
              {tc('button.update')}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
