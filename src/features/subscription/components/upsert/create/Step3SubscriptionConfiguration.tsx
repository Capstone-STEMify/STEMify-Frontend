'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import { Button } from '@/components/shadcn/button'
import { SubscriptionFormData } from '@/features/subscription/types/subscription.type'
import { useEffect } from 'react'
import { useCreateSubscriptionMutation, useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useGetAllCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { or } from 'ajv/dist/compile/codegen'

const subscriptionDefaultValues: SubscriptionFormData = {
  planBillingCycleId: 1,
  planName: '',
  grossAmount: 0,
  netAmount: 0,
  startDate: null,
  discountPercent: 0,
  maxStudentSeats: 10,
  maxTeacherSeats: 2,
  curriculumIds: []
}

export default function Step3SubscriptionConfiguration({
  formWizard
}: {
  formWizard: ReturnType<typeof useOrganizationSubscriptionForm>
}) {
  const subscriptionId = 1 // TODO: get from params or state

  const { data: curriculumData } = useGetAllCurriculumQuery()
  const { data: subscriptionData } = useGetSubscriptionByIdQuery(subscriptionId)
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()

  const subscription = subscriptionData?.data
  const { currentStep, goBack } = formWizard
  const subscriptionSchema = z.object({
    planBillingCycleId: z.number().min(1, 'Billing cycle is required'),
    planName: z.string().min(1, 'Plan name is required'),
    grossAmount: z.number().min(1, 'Gross amount must be greater than 0'),
    netAmount: z.number().min(1, 'Net amount must be greater than 0'),
    startDate: z.date().nullable(),
    discountPercent: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
    maxStudentSeats: z.number().min(1, 'At least 1 student seat required'),
    maxTeacherSeats: z.number().min(1, 'At least 1 teacher seat required'),
    curriculumIds: z.array(z.number())
  })

  const curriculumOptions =
    curriculumData?.data.items.map((curriculum) => ({
      label: curriculum.title,
      value: String(curriculum.id)
    })) || []

  const form = useAppForm({
    defaultValues: subscriptionDefaultValues,
    validators: { onChange: subscriptionSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        contractId: 1,
        organizationId: 1,
        planBillingCycleId: Number(value.planBillingCycleId),
        startDate: value.startDate ? value.startDate.toISOString().split('T')[0] : undefined,
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      createSubscription(payload)
    }
  })

  useEffect(() => {
    if (subscription && subscriptionId) {
      form.reset({
        planBillingCycleId: subscription.planBillingCycleId,
        planName: subscription.planName,
        grossAmount: subscription.grossAmount,
        netAmount: subscription.netAmount,
        startDate: subscription.startDate ? new Date(subscription.startDate) : null,
        discountPercent: subscription.discountPercent,
        maxStudentSeats: subscription.maxStudentSeats,
        maxTeacherSeats: subscription.maxTeacherSeats,
        curriculumIds: subscription.curriculums.filter((c) => c.id).map((c) => c.id as number)
      })
    }
  }, [subscription, subscriptionId])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-6'
    >
      <form.AppField name='planName'>
        {(field) => <field.TextField label='Plan Name' placeholder='Enter plan name' />}
      </form.AppField>

      <form.AppField name='planBillingCycleId'>
        {(field) => (
          <field.SelectField
            label='Billing Cycle'
            placeholder='Select cycle'
            options={[
              { label: 'Semiannual (6 months)', value: '1' },
              { label: 'Annual (12 months)', value: '2' }
            ]}
          />
        )}
      </form.AppField>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='grossAmount'>
          {(field) => <field.TextField type='number' label='Gross Amount' />}
        </form.AppField>
        <form.AppField name='netAmount'>
          {(field) => <field.TextField type='number' label='Net Amount' />}
        </form.AppField>
      </div>

      <form.AppField name='discountPercent'>
        {(field) => <field.TextField type='number' label='Discount (%)' />}
      </form.AppField>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='maxStudentSeats'>
          {(field) => <field.TextField type='number' label='Max Student Seats' />}
        </form.AppField>
        <form.AppField name='maxTeacherSeats'>
          {(field) => <field.TextField type='number' label='Max Teacher Seats' />}
        </form.AppField>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='startDate'>{(field) => <field.DatePickerField label='Start Date' />}</form.AppField>
        <form.AppField name='curriculumIds'>
          {(field) => (
            <field.DropdownMultipleCheckboxField
              label='Curriculums'
              description='Select one or more curriculums'
              options={curriculumOptions}
            />
          )}
        </form.AppField>
      </div>
      <div className='mt-5 flex items-center justify-between'>
        <Button variant='outline' onClick={goBack} disabled={currentStep === 1}>
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
