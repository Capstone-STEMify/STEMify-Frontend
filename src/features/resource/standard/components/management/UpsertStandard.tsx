'use client'
import React from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import {
  useCreateStandardMutation,
  useGetStandardByIdQuery,
  useUpdateStandardMutation
} from '@/features/resource/standard/api/standardApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCard } from '@/components/shared/card/SCard'

// Schema validation cho form
const standardSchema = z.object({
  standardName: z.string().min(3, 'Standard name must be at least 3 characters long')
})

type StandardFormData = z.infer<typeof standardSchema>

const defaultStandardData: StandardFormData = {
  standardName: ''
}

interface UpsertStandardProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertStandard({ id, onSuccess }: UpsertStandardProps) {
  const isEditing = !!id

  const { data: existingData, isLoading: isDataLoading } = useGetStandardByIdQuery(id as number, {
    skip: !isEditing
  })

  const [createStandard, { isLoading: isCreating }] = useCreateStandardMutation()
  const [updateStandard, { isLoading: isUpdating }] = useUpdateStandardMutation()

  const form = useAppForm({
    defaultValues: defaultStandardData,
    validators: {
      onChange: standardSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateStandard({ id: id!, body: value }).unwrap()
          toast.success('Standard updated successfully!')
        } else {
          await createStandard(value).unwrap()
          toast.success('Standard created successfully!')
        }
        onSuccess?.()
      } catch (err: any) {
        toast.error('Failed to submit standard.')
        console.error(err)
      }
    }
  })

  // Điền dữ liệu vào form khi ở chế độ edit
  React.useEffect(() => {
    if (isEditing && existingData?.data) {
      form.reset({
        standardName: existingData.data.standardName
      })
    }
  }, [existingData, isEditing, form])

  if (isDataLoading) {
    return <LoadingComponent />
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-4'
    >
      <h2 className='text-xl font-bold'>{isEditing ? 'Edit' : 'Create'} Standard</h2>
      <SCard
        title='Standard Name'
        description='Enter the name of the standard.'
        content={
          <form.AppField
            name='standardName'
            children={(field) => <field.TextAreaField placeholder='e.g., Common Core' />}
          />
        }
      />
      <div className='flex justify-end gap-2 pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating}>
            {isEditing ? 'Update' : 'Create'}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
