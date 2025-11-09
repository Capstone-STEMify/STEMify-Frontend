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
import { useSearchUserQuery, useSearchUserV2Query } from '@/features/user/api/userApi'
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
import { setPageIndex } from '@/features/user/slice/userSlice'
import ClassroomStepIndicator from './ClassroomStepIndicator'
import ClassroomBasicInfo from './ClassroomBasicInfo'
import ClassroomAssignSection from './ClassroomAssignSection'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'

type ClassroomFormData = {
  name: string
  description?: string
  grade: string
  curriculumId: number
  organizationSubscriptionOrderId: number
  startDate: string // ISO date string
  endDate: string // ISO date string
  teacherId: string // UUID
  studentIds?: string[] // Array of UUIDs
}

const defaultClassroomFormData: ClassroomFormData = {
  name: '',
  description: '',
  grade: '',
  curriculumId: 1,
  organizationSubscriptionOrderId: 1,
  startDate: new Date().toISOString(), // default là hôm nay
  endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // +7 ngày
  teacherId: '',
  studentIds: []
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

  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const { data: classroomData } = useGetClassroomByIdQuery(classroomId!, { skip: !isEditing })
  const searchUserQuery = useAppSelector((state) => state.user)
  const searchCurriculumQuery = useAppSelector((state) => state.curriculum)
  const searchSubscriptionQuery = useAppSelector((state) => state.organizationSubscription)
  const { data: curriculumData } = useSearchCurriculumQuery({
    ...searchCurriculumQuery,
    subscriptionOrderId: selectedSubscriptionId
  })
  const { data: organizationSubscriptionData, isLoading } = useSearchSubscriptionQuery(
    { ...searchSubscriptionQuery, organizationId, status: SubscriptionStatus.ACTIVE },
    { skip: !organizationId }
  )
  const { data: teacherData } = useSearchUserV2Query({
    ...searchUserQuery,
    license_type: LicenseAssignmentType.TEACHER,
    subscription_order_id: selectedSubscriptionId
  })
  const { data: studentData } = useSearchUserV2Query({
    ...searchUserQuery,
    license_type: LicenseAssignmentType.STUDENT,
    subscription_order_id: selectedSubscriptionId
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
  console.log('organizationSubscriptionData:', organizationSubscriptionData?.data.items)
  const organizationSubscriptionOptions = getOptions(
    organizationSubscriptionData?.data.items,
    'planName',
    'imageUrl',
    undefined,
    'status',
    'startDate',
    'endDate'
  )
  console.log('Organization Subscription Options:', organizationSubscriptionOptions)
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
        organizationSubscriptionOrderId: Number(value.organizationSubscriptionOrderId),
        studentIds: selectedStudentIds
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

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Step Indicator */}
      <ClassroomStepIndicator currentStep={currentStep} isEditing={isEditing} />

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
          <ClassroomBasicInfo
            form={form}
            organizationSubscriptionOptions={organizationSubscriptionOptions}
            organizationSubscriptionData={organizationSubscriptionData}
            gradeOptions={gradeOptions}
            minDate={minDate}
            maxDate={maxDate}
            setSelectedSubscriptionId={setSelectedSubscriptionId}
            setMinDate={setMinDate}
            setMaxDate={setMaxDate}
          />
        )}

        {/* Step 2: Assignments */}
        {currentStep === 2 && (
          <ClassroomAssignSection
            form={form}
            curriculumOptions={curriculumOptions}
            teacherOptions={teacherOptions}
            columns={columns}
            rows={rows}
            selectedStudentIds={selectedStudentIds}
            studentData={studentData}
            searchUserQuery={searchUserQuery}
            handlePageChange={handlePageChange}
            setSelectedStudentIds={setSelectedStudentIds}
          />
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
