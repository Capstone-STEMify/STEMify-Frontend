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
import { code } from '@uiw/react-md-editor'

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  code: z.string().min(1, 'Category code is required'),
  description: z.string().optional()
})

type CategoryFormData = z.infer<typeof categorySchema>

const defaultCategoryData: CategoryFormData = {
  name: '',
  code: '',
  description: ''
}

interface UpsertCategoryProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertCategory({ id, onSuccess }: UpsertCategoryProps) {
  const isEditing = !!id

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
          const body = { name: value.name, code: value.code, description: value.description }
          await updateCategory({ id: id!, body }).unwrap()
          toast.success('Category updated successfully!')
        } else {
          await createCategory(value).unwrap()
          toast.success('Category created successfully!')
        }
        onSuccess?.()
      } catch (err) {
        toast.error('Failed to submit category.')
        console.error(err)
      }
    }
  })

  React.useEffect(() => {
    if (isEditing && categoryData?.data) {
      form.reset({
        name: categoryData.data.name,
        code: categoryData.data.code,
        description: categoryData.data.description || ''
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
      <h2 className='text-xl font-bold'>{isEditing ? 'Edit' : 'Create'} Category</h2>
      <SCard
        title='Category Name'
        description='Enter the name of the category.'
        content={
          <form.AppField name='name' children={(field) => <field.TextAreaField placeholder='e.g., Urban Planning' />} />
        }
      />
      <SCard
        title='Category Code'
        description='Enter the code of the category.'
        content={<form.AppField name='code' children={(field) => <field.TextAreaField placeholder='e.g., Cat001' />} />}
      />
      <SCard
        title='Category Description'
        description='Enter the description of the category.'
        content={
          <form.AppField
            name='description'
            children={(field) => <field.TextAreaField placeholder='e.g., This category is about urban planning.' />}
          />
        }
      />
      <div className='flex justify-end gap-2 pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating}>{isEditing ? 'Update' : 'Create'}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
