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
  name: z.string().min(1, 'Category name is required')
})

type CategoryFormData = z.infer<typeof categorySchema>

const defaultCategoryData: CategoryFormData = {
  name: ''
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
          const body = { name: value.name }
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
      <h2 className='text-xl font-bold'>{isEditing ? 'Edit' : 'Create'} Topic</h2>
      <SCard
        title='Topic Name'
        description='Enter the name of the topic.'
        content={
          <form.AppField name='name' children={(field) => <field.TextAreaField placeholder='e.g., Urban Planning' />} />
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
