import { useAppForm } from '@/components/shared/form/items'
import { useGetClassroomByIdQuery, useUpdateClassroomMutation } from '@/features/classroom/api/classroomApi'
import { Grade } from '@/features/classroom/types/classroom.type'
import React, { useEffect, useState } from 'react'
import z from 'zod'

type UpdateClassroomOrganizationBasicInfoProps = {
  classroomId: number
  onSuccess?: () => void
}

const classroomDefaultValues = {
  name: '',
  grade: '',
  classCode: '',
  description: '',
  startDate: '',
  endDate: ''
}

export default function UpdateClassroomOrganizationBasicInfo({
  classroomId,
  onSuccess
}: UpdateClassroomOrganizationBasicInfoProps) {
  const [minDate, setMinDate] = useState<Date | undefined>(undefined)
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined)
  const { data: classroomData } = useGetClassroomByIdQuery(classroomId!, { skip: !classroomId })

  const [updateClassroom, { isLoading: isUpdating }] = useUpdateClassroomMutation()

  const gradeOptions = Object.entries(Grade).map(([key, value]) => ({
    label: value,
    value: value
  }))

  const basicSchema = z.object({
    name: z.string().min(1, 'Classroom name is required'),
    grade: z.string().min(1, 'Grade is required'),
    classCode: z.string().min(1, 'Class code is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Start date must be a valid ISO date string'),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'End date must be a valid ISO date string')
  })

  const form = useAppForm({
    defaultValues: classroomDefaultValues,
    validators: { onChange: basicSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        classCode: value.classCode,
        grade: value.grade,
        description: value.description,
        startDate: new Date(value.startDate).toISOString(),
        endDate: new Date(value.endDate).toISOString()
      }

      await updateClassroom({
        id: classroomId,
        body: payload
      })
      onSuccess?.()
    }
  })

  useEffect(() => {
    if (classroomData?.data) {
      const p = classroomData.data
      form.reset({
        name: p.name,
        description: p.description,
        classCode: p.classCode,
        grade: p.grade,
        startDate: p.startDate,
        endDate: p.endDate
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
          name='name'
          children={(field: any) => (
            <field.TextField label='Classroom Name' placeholder='e.g., Math Class 2024' required />
          )}
        />
        <form.AppField
          name='description'
          children={(field: any) => (
            <field.TextAreaField
              label='Description'
              placeholder='Brief description of this classroom...'
              rows={4}
              className='resize-none'
            />
          )}
        />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <form.AppField
            name='grade'
            children={(field: any) => (
              <field.SelectField label='Grade Level' placeholder='Select grade' options={gradeOptions} />
            )}
          />
          <form.AppField
            name='classCode'
            children={(field: any) => <field.TextField label='Class Code' placeholder='e.g., STEM-1A-2025' required />}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <form.AppField
            name='startDate'
            children={(field: any) => {
              const today = new Date()
              const effectiveMinStartDate = minDate && minDate > today ? minDate : today

              return (
                <field.DatePickerField
                  label='Start Date'
                  placeholder='Select start date'
                  minDate={effectiveMinStartDate}
                  maxDate={maxDate}
                />
              )
            }}
          />
          <form.AppField
            name='endDate'
            children={(field: any) => (
              <field.DatePickerField
                label='End Date'
                placeholder='Select end date'
                minDate={minDate}
                maxDate={maxDate}
              />
            )}
          />
        </div>

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
