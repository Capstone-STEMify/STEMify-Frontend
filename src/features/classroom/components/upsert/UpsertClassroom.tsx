'use client'

import React, { useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Grade } from '@/features/classroom/types/classroom.type'
import { setMultipleParams, setParam } from '@/features/subscription/slice/subscriptionSlice'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { DataTable } from '@/components/shared/data-table/data-table'
import { UserRole } from '@/types/userRole'
import { useGetUserAction } from '@/features/user/components/table/UserAction'
import BackButton from '@/components/shared/button/BackButton'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

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

const STEPS = [
  { id: 1, title: 'Classroom Information', description: 'Basic classroom details' },
  { id: 2, title: 'Assignments', description: 'Assign curriculum, teacher & students' }
]

export default function UpsertClassroom({ classroomId, onSuccess }: UpsertClassroomProps) {
  const isEditing = !!classroomId
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const locale = useLocale()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([])
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | undefined>(undefined)
  const [minDate, setMinDate] = useState<Date | undefined>(undefined)
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined)

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
  const { data: curriculumData } = useSearchCurriculumQuery({
    ...searchCurriculumQuery,
    subscriptionOrderId: selectedSubscriptionId
  })
  const { data: organizationSubscriptionData } = useSearchSubscriptionQuery(searchSubscriptionQuery)
  const { data: teacherData } = useSearchUserQuery({
    ...searchUserQuery,
    role: UserRole.TEACHER,
    subscriptionOrderId: selectedSubscriptionId
  })
  const { data: studentData } = useSearchUserQuery({
    ...searchUserQuery,
    role: UserRole.STUDENT,
    subscriptionOrderId: selectedSubscriptionId
  })

  // Students table
  const columns = useGetUserAction()
  const rows = React.useMemo(
    () =>
      (studentData?.data.items ?? []).map((item, idx) => ({
        id: item.userId,
        ...item
      })),
    [studentData]
  )

  // Options for selects
  const curriculumOptions = getOptions(curriculumData?.data.items, 'title', 'imageUrl', 'courseCount')
  const organizationSubscriptionOptions = getOptions(
    organizationSubscriptionData?.data.items,
    'planName',
    'imageUrl',
    undefined,
    'status',
    'startDate',
    'endDate'
  )
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
      router.push(`/${locale}/organization/classroom`)
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

  useEffect(() => {
    dispatch(
      setMultipleParams({
        status: SubscriptionStatus.PENDING,
        // TODO: replace with actual organization ID
        // organizationId: getCurrentUserOrganizationId(),
        organizationId: undefined,
        pageSize: 20,
        pageNumber: 1
      })
    )
  }, [dispatch])

  return (
    <div className='flex h-full flex-col'>
      {/* Step Indicator */}
      <div className='border-b bg-gradient-to-b from-gray-50 to-white px-6 py-5'>
        <div className='mx-auto max-w-3xl'>
          <div className='mb-10 flex items-center justify-between'>
            <BackButton />

            <div className='absolute left-1/2 -translate-x-1/2 text-center'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {isEditing ? 'Edit Classroom' : 'Create New Classroom'}
              </h2>
              <p className='mt-1 text-sm text-gray-500'>Follow the steps below to set up your classroom</p>
            </div>

            <div className='w-[100px]'>{/* Spacer for balance */}</div>
          </div>

          {/* Line Container */}
          <div className='relative flex items-center justify-between'>
            {/* Background Line */}
            <div className='absolute top-5 left-0 h-1 w-full rounded-full bg-gray-200' />

            {/* Progress Line */}
            <div
              className='absolute top-5 left-0 h-1 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500 ease-out'
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`
              }}
            />

            {/* Steps */}
            {STEPS.map((step) => (
              <div key={step.id} className='relative z-10 flex flex-col items-center'>
                {/* Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 bg-white transition-all duration-300 ${
                    currentStep === step.id
                      ? 'scale-110 border-sky-500 shadow-lg shadow-sky-200'
                      : currentStep > step.id
                        ? 'border-sky-500'
                        : 'border-gray-300'
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className='h-5 w-5 text-sky-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <span className={`text-sm font-bold ${currentStep === step.id ? 'text-sky-500' : 'text-gray-400'}`}>
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Step Info */}
                <div className='mt-3 text-center' style={{ minWidth: '120px' }}>
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      currentStep === step.id
                        ? 'text-sky-600'
                        : currentStep > step.id
                          ? 'text-blue-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className='mt-0.5 text-xs leading-tight text-gray-400'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (currentStep === 1) {
            // Validate step 1 before proceeding
            setCurrentStep(2)
          } else {
            form.handleSubmit()
          }
        }}
        className='flex-1 overflow-y-auto px-6 py-6'
      >
        {/* Step 1: Classroom Information */}
        {currentStep === 1 && (
          <div className='animate-fadeIn mx-auto max-w-4xl space-y-6'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Basic Information</h3>

              <div className='space-y-6'>
                {/* Row 1: Name + Grade */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <form.AppField
                    name='name'
                    children={(field) => (
                      <field.TextField label='Classroom Name' placeholder='e.g., Math Class 2024' required />
                    )}
                  />

                  <form.AppField
                    name='grade'
                    children={(field) => (
                      <field.SelectField label='Grade Level' placeholder='Select grade' options={gradeOptions} />
                    )}
                  />
                </div>

                {/* Description */}
                <form.AppField
                  name='description'
                  children={(field) => (
                    <field.TextAreaField
                      label='Description'
                      placeholder='Brief description of this classroom...'
                      rows={4}
                      className='resize-none'
                    />
                  )}
                />
                {/* Subscription */}
                <form.AppField
                  name='organizationSubscriptionOrderId'
                  children={(field) => (
                    <field.SingleSelectWithSearch
                      value={form.getFieldValue('organizationSubscriptionOrderId')?.toString()}
                      options={organizationSubscriptionOptions}
                      label='Subscription Plan'
                      placeholder='Choose subscription plan'
                      onChange={(val) => {
                        form.setFieldValue('organizationSubscriptionOrderId', Number(val))
                        setSelectedSubscriptionId(Number(val))
                        const selected = organizationSubscriptionData?.data.items.find((s) => s.id === Number(val))

                        setMinDate(selected ? new Date(selected.startDate) : undefined)
                        setMaxDate(selected ? new Date(selected.endDate) : undefined)
                      }}
                    />
                  )}
                />
                {/* Row 2: Dates */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <form.AppField
                    name='startDate'
                    children={(field) => {
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
                    children={(field) => (
                      <field.DatePickerField
                        label='End Date'
                        placeholder='Select end date'
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Assignments */}
        {currentStep === 2 && (
          <div className='animate-fadeIn mx-auto max-w-6xl space-y-6'>
            {/* Curriculum & Teacher Section */}
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>Curriculum & Teacher</h3>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <form.AppField
                  name='curriculumId'
                  children={(field) => (
                    <field.SingleSelectWithSearch
                      value={form.getFieldValue('curriculumId')?.toString()}
                      options={curriculumOptions}
                      label='Curriculum'
                      placeholder='Choose curriculum'
                      onChange={(val) => form.setFieldValue('curriculumId', Number(val))}
                    />
                  )}
                />

                <form.AppField
                  name='teacherId'
                  children={(field) => (
                    <field.SingleSelectWithSearch
                      value={form.getFieldValue('teacherId')}
                      options={teacherOptions}
                      label='Teacher'
                      placeholder='Choose teacher'
                      onChange={(val) => form.setFieldValue('teacherId', val)}
                    />
                  )}
                />
              </div>
            </div>

            {/* Students Section */}
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Students</h3>
                  <p className='mt-1 text-sm text-gray-500'>Select students for this classroom</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <span className='font-medium'>{selectedStudentIds.length}</span> selected
                </div>
              </div>

              {/* Student Table */}
              <div className='overflow-hidden rounded-lg border'>
                <DataTable
                  data={rows as any}
                  columns={columns as any}
                  enableRowSelection
                  pagingData={studentData}
                  pagingParams={searchUserQuery}
                  // handlePageChange={handlePageChange}
                  rowSelection={selectedStudentIds}
                  onSelectionChange={(ids) => {
                    setSelectedStudentIds(ids.map(String))
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='mx-auto mt-6 flex max-w-6xl items-center justify-between border-t pt-6'>
          <button
            type='button'
            onClick={() => setCurrentStep(1)}
            className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
              currentStep === 1 ? 'invisible' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            } `}
            disabled={currentStep === 1}
          >
            ← Back
          </button>

          <div className='flex gap-3'>
            {currentStep < STEPS.length ? (
              <button
                type='submit'
                className='bg-amber-custom-400 rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
              >
                Continue →
              </button>
            ) : (
              <form.AppForm>
                <form.SubmitButton
                  loading={isCreating || isUpdating}
                  className='bg-amber-custom-400 cursor-pointer rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
                >
                  {isEditing ? 'Update' : 'Create'} Classroom
                </form.SubmitButton>
              </form.AppForm>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
