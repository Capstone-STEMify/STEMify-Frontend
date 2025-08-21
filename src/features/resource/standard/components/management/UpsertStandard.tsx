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
import { useTranslations } from 'next-intl'

// Schema validation cho form
const standardSchema = z.object({
  code: z.string().min(3, 'Standard code must be at least 3 characters long'),
  standardName: z.string().optional(),
  description: z.string().optional()
})

type StandardFormData = z.infer<typeof standardSchema>

const defaultStandardData: StandardFormData = {
  code: '',
  standardName: '',
  description: ''
}

interface UpsertStandardProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertStandard({ id, onSuccess }: UpsertStandardProps) {
  const isEditing = !!id

  const t = useTranslations('Admin.standard')

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
        code: existingData.data.code,
        standardName: existingData.data.standardName,
        description: existingData.data.description || ''
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
      <h2 className='text-xl font-bold'>{isEditing ? `${t('editTitle')}` : `${t('createTitle')}`}</h2>

      <SCard
        title={t('code')}
        content={<form.AppField name='code' children={(field) => <field.TextField placeholder={'ITSL-1.2'} />} />}
      />

      <SCard
        title={t('name')}
        description={t('description')}
        content={
          <form.AppField
            name='standardName'
            children={(field) => <field.TextAreaField placeholder={'Empowered Learner'} />}
          />
        }
      />

      <SCard
        title={t('description')}
        description={t('description')}
        content={
          <form.AppField
            name='description'
            children={(field) => <field.TextAreaField placeholder={t('placeholder')} />}
          />
        }
      />

      <div className='flex justify-end gap-2 pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='bg-amber-custom-400 cursor-pointer'>
            {isEditing ? `${t('updateButton')}` : `${t('createButton')}`}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
