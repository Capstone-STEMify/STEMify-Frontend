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
import { useGetAllJobRoleQuery } from '@/features/job-role/api/jobRoleApi'

// ----------------------
// 🔹 SCHEMA
// ----------------------
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().min(6, 'Invalid phone number'),
  organizationName: z.string().min(1, 'Organization name is required'),
  jobRoleId: z.coerce.number().min(1, 'Job role is required'),
  status: z.enum(ContactStatus)
})

// ----------------------
// 🔹 TYPE & DEFAULT
// ----------------------

const patchContactSchema = contactSchema.partial()

export type ContactFormData = z.infer<typeof contactSchema>

const defaultContactData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  organizationName: '',
  jobRoleId: 1,
  status: ContactStatus.NEW
}

interface UpsertContactDetailProps {
  id?: number
  onSuccess?: () => void
}

// ----------------------
// 🔹 COMPONENT
// ----------------------
export default function UpsertContact({ id, onSuccess }: UpsertContactDetailProps) {
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
  const { data: jobRoleData, isLoading: isJobRoleLoading } = useGetAllJobRoleQuery()

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation()
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation()

  const jobRoleOptions =
    jobRoleData?.data?.items?.map((role) => ({
      label: role.name,
      value: role.id.toString()
    })) ?? []
  console.log('jobRoleOptions', jobRoleOptions)
  // Form setup
  const form = useAppForm({
    defaultValues: isEditing ? (contactData?.data ?? defaultContactData) : defaultContactData,
    validators: {
      onChange: contactSchema as any
    },
    onSubmit: async ({ value }) => {
      const payload = {
        firstName: value.firstName,
        lastName: value.lastName,
        ...(value.email && { email: value.email }),
        ...(value.phoneNumber && { phoneNumber: value.phoneNumber }),
        ...(value.organizationName && { organizationName: value.organizationName }),
        ...(value.jobRoleId && { jobRoleId: Number(value.jobRoleId) }),
        ...(value.status && { status: value.status })
      }

      if (isEditing) {
        await updateContact({ id: id!, body: { ...payload, status: value.status } }).unwrap()
        toast.success(tt('successMessage.update', { title: '' }))
      } else {
        await createContact(payload).unwrap()
        toast.success(tt('successMessage.create', { title: '' }))
      }
      onSuccess?.()
      closeModal()
    }
  })

  React.useEffect(() => {
    if (isEditing && contactData?.data && jobRoleOptions.length > 0) {
      const data = contactData.data
      form.reset({
        ...data,
        jobRoleId: data.jobRoleId,
        status: data.status.trim() as ContactStatus
      })
    }
  }, [isEditing, contactData?.data, jobRoleOptions])

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
          name='email'
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

      <form.AppField
        name='jobRoleId'
        children={(field) => (
          <field.SelectField label={t('jobRoleName.label')} options={jobRoleOptions} placeholder='Select a job role' />
        )}
      />

      {isEditing ? (
        <>
          <form.AppField
            name='status'
            children={(field) => (
              <field.SelectField
                label={t('status.label')}
                options={[
                  { label: 'New', value: ContactStatus.NEW },
                  { label: 'In Progress', value: ContactStatus.IN_PROGRESS },
                  { label: 'Resolved', value: ContactStatus.RESOLVED },
                  { label: 'Spam', value: ContactStatus.SPAM }
                ]}
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
        </>
      ) : (
        <>
          <form.AppForm>
            <form.SubmitButton loading={isCreating || isUpdating} className='w-full cursor-pointer bg-sky-400'>
              {tc('button.create')}
            </form.SubmitButton>
          </form.AppForm>
        </>
      )}
    </form>
  )
}
