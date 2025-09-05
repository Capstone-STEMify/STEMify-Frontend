'use client'
import React from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { Role, ROLES } from '../../types/user.type'
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '../../api/userApi'
import { useTranslations } from 'next-intl'

const tv = useTranslations('validation')

const createUserSchema = z.object({
  email: z.string().email(tv('user.email')),
  userName: z.string().min(3, tv('user.userName', {length: 3})),
  password: z.string().min(6, tv('user.password', {length: 6})),
  role: z.enum(ROLES),
  firstName: z.string().min(1, tv('user.firstName')),
  lastName: z.string().min(1, tv('user.lastName'))
})

const updateUserSchema = createUserSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal(''))
})

const defaultUserData = {
  email: '',
  userName: '',
  password: '',
  role: 'Guest' as Role,
  firstName: '',
  lastName: ''
}

interface UpsertUserProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertUser({ id, onSuccess }: UpsertUserProps) {
  const isEditing = !!id

  const t = useTranslations('Admin.user')
  const tt = useTranslations('toast')

  const { data: existingData, isLoading: isDataLoading } = useGetUserByIdQuery(id as number, {
    skip: !isEditing
  })

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const form = useAppForm({
    defaultValues: defaultUserData,
    validators: {
      onChange: createUserSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const { password, ...rest } = value
        const requestBody: any = rest
        if (isEditing) {
          if (password) {
            requestBody.password = password
          }
          await updateUser({ id: id!, body: requestBody }).unwrap()
          toast.success(tt('successMessage.update'))
        } else {
          requestBody.password = password
          await createUser(requestBody).unwrap()
          toast.success(tt('successMessage.create'))
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
        ...existingData.data,
        password: ''
      })
    }
  }, [existingData, isEditing, form])

  if (isDataLoading) {
    return <LoadingComponent />
  }

  const roleOptions = ROLES.map((role) => ({ value: role, label: role }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-4'
    >
      <h2 className='text-xl font-bold'>{isEditing ? `${t('updateButton')}` : `${t('createButton')}`}</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <form.AppField name='userName' children={(field) => <field.TextField label={t('username')} />} />
        <form.AppField name='email' children={(field) => <field.TextField label='Email' type={t('email')} />} />
        <form.AppField name='firstName' children={(field) => <field.TextField label={t('firstName')} />} />
        <form.AppField name='lastName' children={(field) => <field.TextField label={t('lastName')} />} />
        <form.AppField
          name='password'
          children={(field) => (
            <field.TextField
              label={t('password')}
              type='password'
              placeholder={isEditing ? `${t('passwordDescription')}` : ''}
            />
          )}
        />
        <form.AppField name='role' children={(field) => <field.SelectField label={t('role')} options={roleOptions} />} />
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating}>{isEditing ? `${t('updateButton')}` : `${t('createButton')}`}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
