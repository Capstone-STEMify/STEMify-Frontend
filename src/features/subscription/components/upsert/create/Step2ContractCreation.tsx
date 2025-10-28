'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import { Button } from '@/components/shadcn/button'

export default function Step2ContractCreation({
  formWizard
}: {
  formWizard: ReturnType<typeof useOrganizationSubscriptionForm>
}) {
  const { currentStep, goBack, submitContract } = formWizard

  const contractSchema = z.object({
    name: z.string().min(1, 'Contract name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    fileBase64: z.string().min(1, 'Please upload a contract file')
  })

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: '',
      fileBase64: ''
    },
    validators: { onChange: contractSchema as any },
    onSubmit: async ({ value }) => {
      toast.success('Contract step validated successfully!')
      submitContract(value)
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
      <form.AppField name='name'>
        {(field) => <field.TextField label='Contract Name' placeholder='Enter contract name' />}
      </form.AppField>

      <form.AppField name='description'>
        {(field) => (
          <field.TextAreaField
            label='Description'
            placeholder='Enter contract description'
            rows={3}
            className='resize-none'
          />
        )}
      </form.AppField>

      <form.AppField name='fileBase64'>
        {(field) => <field.FileField label='Contract File (PDF)' accept='application/pdf' />}
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
