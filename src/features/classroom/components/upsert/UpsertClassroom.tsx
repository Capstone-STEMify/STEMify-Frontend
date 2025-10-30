'use client'

import React, { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { useModal } from '@/providers/ModalProvider'
import {
  useCreateClassroomMutation,
  useGetClassroomByIdQuery,
  useUpdateClassroomMutation
} from '@/features/classroom/api/classroomApi'
import { useSearchSubscriptionQuery } from '@/features/subscription/api/subscriptionApi'
import { useSearchUserQuery } from '@/features/user/api/userApi'
import { getOptions } from '@/utils/index'
import { useSearchCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { Grade } from '@/features/classroom/types/classroom.type'

type ClassroomFormData = {
  name: string
  description?: string
  grade: string
  curriculumId: number
  organizationSubscriptionOrderId: number
  startDate: string // ISO date string
  endDate: string // ISO date string
  teacherId: string // UUID
}

const defaultClassroomFormData: ClassroomFormData = {
  name: '',
  description: '',
  grade: '',
  curriculumId: 1,
  organizationSubscriptionOrderId: 1,
  startDate: new Date().toISOString(), // default là hôm nay
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // +7 ngày
  teacherId: ''
}

type UpsertClassroomProps = {
  classroomId?: number
  onSuccess?: () => void
}

export default function UpsertClassroom({ classroomId, onSuccess }: UpsertClassroomProps) {
  const isEditing = !!classroomId
  const { closeModal } = useModal()

  // Schema validation
  const classroomSchema = z
    .object({
      name: z.string().min(1, 'Classroom name is required'),
      grade: z.string().min(1, 'Grade is required'),
      description: z.string().optional(),
      curriculumId: z.number().int('Curriculum ID must be an integer').positive('Curriculum ID must be positive'),
      organizationSubscriptionOrderId: z
        .number()
        .int('Subscription order ID must be an integer')
        .positive('Subscription order ID must be positive'),
      startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Start date must be a valid ISO date string'),
      endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'End date must be a valid ISO date string'),
      teacherId: z.string()
    })
    .refine((data) => new Date(data.startDate) > new Date(), {
      message: 'Start date must be after today',
      path: ['startDate']
    })
    .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: 'End date must be after start date',
      path: ['endDate']
    })

  const { data: classroomData } = useGetClassroomByIdQuery(classroomId!, { skip: !isEditing })
  const searchUserQuery = useAppSelector((state) => state.user)
  const searchCurriculumQuery = useAppSelector((state) => state.curriculum)
  const searchSubscriptionQuery = useAppSelector((state) => state.organizationSubscription)
  const { data: curriculumData } = useSearchCurriculumQuery(searchCurriculumQuery)
  const { data: organizationSubscriptionData } = useSearchSubscriptionQuery(searchSubscriptionQuery)
  const { data: teacherData } = useSearchUserQuery(searchUserQuery)

  // Options for selects
  const curriculumOptions = getOptions(curriculumData?.data.items, 'title', 'imageUrl', 'courseCount')
  const organizationSubscriptionOptions = getOptions(organizationSubscriptionData?.data.items, 'planName', '', 'status')
  const teacherOptions = getOptions(teacherData?.data.items, 'userName', 'imageUrl', 'email')
  const gradeOptions = Object.entries(Grade).map(([key, value]) => ({
    label: value,
    value: value
  }))

  const [createClassroom, { isLoading: isCreating }] = useCreateClassroomMutation()
  const [updateClassroom, { isLoading: isUpdating }] = useUpdateClassroomMutation()

  const form = useAppForm({
    defaultValues: defaultClassroomFormData,
    // validators: { onChange: classroomSchema as any },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        curriculumId: Number(value.curriculumId),
        organizationSubscriptionOrderId: Number(value.organizationSubscriptionOrderId)
      }

      if (isEditing) {
        await updateClassroom({ id: classroomId!, body: payload }).unwrap()
      } else {
        await createClassroom(payload).unwrap()
      }

      toast.success(`Classroom ${isEditing ? 'updated' : 'created'} successfully`)
      closeModal()
      onSuccess && onSuccess()
    }
  })

  useEffect(() => {
    if (isEditing && classroomData?.data) {
      const p = classroomData.data
      form.reset({
        name: p.name,
        description: p.description,
        grade: p.grade,
        curriculumId: p.curriculum.id,
        organizationSubscriptionOrderId: p.organizationSubscriptionOrderId,
        startDate: p.startDate,
        endDate: p.endDate,
        teacherId: p.teacher.id
      })
    }
  }, [classroomData, isEditing, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-8 overflow-y-auto px-6 pb-6'
    >
      {/* Row 1: Name + Grade */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <form.AppField
          name='name'
          children={(field) => <field.TextField label='Classroom Name' placeholder='Enter classroom name' />}
        />

        <form.AppField
          name='grade'
          children={(field) => <field.SelectField label='Grade' placeholder='Select grade' options={gradeOptions} />}
        />
      </div>

      {/* Description (full width) */}
      <form.AppField
        name='description'
        children={(field) => (
          <field.TextAreaField
            label='Description'
            placeholder='Enter classroom description'
            rows={3}
            className='resize-none'
          />
        )}
      />

      {/* Row 2: Start Date + End Date */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <form.AppField
          name='startDate'
          children={(field) => <field.DatePickerField label='Start Date' placeholder='Select start date' />}
        />
        <form.AppField
          name='endDate'
          children={(field) => <field.DatePickerField label='End Date' placeholder='Select end date' />}
        />
      </div>

      {/* Row 3: Curriculum + Subscription */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <form.AppField
          name='organizationSubscriptionOrderId'
          children={(field) => (
            <field.SingleSelectWithSearch
              value={form.getFieldValue('organizationSubscriptionOrderId')?.toString()}
              options={organizationSubscriptionOptions}
              label='Subscription'
              placeholder='Choose subscription'
              onChange={(val) => form.setFieldValue('organizationSubscriptionOrderId', Number(val))}
            />
          )}
        />
        <form.AppField
          name='teacherId'
          children={(field) => (
            <field.SingleSelectWithSearch
              value={form.getFieldValue('teacherId')}
              options={teacherOptions}
              label='Assign Teacher'
              placeholder='Choose teacher'
              onChange={(val) => form.setFieldValue('teacherId', val)}
            />
          )}
        />
      </div>

      <div className='grid grid-cols-1'>
        <form.AppField
          name='curriculumId'
          children={(field) => (
            <field.SingleSelectWithSearch
              value={form.getFieldValue('curriculumId')?.toString()}
              options={curriculumOptions}
              label='Assign Curriculum'
              placeholder='Choose curriculum'
              onChange={(val) => form.setFieldValue('curriculumId', Number(val))}
            />
          )}
        />
      </div>

      {/* Submit */}
      <div className='flex justify-end pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='bg-amber-custom-400 cursor-pointer'>
            {isEditing ? 'Update' : 'Create'} Classroom
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
