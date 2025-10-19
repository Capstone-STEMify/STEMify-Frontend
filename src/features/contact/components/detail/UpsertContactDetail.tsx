'use client'

import React from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { ContactStatus } from '@/features/contact/types/contact.type'
import {
  useCreateContactMutation,
  useGetContactByIdQuery,
  useUpdateContactMutation
} from '@/features/contact/api/contactApi'

// ----------------------
// 🔹 SCHEMA
// ----------------------
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  emailAddress: z.string().email('Invalid email'),
  phoneNumber: z.string().min(6, 'Invalid phone number'),
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationType: z.string().min(1, 'Organization type is required'),
  jobRoleName: z.string().min(1, 'Job role is required'),
  status: z.enum(ContactStatus)
})

// ----------------------
// 🔹 TYPE & DEFAULT
// ----------------------
export type ContactFormData = z.infer<typeof contactSchema>

const defaultContactData: ContactFormData = {
  firstName: '',
  lastName: '',
  emailAddress: '',
  phoneNumber: '',
  organizationName: '',
  organizationType: '',
  jobRoleName: '',
  status: ContactStatus.PENDING
}

interface UpsertContactDetailProps {
  id?: number
  onSuccess?: () => void
}

// ----------------------
// 🔹 COMPONENT
// ----------------------
export default function UpsertContactDetail({ id, onSuccess }: UpsertContactDetailProps) {
  const isEditing = !!id
  const { closeModal } = useModal()
  const tv = useTranslations('validation')
  const t = useTranslations('contact.form')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')

  // Query
  const { data: contactData, isLoading: isContactLoading } = useGetContactByIdQuery(id as number, {
    skip: !isEditing
  })

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation()
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation()

  // Form setup
  const form = useAppForm({
    defaultValues: defaultContactData,
    validators: {
      onChange: contactSchema
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateContact({ id: id!, body: value }).unwrap()
          toast.success(tt('successMessage.update', { title: `${value.firstName} ${value.lastName}` }))
        } else {
          await createContact(value).unwrap()
          toast.success(tt('successMessage.create', { title: `${value.firstName} ${value.lastName}` }))
        }
        onSuccess?.()
        closeModal()
      } catch (err) {
        toast.error(tt('errorMessage'))
        console.error(err)
      }
    }
  })

  // Pre-fill when editing
  React.useEffect(() => {
    if (isEditing && contactData?.data) {
      form.reset(contactData.data)
    }
  }, [isEditing, contactData, form])

  if (isContactLoading) {
    return <LoadingComponent />
  }

  // ----------------------
  // 🔹 RENDER FORM
  // ----------------------
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-4 px-4'
    >
      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name='firstName'
          children={(field) => (
            <field.TextField label={t('firstName.label')} placeholder={t('firstName.placeholder')} />
          )}
        />
        <form.AppField
          name='lastName'
          children={(field) => <field.TextField label={t('lastName.label')} placeholder={t('lastName.placeholder')} />}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name='emailAddress'
          children={(field) => <field.TextField label={t('email.label')} placeholder={t('email.placeholder')} />}
        />
        <form.AppField
          name='phoneNumber'
          children={(field) => (
            <field.TextField label={t('phoneNumber.label')} placeholder={t('phoneNumber.placeholder')} />
          )}
        />
      </div>

      <form.AppField
        name='organizationName'
        children={(field) => (
          <field.TextField label={t('organizationName.label')} placeholder={t('organizationName.placeholder')} />
        )}
      />

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name='organizationType'
          children={(field) => (
            <field.TextField label={t('organizationType.label')} placeholder={t('organizationType.placeholder')} />
          )}
        />
        <form.AppField
          name='jobRoleName'
          children={(field) => (
            <field.TextField label={t('jobRoleName.label')} placeholder={t('jobRoleName.placeholder')} />
          )}
        />
      </div>

      <form.AppField
        name='status'
        children={(field) => (
          <field.SelectField
            label={t('status.label')}
            options={Object.values(ContactStatus).map((s) => ({
              label: s,
              value: s
            }))}
          />
        )}
      />

      <div className='flex justify-end gap-3 pt-2'>
        <Button type='button' variant='outline' onClick={closeModal}>
          {tc('button.cancel')}
        </Button>

        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating} className='bg-amber-custom-400 cursor-pointer'>
            {isEditing ? `${tc('button.update')}` : `${tc('button.create')}`}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
