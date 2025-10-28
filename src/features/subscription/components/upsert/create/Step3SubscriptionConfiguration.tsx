'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import { Button } from '@/components/shadcn/button'

export default function Step3SubscriptionConfiguration({
  formWizard
}: {
  formWizard: ReturnType<typeof useOrganizationSubscriptionForm>
}) {
  const { currentStep, goBack, submitSubscription } = formWizard
  const subscriptionSchema = z.object({
    planBillingCycleId: z.string().min(1, 'Billing cycle is required'),
    planName: z.string().min(1, 'Plan name is required'),
    grossAmount: z.number().min(1, 'Gross amount must be greater than 0'),
    netAmount: z.number().min(1, 'Net amount must be greater than 0'),
    discountPercent: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
    maxStudentSeats: z.number().min(1, 'At least 1 student seat required'),
    maxTeacherSeats: z.number().min(1, 'At least 1 teacher seat required'),
    curriculumIds: z.array(z.number())
  })
  const form = useAppForm({
    defaultValues: {
      planBillingCycleId: '',
      planName: '',
      grossAmount: 0,
      netAmount: 0,
      discountPercent: 0,
      maxStudentSeats: 10,
      maxTeacherSeats: 2,
      curriculumIds: [1]
    },
    validators: { onChange: subscriptionSchema },
    onSubmit: async ({ value }) => {
      toast.success('Subscription step validated successfully!')
      submitSubscription(value)
    }
  })

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

      <form.AppField name='curriculumIds'>
        {(field) => (
          <field.DropdownMultipleCheckboxField
            label='Curriculums'
            description='Select one or more curriculums'
            options={[
              { label: 'STEM Fundamentals', value: '1' },
              { label: 'Robotics Beginner', value: '2' },
              { label: 'AI Starter', value: '3' }
            ]}
          />
        )}
      </form.AppField>

      <div className='mt-8 flex items-center justify-between border-t pt-6'>
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
