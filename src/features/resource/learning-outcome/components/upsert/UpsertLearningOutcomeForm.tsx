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
// Schema validation cho form
const learningOutcomeSchema = z.object({
  name: z.string().min(3, 'Learning outcome name must be at least 3 characters long'),
  description: z.string().min(10, 'Learning outcome description must be at least 10 characters long')
})

type LearningOutcomeFormData = z.infer<typeof learningOutcomeSchema>

const defaultLearningOutcomeData: LearningOutcomeFormData = {
  name: '',
  description: ''
}
export default function UpsertLearningOutcomeForm({ id, onSuccess }: UpsertLearningOutcomeProps) {
  const isEditing = !!id

  const t = useTranslations('LearningOutcome')
  const tc = useTranslations('common')

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
          toast.success('Learning outcome updated successfully!')
        } else {
          await createLearningOutcome(value).unwrap()
          toast.success('Learning outcome created successfully!')
        }
        onSuccess?.()
      } catch (err: any) {
        toast.error('Failed to submit learning outcome.')
        console.error(err)
      }
    }
  })

  // Điền dữ liệu vào form khi ở chế độ edit
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
      <h2 className='text-xl font-bold'>{isEditing ? `${t('editTitle')}` : `${t('createTitle')}`}</h2>
      <SCard
        title={t('PLO.name')}
        content={
          <form.AppField name='name' children={(field) => <field.TextAreaField placeholder={t('placeholder')} />} />
        }
      />
      <SCard
        title={t('PLO.description')}
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
            {tc('button.save')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
