import { useAppForm } from '@/components/shared/form/items'
import {
  useGetClassroomByIdQuery,
  useUpdateClassroomCurriculumMutation,
  useUpdateClassroomMutation
} from '@/features/classroom/api/classroomApi'
import { Grade } from '@/features/classroom/types/classroom.type'
import { useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { getOptions } from '@/utils/index'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import z from 'zod'

type UpdateClassroomCurriculumProps = {
  classroomId: number
  onSuccess?: () => void
}

const curriculumDefaultValues = {
  curriculumId: 1
}

export default function UpdateClassroomCurriculum({ classroomId, onSuccess }: UpdateClassroomCurriculumProps) {
  const tc = useTranslations('common')

  const selectedSubscriptionId = useAppSelector((state) => state.selectedOrganization.selectedSubscriptionOrderId)

  const { data: organizationSubscriptionData, isLoading } = useGetSubscriptionByIdQuery(selectedSubscriptionId!, {
    skip: !selectedSubscriptionId
  })
  const { data: classroomData } = useGetClassroomByIdQuery(classroomId!, { skip: !classroomId })

  const [updateClassroomCurriculum, { isLoading: isUpdating }] = useUpdateClassroomCurriculumMutation()

  const curriculumOptions = getOptions(
    organizationSubscriptionData?.data.curriculums,
    'title',
    'imageUrl',
    'courseCount'
  )

  const curriculumSchema = z.object({
    curriculumId: z.number().min(1, 'Curriculum is required')
  })

  const form = useAppForm({
    defaultValues: curriculumDefaultValues,
    validators: { onChange: curriculumSchema },
    onSubmit: async ({ value }) => {
      await updateClassroomCurriculum({
        classroomId: classroomId,
        curriculumId: value.curriculumId
      })
      onSuccess?.()
    }
  })

  useEffect(() => {
    if (classroomData?.data) {
      const c = classroomData.data
      form.reset({
        curriculumId: c.curriculum.id
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
          name='curriculumId'
          children={(field: any) => (
            <field.SingleSelectWithSearch
              value={form.getFieldValue('curriculumId')?.toString()}
              options={curriculumOptions}
              placeholder='Choose curriculum'
              onChange={(val: any) => form.setFieldValue('curriculumId', Number(val))}
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
