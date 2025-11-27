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
import { useTranslations } from 'next-intl'

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
  const tv = useTranslations('validation.plan')
  const tp = useTranslations('plan')
  const tt = useTranslations('toast')

  const isEditing = !!planId
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()

  const { data: planData, isLoading: isPlanLoading } = useGetPlanByIdQuery(planId!, { skip: !isEditing })
  const { data: curriculumData } = useSearchCurriculumQuery({ pageNumber: 1, pageSize: 50 })
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation()
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation()

  // ✅ Schema validation
  const planSchema = z
    .object({
      name: z.string().min(1, tv('name')),
      description: z.string().min(10, tv('description', { min: 10 })),
      accessSupportDetail: z.string().min(10, tv('accessSupportDetail', { min: 10 })),
      curriculumCount: z.number().min(1, tv('curriculumCount', { min: 1 })),
      maxTeacherSeats: z.number().min(1, tv('maxTeacherSeats', { min: 1 })),
      maxStudentSeats: z.number().min(10, tv('maxStudentSeats', { min: 10 })),
      billingCycles: z.array(
        z.object({
          billingCycle: z.string(),
          price: z.number().min(0, tv('billingCycle'))
        })
      ),
      curriculumIds: z.array(z.number()).min(1, tv('curriculumIds', { min: 1 }))
    })
    .superRefine((data, ctx) => {
      if (data.curriculumCount > data.curriculumIds.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: tv('curriculumCountExceed', {
            curriculumCount: data.curriculumCount,
            selectedCurriculums: data.curriculumIds.length
          }),
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
      }

      toast.success(
        ` ${isEditing ? tt('successMessage.update', { title: payload.name }) : tt('successMessage.create', { title: payload.name })}`
      )
      closeModal()
      onSuccess?.()
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
        children={(field) => (
          <field.TextField label={tp('form.name.label')} placeholder={tp('form.name.placeholder')} />
        )}
      />

      <form.AppField
        name='description'
        children={(field) => (
          <field.TextAreaField
            label={tp('form.description.label')}
            placeholder={tp('form.description.placeholder')}
            rows={3}
            className='resize-none'
          />
        )}
      />

      <form.AppField
        name='accessSupportDetail'
        children={(field) => (
          <field.TextAreaField
            label={tp('form.accessSupportDetail.label')}
            placeholder={tp('form.accessSupportDetail.placeholder')}
            rows={3}
            className='resize-none'
          />
        )}
      />

      <form.AppField
        name='maxTeacherSeats'
        children={(field) => (
          <field.TextField
            type='number'
            label={tp('form.maxTeacherSeats.label')}
            placeholder={tp('form.maxTeacherSeats.placeholder')}
          />
        )}
      />
      <form.AppField
        name='maxStudentSeats'
        children={(field) => (
          <field.TextField
            type='number'
            label={tp('form.maxStudentSeats.label')}
            placeholder={tp('form.maxStudentSeats.placeholder')}
          />
        )}
      />

      {/* === Curriculum Checkbox Group === */}
      <form.AppField name='curriculumIds'>
        {(field) => (
          <field.DropdownMultipleCheckboxField
            label={tp('form.availableCurriculums.label')}
            description={tp('form.availableCurriculums.description')}
            options={
              curriculumData?.data?.items?.map((c) => ({
                label: `${c.title} (${c.code})`,
                value: String(c.id)
              })) ?? []
            }
          />
        )}
      </form.AppField>

      <form.AppField
        name={'curriculumCount'}
        children={(field) => (
          <div>
            <field.TextField
              type='number'
              label={tp('form.curriculumCount.label')}
              placeholder={tp('form.curriculumCount.placeholder')}
              className='flex-1'
            />
            <p className='mt-1 text-sm text-gray-600'>
              {tp('form.curriculumCount.required', { count: form.state.values.curriculumIds.length || 0 })}
            </p>
          </div>
        )}
      />

      {/* Billing Cycles */}
      <div className='rounded-lg border p-3'>
        <h3>{tp('form.billingCycles.label')}</h3>

        {form.state.values.billingCycles.map((cycle, index) => (
          <div key={index} className='mb-3 items-center gap-3'>
            <span className='w-32 text-sm font-medium text-gray-600'>
              {cycle.billingCycle === 'Semiannual'
                ? tp('form.billingCycles.semiannualPrice')
                : tp('form.billingCycles.annualPrice')}
            </span>

            <form.AppField
              name={`billingCycles[${index}].price`}
              children={(field) => (
                <field.TextField
                  type='number'
                  label=''
                  placeholder={tp('form.billingCycles.pricePlaceholder')}
                  className='flex-1'
                />
              )}
            />
          </div>
        ))}
      </div>

      <div className='flex justify-end'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='cursor-pointer bg-blue-500'>
            {isEditing ? tp('update') : tp('create')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
