'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import { Button } from '@/components/shadcn/button'
import { ContractFormData } from '@/features/contract/types/contract.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import {
  useCreateContractMutation,
  useGetContractByIdQuery,
  useUpdateContractMutation
} from '@/features/contract/api/contractApi'
import { fileToBase64 } from '@/utils/index'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

const contractDefaultValues: ContractFormData = {
  name: '',
  description: '',
  fileBase64: '',
  previewUrlFromServer: ''
}

export default function Step2ContractCreation({
  formWizard
}: {
  formWizard: ReturnType<typeof useOrganizationSubscriptionForm>
}) {
  const searchParams = useSearchParams()
  const organizationId = searchParams.get('organizationId')
  const contractId = searchParams.get('contractId')

  // const { organizationId } = useAppSelector((state) => state.subscriptionForm)
  const { currentStep, goBack, goNext } = formWizard
  const fileFieldRef = useRef<any>(null)

  const { data: contractData } = useGetContractByIdQuery(1)
  const [createContract, { isLoading: isCreating }] = useCreateContractMutation()
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation()

  const contractSchema = z.object({
    name: z.string().min(1, 'Contract name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    fileBase64: z.string().min(1, 'Please upload a contract file'),
    previewUrlFromServer: z.string().optional()
  })

  const form = useAppForm({
    defaultValues: contractDefaultValues,
    // validators: { onChange: contractSchema },
    onSubmit: async ({ value }) => {
      const fileValue = value.fileBase64 as any
      if (fileValue instanceof File) {
        value.fileBase64 = await fileToBase64(fileValue)
      }

      const payload = {
        ...value,
        organizationId: 1
      }

      createContract(payload).unwrap()

      toast.success('Contract step validated successfully!')
      goNext()
    }
  })

  useEffect(() => {
    if (contractData?.data) {
      form.reset({
        name: contractData.data.name,
        description: contractData.data.description,
        fileBase64: '',
        previewUrlFromServer: contractData.data.fileUrl
      })
    }
  }, [contractData, form])

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
        {(field) => {
          fileFieldRef.current = field
          return (
            <field.FileField
              label='Contract File (PDF)'
              previewUrlFromServer={form.state.values.previewUrlFromServer}
            />
          )
        }}
      </form.AppField>

      {Object.keys(form.state.errors).length > 0 && (
        <div className='rounded-md bg-red-50 p-4'>
          <h3 className='text-sm font-medium text-red-800'>Please fix the following errors:</h3>
          <ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-red-700'>
            {Object.entries(form.state.errors).map(([field, errorObj], i) => {
              const message =
                typeof errorObj === 'string' ? errorObj : (errorObj as any)?.message || JSON.stringify(errorObj)
              return (
                <li key={i}>
                  <b>{field}</b>: {message}
                </li>
              )
            })}
          </ul>
        </div>
      )}

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
