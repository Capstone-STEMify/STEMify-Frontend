'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'

const adminSchema = z.object({
  admins: z
    .array(
      z.object({
        email: z.string().email('Invalid email'),
        firstName: z.string().min(1, 'Required'),
        lastName: z.string().min(1, 'Required'),
        phoneNumber: z.string().min(6, 'Invalid phone number')
      })
    )
    .min(1, 'At least one admin required')
})

export default function Step4AdminAccounts({
  formWizard
}: {
  formWizard: ReturnType<typeof useOrganizationSubscriptionForm>
}) {
  const { currentStep, goBack } = formWizard
  const form = useAppForm({
    defaultValues: {
      admins: [{ email: '', firstName: '', lastName: '', phoneNumber: '' }]
    },
    validators: { onChange: adminSchema as any },
    onSubmit: async ({ value }) => {
      toast.success('Admin accounts validated successfully!')
    }
  })

  // const addAdmin = () => {
  //   form.updateFieldValue('admins', [
  //     ...form.state.values.admins,
  //     { email: '', firstName: '', lastName: '', phoneNumber: '' }
  //   ])
  // }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-6'
    >
      {form.state.values.admins.map((admin, index) => (
        <div key={index} className='space-y-2 rounded-lg border p-4'>
          <h3 className='text-sm font-medium text-slate-700'>Admin #{index + 1}</h3>
          <form.AppField name={`admins[${index}].email`}>
            {(field) => <field.TextField label='Email' placeholder='Enter admin email' />}
          </form.AppField>
          <div className='grid grid-cols-2 gap-4'>
            <form.AppField name={`admins[${index}].firstName`}>
              {(field) => <field.TextField label='First Name' />}
            </form.AppField>
            <form.AppField name={`admins[${index}].lastName`}>
              {(field) => <field.TextField label='Last Name' />}
            </form.AppField>
          </div>
          <form.AppField name={`admins[${index}].phoneNumber`}>
            {(field) => <field.TextField label='Phone Number' />}
          </form.AppField>
        </div>
      ))}

      <button type='button' className='text-sm text-blue-600 underline hover:text-blue-800'>
        + Add Another Admin
      </button>

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
