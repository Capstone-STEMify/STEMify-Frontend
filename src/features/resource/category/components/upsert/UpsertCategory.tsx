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
import { parseWithZod } from '@conform-to/zod'

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

  const tv = useTranslations('validation')
  const t = useTranslations('Admin.topic')
  const tt = useTranslations('toast')

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
      // nếu useAppForm accept zod:
      // onChange: categorySchema
      // nếu cần StandardSchema (conform):
      onChange: (value) => parseWithZod(new FormData(Object.entries(value) as any), { schema: categorySchema })
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          const body = { name: value.name }
          await updateCategory({ id: id!, body }).unwrap()
          toast.success(tt('successMessage.update'))
        } else {
          await createCategory(value).unwrap()
          toast.success(tt('successMessage.create'))
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
      <h2 className='text-xl font-bold'>{isEditing ? `${t('editTitle')}` : `${t('createTitle')}`}</h2>
      <SCard
        title={t('name')}
        description={t('description')}
        content={
          <form.AppField name='name' children={(field) => <field.TextAreaField placeholder={t('placeholder')} />} />
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
