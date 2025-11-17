'use client'

import React, { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { useCreatePlanMutation, useGetPlanByIdQuery, useUpdatePlanMutation } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import { BillingCycle, PlanStatus } from '@/features/plan/types/plan.type'
import { useSearchCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setParam } from '@/features/plan/slice/planProductSlice'

type PlanFormData = {
  name: string
  description: string
  accessSupportDetail: string
  curriculumCount: number
  maxTeacherSeats: number
  maxStudentSeats: number
  billingCycles: {
    billingCycle: 'Semiannual' | 'Annual'
    price: number
  }[]
  curriculumIds: number[]
}

const defaultPlanFormData: PlanFormData = {
  name: '',
  description: '',
  accessSupportDetail: '',
  curriculumCount: 1,
  maxTeacherSeats: 10,
  maxStudentSeats: 100,
  billingCycles: [
    { billingCycle: BillingCycle.SEMIANNUAL, price: 0 },
    { billingCycle: BillingCycle.ANNUAL, price: 0 }
  ],
  curriculumIds: []
}

type UpsertPlanProps = {
  planId?: number
  onSuccess?: () => void
}

export default function UpsertPlan({ planId, onSuccess }: UpsertPlanProps) {
  const isEditing = !!planId
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()

  const { data: planData } = useGetPlanByIdQuery(planId!, { skip: !isEditing })
  const { data: curriculumData } = useSearchCurriculumQuery({ pageNumber: 1, pageSize: 50 })
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation()
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation()

  // ✅ Schema validation
  const planSchema = z
    .object({
      name: z.string().min(1, 'Plan name is required'),
      description: z.string().min(10, 'Description must be at least 10 characters'),
      accessSupportDetail: z.string().min(10, 'Access support detail must be at least 10 characters'),
      curriculumCount: z.number().min(1, 'Must be at least 1'),
      maxTeacherSeats: z.number().min(1, 'Must be at least 1'),
      maxStudentSeats: z.number().min(10, 'Must be at least 10'),
      billingCycles: z.array(
        z.object({
          billingCycle: z.string(),
          price: z.number().min(0, 'Price must be positive')
        })
      ),
      curriculumIds: z.array(z.number()).min(1, 'Select at least one curriculum')
    })
    .superRefine((data, ctx) => {
      // Validate: curriculumCount phải <= số curriculum available được chọn
      if (data.curriculumCount > data.curriculumIds.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Curriculum count (${data.curriculumCount}) cannot exceed the number of available curriculums selected (${data.curriculumIds.length})`,
          path: ['curriculumCount']
        })
      }
    })

  const form = useAppForm({
    defaultValues: defaultPlanFormData,
    validators: { onChange: planSchema as any },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        curriculumIds: value.curriculumIds.map((id) => Number(id))
      }

      if (isEditing) {
        await updatePlan({ id: planId!, body: payload }).unwrap()
      } else {
        await createPlan(payload).unwrap()
        dispatch(setParam({ key: 'status', value: PlanStatus.DRAFT }))
      }

      toast.success(`Plan ${isEditing ? 'updated' : 'created'} successfully`)
      closeModal()
      onSuccess && onSuccess()
    }
  })

  useEffect(() => {
    if (isEditing && planData?.data) {
      const p = planData.data
      form.reset({
        name: p.name,
        description: p.description,
        accessSupportDetail: p.accessSupportDetail,
        curriculumCount: p.curriculumCount,
        maxTeacherSeats: p.maxTeacherSeats,
        maxStudentSeats: p.maxStudentSeats,
        billingCycles:
          p.planBillingCycles?.length > 0
            ? p.planBillingCycles?.map((bc: any) => ({
                billingCycle: bc.billingCycle,
                price: bc.price
              }))
            : defaultPlanFormData.billingCycles,
        curriculumIds: p.curriculums.map((c: any) => c.id)
      })
    }
  }, [planData, isEditing, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-6 overflow-y-scroll px-4 pb-4'
    >
      <form.AppField
        name='name'
        children={(field) => <field.TextField label='Plan Name' placeholder='Enter plan name' />}
      />

      <form.AppField
        name='description'
        children={(field) => (
          <field.TextAreaField
            label='Description'
            placeholder='Enter plan description'
            rows={3}
            className='resize-none'
          />
        )}
      />

      <form.AppField
        name='accessSupportDetail'
        children={(field) => (
          <field.TextAreaField
            label='Access Support Detail'
            placeholder='Explain support and access details'
            rows={3}
            className='resize-none'
          />
        )}
      />

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name='maxTeacherSeats'
          children={(field) => <field.TextField type='number' label='Max Teacher Seats' placeholder='e.g. 100' />}
        />
        <form.AppField
          name='maxStudentSeats'
          children={(field) => <field.TextField type='number' label='Max Student Seats' placeholder='e.g. 100' />}
        />
      </div>

      <form.AppField
        name={'curriculumCount'}
        children={(field) => (
          <div>
            <field.TextField
              type='number'
              label='Curriculum Count'
              placeholder='Number of curriculums user can select when purchasing'
              className='flex-1'
            />
            <p className='mt-1 text-sm text-gray-600'>
              Must be ≤ {form.state.values.curriculumIds.length || 0} (available curriculums selected)
            </p>
          </div>
        )}
      />

      {/* Billing Cycles */}
      <div className='rounded-lg border p-3'>
        <h3>Billing Cycles</h3>

        {form.state.values.billingCycles.map((cycle, index) => (
          <div key={index} className='mb-3 items-center gap-3'>
            <span className='w-32 text-sm font-medium text-gray-600'>
              {cycle.billingCycle === 'Semiannual' ? 'Price for Semiannual (6 months)' : 'Price for Annual (12 months)'}
            </span>

            <form.AppField
              name={`billingCycles[${index}].price`}
              children={(field) => (
                <field.TextField type='number' label='' placeholder='Enter price' className='flex-1' />
              )}
            />
          </div>
        ))}
      </div>

      {/* === Curriculum Checkbox Group === */}
      <form.AppField name='curriculumIds'>
        {(field) => (
          <field.DropdownMultipleCheckboxField
            label='Available Curriculums'
            description='Select curriculums that will be available in this plan'
            options={
              curriculumData?.data?.items?.map((c) => ({
                label: `${c.title} (${c.code})`,
                value: String(c.id)
              })) ?? []
            }
          />
        )}
      </form.AppField>

      <div className='flex justify-end'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='cursor-pointer bg-blue-500'>
            {isEditing ? 'Update' : 'Create'} Plan
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
