'use client'
import React from 'react'
import { z } from 'zod'
import { SCard } from '@/components/shared/card/SCard'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation
} from '@/features/resource/category/api/categoryApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { parseWithZod } from '@conform-to/zod/v4'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { title } from 'process'

type CategoryFormData = {
  name: string
}

const defaultCategoryData: CategoryFormData = {
  name: ''
}

interface UpsertCategoryProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertCategory({ id, onSuccess }: UpsertCategoryProps) {
  const isEditing = !!id
  const { closeModal } = useModal()
  const tv = useTranslations('validation')
  const t = useTranslations('Admin.topic')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')

  const categorySchema = z.object({
    name: z.string().min(1, tv('category.name'))
  })

  const { data: categoryData, isLoading: isCategoryLoading } = useGetCategoryByIdQuery(id as number, {
    skip: !isEditing
  })

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()

  const form = useAppForm({
    defaultValues: defaultCategoryData,
    validators: {
      onChange: categorySchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          const body = { name: value.name }
          await updateCategory({ id: id!, body }).unwrap()
          toast.success(tt('successMessage.update', { title: value.name }))
        } else {
          await createCategory(value).unwrap()
          toast.success(tt('successMessage.create', { title: value.name }))
        }
        onSuccess?.()
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  React.useEffect(() => {
    if (isEditing && categoryData?.data) {
      form.reset({
        name: categoryData.data.name
      })
    }
  }, [categoryData, isEditing, form])

  if (isCategoryLoading) {
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
        name='name'
        children={(field) => <field.TextField label={t('name')} placeholder={t('description')} />}
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
