import { useAppForm } from '@/components/shared/form/items'
import { useGetClassroomByIdQuery, useUpdateTeacherClassroomMutation } from '@/features/classroom/api/classroomApi'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { useSearchUserV2Query } from '@/features/user/api/userApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { getOptions } from '@/utils/index'
import React, { useEffect } from 'react'
import z from 'zod'

type UpdateClassroomTeacherProps = {
  classroomId: number
  onSuccess?: () => void
}

const teacherDefaultValues = {
  teacherId: ''
}

export default function UpdateClassroomTeacher({ classroomId, onSuccess }: UpdateClassroomTeacherProps) {
  const selectedSubscriptionId = useAppSelector((state) => state.selectedOrganization.selectedSubscriptionOrderId)
  const { data: classroomData } = useGetClassroomByIdQuery(classroomId!, { skip: !classroomId })

  const searchUserQuery = useAppSelector((state) => state.user)
  const { data: teacherData } = useSearchUserV2Query({
    ...searchUserQuery,
    license_type: LicenseAssignmentType.TEACHER,
    subscription_order_id: selectedSubscriptionId
  })

  const [updateClassroomTeacher, { isLoading: isUpdating }] = useUpdateTeacherClassroomMutation()

  const teacherOptions = getOptions(teacherData?.data.items, 'userName', 'imageUrl', 'email')

  const teacherSchema = z.object({
    teacherId: z.string().min(1, 'Teacher is required')
  })

  const form = useAppForm({
    defaultValues: teacherDefaultValues,
    validators: { onChange: teacherSchema },
    onSubmit: async ({ value }) => {
      await updateClassroomTeacher({
        classroomId: classroomId,
        teacherId: value.teacherId
      })
      onSuccess?.()
    }
  })

  useEffect(() => {
    if (classroomData?.data) {
      const c = classroomData.data
      form.reset({
        teacherId: c.teacher.id
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
          name='teacherId'
          children={(field: any) => (
            <field.SingleSelectWithSearch
              value={form.getFieldValue('teacherId')}
              options={teacherOptions}
              label='Teacher'
              placeholder='Choose teacher'
              onChange={(val: any) => form.setFieldValue('teacherId', val)}
            />
          )}
        />

        <div className='flex justify-end'>
          <form.AppForm>
            <form.SubmitButton
              loading={isUpdating}
              className='bg-amber-custom-400 cursor-pointer rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
            >
              Update
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  )
}
