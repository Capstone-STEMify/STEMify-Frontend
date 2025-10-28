'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import ManualEntryTab from '@/features/license-assignment/components/modal/ManualEntryTab'

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
    <div>
      <ManualEntryTab goBack={goBack} />
    </div>
  )
}
