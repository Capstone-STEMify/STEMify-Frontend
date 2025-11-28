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
import { useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useSearchUserV2Query } from '@/features/user/api/userApi'
import { getOptions } from '@/utils/index'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Grade } from '@/features/classroom/types/classroom.type'
import { useGetUserAction } from '@/features/user/components/table/UserAction'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { setPageIndex } from '@/features/user/slice/userSlice'
import ClassroomStepIndicator from './ClassroomStepIndicator'
import ClassroomBasicInfo from './ClassroomBasicInfo'
import ClassroomAssignSection from './ClassroomAssignSection'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'

type ClassroomFormData = {
  name: string
  description?: string
  classCode: string
  grade: string
  curriculumId: number
  organizationSubscriptionOrderId: number
  durationWeeks: string // '4' | '6' | '8' | '10' | 'custom'
  startDate: string // ISO date string
  endDate: string // ISO date string
  teacherId: string // UUID
  studentIds?: string[] // Array of UUIDs
}

const defaultClassroomFormData: ClassroomFormData = {
  name: '',
  description: '',
  classCode: '',
  grade: '',
  curriculumId: 1,
  organizationSubscriptionOrderId: 1,
  durationWeeks: '8',
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
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const isEditing = !!classroomId
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const locale = useLocale()
  const [currentStep, setCurrentStep] = useState(1)

  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([])
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

  const selectedSubscriptionId = useAppSelector((state) => state.selectedOrganization.selectedSubscriptionOrderId)
  const searchUserQuery = useAppSelector((state) => state.user)

  const { data: organizationSubscriptionData, isLoading } = useGetSubscriptionByIdQuery(selectedSubscriptionId!, {
    skip: !selectedSubscriptionId
  })
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
  const curriculumOptions = getOptions(
    organizationSubscriptionData?.data.curriculums,
    'title',
    'imageUrl',
    'courseCount'
  )

  const teacherOptions = getOptions(teacherData?.data.items, 'userName', 'imageUrl', 'email')

  const [createClassroom, { isLoading: isCreating }] = useCreateClassroomMutation()
  const [updateClassroom, { isLoading: isUpdating }] = useUpdateClassroomMutation()

  const form = useAppForm({
    defaultValues: defaultClassroomFormData,
    // validators: { onChange: classroomSchema as any },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        curriculumId: Number(value.curriculumId),
        organizationSubscriptionOrderId: selectedSubscriptionId!,
        studentIds: selectedStudentIds
      }
      if (isEditing) {
        const result = await updateClassroom({ id: classroomId!, body: payload }).unwrap()
        toast.success(tt('successMessage.update', { title: result.data.name }))
      } else {
        const result = await createClassroom(payload).unwrap()
        toast.success(tt('successMessage.create', { title: result.data.name }))
      }

      router.push(`/${locale}/organization/classroom`)
      closeModal()
      onSuccess?.()
    }
  })

  useEffect(() => {
    if (isEditing && classroomData?.data) {
      const p = classroomData.data

      let durationWeeks = 'custom'
      if (p.startDate && p.endDate) {
        const start = new Date(p.startDate)
        const end = new Date(p.endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

        if ([4, 6, 8, 10].includes(diffWeeks)) {
          durationWeeks = diffWeeks.toString()
        }
      }

      form.reset({
        name: p.name,
        classCode: p.classCode,
        description: p.description,
        grade: p.grade,
        curriculumId: p.curriculum.id,
        organizationSubscriptionOrderId: p.organizationSubscriptionOrderId,
        durationWeeks: durationWeeks,
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
    <div>
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
            organizationSubscriptionData={organizationSubscriptionData}
            minDate={minDate}
            maxDate={maxDate}
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
        <div className='mx-auto mt-6 flex max-w-6xl items-center justify-between pt-6'>
          <button
            type='button'
            onClick={() => setCurrentStep(1)}
            className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
              currentStep === 1 ? 'invisible' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            } `}
            disabled={currentStep === 1}
          >
            ← {tc('button.back')}
          </button>

          <div className='flex gap-3'>
            {currentStep < STEPS.length ? (
              <button
                type='submit'
                className='bg-amber-custom-400 rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
              >
                {tc('button.next')} →
              </button>
            ) : (
              <form.AppForm>
                <form.SubmitButton
                  loading={isCreating || isUpdating}
                  className='bg-amber-custom-400 cursor-pointer rounded-lg px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
                >
                  {isEditing ? tc('button.update') : tc('button.create')} Classroom
                </form.SubmitButton>
              </form.AppForm>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
