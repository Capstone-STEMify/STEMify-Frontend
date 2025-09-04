import { useTranslations } from 'next-intl'
import React from 'react'
import {
  useCreateLearningOutcomeMutation,
  useGetLearningOutcomeByIdQuery,
  useUpdateLearningOutcomeMutation
} from '../../api/learningOutcomeApi'
import { toast } from 'sonner'
import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { de } from 'zod/v4/locales'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCard } from '@/components/shared/card/SCard'

interface UpsertLearningOutcomeProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertLearningOutcomeForm({ id, onSuccess }: UpsertLearningOutcomeProps) {
  const isEditing = !!id

  const t = useTranslations('LearningOutcome')
  const tc = useTranslations('common')

  // Schema validation cho form
  const learningOutcomeSchema = z.object({
    name: z.string().min(3, tc('validationMessage.minLength', { min: 3 })),
    description: z.string().min(10, tc('validationMessage.minLength', { min: 10 }))
  })
  type LearningOutcomeFormData = z.infer<typeof learningOutcomeSchema>

  const defaultLearningOutcomeData: LearningOutcomeFormData = {
    name: '',
    description: ''
  }

  const { data: existingData, isLoading: isDataLoading } = useGetLearningOutcomeByIdQuery(id as number, {
    skip: !isEditing
  })

  const [createLearningOutcome, { isLoading: isCreating }] = useCreateLearningOutcomeMutation()
  const [updateLearningOutcome, { isLoading: isUpdating }] = useUpdateLearningOutcomeMutation()

  const form = useAppForm({
    defaultValues: defaultLearningOutcomeData,
    validators: {
      onChange: learningOutcomeSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateLearningOutcome({ id: id!, body: value }).unwrap()
          toast.success(t('successMessage.update'))
        } else {
          await createLearningOutcome(value).unwrap()
          toast.success(t('successMessage.create'))
        }
        onSuccess?.()
      } catch (err: any) {
        toast.error(t('errorMessage'))
        console.error(err)
      }
    }
  })

  React.useEffect(() => {
    if (isEditing && existingData?.data) {
      form.reset({
        name: existingData.data.name,
        description: existingData.data.description
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
      <h2 className='text-xl font-bold'>{isEditing ? `${t('form.title.update')}` : `${t('form.title.create')}`}</h2>

      <form.AppField
        name='name'
        children={(field) => (
          <field.TextAreaField
            label={t('form.fields.PLOName.label')}
            placeholder={t('form.fields.PLOName.placeholder')}
          />
        )}
      />

      <form.AppField
        name='description'
        children={(field) => (
          <field.TextAreaField
            label={t('form.fields.PLODescription.label')}
            placeholder={t('form.fields.PLODescription.placeholder')}
          />
        )}
      />
      <div className='flex justify-end gap-2 pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='bg-amber-custom-400 cursor-pointer'>
            {tc('button.save')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
