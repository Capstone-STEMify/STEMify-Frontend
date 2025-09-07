'use client'
import React from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import {
  useCreateSkillMutation,
  useGetSkillByIdQuery,
  useUpdateSkillMutation
} from '@/features/resource/skill/api/skillApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCard } from '@/components/shared/card/SCard'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'

type SkillFormData = {
  skillName: string
}

const defaultSkillData: SkillFormData = {
  skillName: ''
}

interface UpsertSkillProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertSkill({ id, onSuccess }: UpsertSkillProps) {
  const isEditing = !!id
  const { closeModal } = useModal()
  const t = useTranslations('Admin.skill')
  const tt = useTranslations('toast')
  const tv = useTranslations('validation')
  const tc = useTranslations('common')

  const skillSchema = z.object({
    skillName: z.string().min(3, tv('skill.length', { length: 3 }))
  })

  const { data: existingData, isLoading: isDataLoading } = useGetSkillByIdQuery(id as number, {
    skip: !isEditing
  })

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation()
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation()

  const form = useAppForm({
    defaultValues: defaultSkillData,
    validators: {
      onChange: skillSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateSkill({ id: id!, body: value }).unwrap()
          toast.success(tt('successMessage.update', { title: value.skillName }))
        } else {
          await createSkill(value).unwrap()
          toast.success(tt('successMessage.create', { title: value.skillName }))
        }
        onSuccess?.()
      } catch (err: any) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  React.useEffect(() => {
    if (isEditing && existingData?.data) {
      form.reset({
        skillName: existingData.data.skillName
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
        name='skillName'
        children={(field) => <field.TextAreaField label={t('name')} placeholder={t('description')} />}
      />

      <div className='flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={closeModal}>
          {tc('button.cancel')}
        </Button>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='bg-amber-custom-400'>
            {isEditing ? t('updateButton') : t('createButton')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
