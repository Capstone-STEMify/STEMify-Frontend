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

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-+|-+$/g, '') 
}

const categorySchema = z.object({
  categoryName: z.string().min(3, 'Category name must be at least 3 characters long'),
  slug: z.string().optional()
})

type CategoryFormData = z.infer<typeof categorySchema>

const defaultCategoryData: CategoryFormData = {
  categoryName: '',
  slug: ''
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
        value.slug = generateSlug(value.categoryName)

        if (isEditing) {
          const body = { categoryName: value.categoryName, slug: value.slug }
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
        categoryName: categoryData.data.categoryName,
        slug: categoryData.data.slug
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
          <form.AppField
            name='categoryName'
            children={(field) => <field.TextAreaField placeholder='e.g., Urban Planning' />}
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