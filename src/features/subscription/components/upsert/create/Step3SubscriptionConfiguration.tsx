'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { SubscriptionFormData } from '@/features/subscription/types/subscription.type'
import { useEffect } from 'react'
import { useCreateSubscriptionMutation, useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useGetAllCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { or } from 'ajv/dist/compile/codegen'
import { useGetAllPlanQuery } from '@/features/plan/api/planApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { goBack, goNext, setOrganizationSubscriptionId } from '@/features/subscription/slice/organizationSubscriptionFormSlice'

const subscriptionDefaultValues: SubscriptionFormData = {
  planBillingCycleId: 1,
  startDate: null,
  discountPercent: 0,
  maxStudentSeats: 10,
  maxTeacherSeats: 2,
  curriculumIds: []
}

export default function Step3SubscriptionConfiguration() {
  const dispatch = useAppDispatch()
  const { currentStep, organizationSubscriptionId } = useAppSelector((state) => state.organizationSubscriptionForm)
  const { data: planData } = useGetAllPlanQuery()
  const { data: curriculumData } = useGetAllCurriculumQuery()
  const { data: subscriptionData } = useGetSubscriptionByIdQuery(organizationSubscriptionId!, {
    skip: !organizationSubscriptionId
  })
  const [createSubscription] = useCreateSubscriptionMutation()

  const subscription = subscriptionData?.data
  const subscriptionSchema = z.object({
    planBillingCycleId: z.number().min(1, 'Select a plan and billing cycle'),
    startDate: z.date().nullable(),
    discountPercent: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
    maxStudentSeats: z.number().min(1, 'At least 1 student seat required'),
    maxTeacherSeats: z.number().min(1, 'At least 1 teacher seat required'),
    curriculumIds: z.array(z.number())
  })

  const plans = planData?.data.items ?? []

  const billingCycleOptions =
    plans.flatMap((plan) =>
      plan.planBillingCycles.map((cycle) => ({
        label: `${plan.name} - ${cycle.billingCycle} (${cycle.price}$)`,
        value: String(cycle.id)
      }))
    ) ?? []

  const curriculumOptions =
    curriculumData?.data.items.map((curriculum) => ({
      label: curriculum.title,
      value: String(curriculum.id)
    })) || []

  const form = useAppForm({
    defaultValues: subscriptionDefaultValues,
    validators: { onChange: subscriptionSchema as any },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        contractId: 1,
        organizationId: 1,
        planBillingCycleId: Number(value.planBillingCycleId),
        startDate: value.startDate ? value.startDate.toISOString().split('T')[0] : undefined
      }

      const res = await createSubscription(payload).unwrap()
      if (res) {
        dispatch(setOrganizationSubscriptionId(res.data.id))
        dispatch(goNext())
      }
    }
  })

  useEffect(() => {
    if (subscription && organizationSubscriptionId) {
      form.reset({
        planBillingCycleId: subscription.planBillingCycleId,
        startDate: subscription.startDate ? new Date(subscription.startDate) : null,
        discountPercent: subscription.discountPercent,
        maxStudentSeats: subscription.maxStudentSeats,
        maxTeacherSeats: subscription.maxTeacherSeats,
        curriculumIds: subscription.curriculums.filter((c) => c.id).map((c) => c.id as number)
      })
    }
  }, [subscription, organizationSubscriptionId])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-6'
    >
      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='planBillingCycleId'>
          {(field) => (
            <field.SelectField
              label='Plan & Billing Cycle'
              placeholder='Select plan and billing cycle'
              options={billingCycleOptions}
            />
          )}
        </form.AppField>

        <form.AppField name='startDate'>{(field) => <field.DatePickerField label='Start Date' />}</form.AppField>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='maxStudentSeats'>
          {(field) => <field.TextField type='number' label='Max Student Seats' />}
        </form.AppField>
        <form.AppField name='maxTeacherSeats'>
          {(field) => <field.TextField type='number' label='Max Teacher Seats' />}
        </form.AppField>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='curriculumIds'>
          {(field) => <field.DropdownMultipleCheckboxField label='Curriculums' options={curriculumOptions} />}
        </form.AppField>
        <form.AppField name='discountPercent'>
          {(field) => <field.TextField type='number' label='Discount (%)' />}
        </form.AppField>
      </div>
      <div className='mt-5 flex items-center justify-between'>
        <Button variant='outline' onClick={() => dispatch(goBack())} disabled={currentStep === 1}>
          Back
        </Button>

        <div className='text-sm text-slate-600'>Step {currentStep} of 4</div>

        <form.AppForm>
          <form.SubmitButton>Next</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
