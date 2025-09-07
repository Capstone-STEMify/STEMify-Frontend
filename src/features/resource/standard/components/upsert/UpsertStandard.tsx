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
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'

const standardSchema = z.object({
  standardName: z.string().min(2).max(100),
  description: z.string().min(2).max(500).optional()
})

type StandardFormData = z.infer<typeof standardSchema>

const defaultStandardData: StandardFormData = {
  standardName: '',
  description: ''
}

interface UpsertStandardProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertStandard({ id, onSuccess }: UpsertStandardProps) {
  const isEditing = !!id
  const { closeModal } = useModal()
  const tc = useTranslations('common')
  const t = useTranslations('Admin.standard')
  const tt = useTranslations('toast')

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
          toast.success(tt('successMessage.update', { title: value.standardName }))
        } else {
          await createStandard(value).unwrap()
          toast.success(tt('successMessage.create', { title: value.standardName }))
        }
        onSuccess?.()
      } catch (err: any) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  // Điền dữ liệu vào form khi ở chế độ edit
  React.useEffect(() => {
    if (isEditing && existingData?.data) {
      form.reset({
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
      <form.AppField
        name='standardName'
        children={(field) => <field.TextField label={t('name')} placeholder={'Empowered Learner'} />}
      />

      <form.AppField
        name='description'
        children={(field) => <field.TextAreaField label={t('description')} placeholder={t('placeholder')} />}
      />

      <div className='mb-3 flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={closeModal}>
          {tc('button.cancel')}
        </Button>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='bg-amber-custom-400 cursor-pointer'>
            {isEditing ? `${t('updateButton')}` : `${t('createButton')}`}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
