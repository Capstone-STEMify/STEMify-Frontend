'use client'
import React from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { toast } from 'sonner'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '../../api/userApi'
import { useTranslations } from 'next-intl'
import { parseWithZod } from '@conform-to/zod/v4'
import { LicenseType, UserRole } from '@/types/userRole'

const defaultUserData = {
  email: '',
  userName: '',
  password: '',
  role: UserRole.STAFF,
  firstName: '',
  lastName: ''
}

interface UpsertUserProps {
  id?: number
  onSuccess?: () => void
}

function objectToFormData(obj: Record<string, any>): FormData {
  const fd = new FormData()
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      fd.append(key, obj[key])
    }
  }
  return fd
}

export default function UpsertUser({ id, onSuccess }: UpsertUserProps) {
  const isEditing = !!id

  const tv = useTranslations('validation')
  const t = useTranslations('Admin.user')
  const tt = useTranslations('toast')

  const createUserSchema = z.object({
    email: z.string().email(tv('user.email')),
    userName: z.string().min(3, tv('user.userName', { length: 3 })),
    password: z.string().min(6, tv('user.password', { length: 6 })),
    role: z.enum(UserRole),
    firstName: z.string().min(1, tv('user.firstName')),
    lastName: z.string().min(1, tv('user.lastName'))
  })

  const updateUserSchema = createUserSchema.extend({
    password: z
      .string()
      .min(6, tv('user.password', { length: 6 }))
      .optional()
  })

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
          if (password && password.trim() !== '') {
            requestBody.password = password
          }
          await updateUser({ id: id!, body: requestBody }).unwrap()
          toast.success(tt('successMessage.updateNoTitle'))
        } else {
          requestBody.password = password
          await createUser(requestBody).unwrap()
          toast.success(tt('successMessage.createNoTitle'))
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
        email: existingData.data.email,
        userName: existingData.data.userName,
        password: '',
        role: existingData.data.userRole,
        firstName: existingData.data.firstName,
        lastName: existingData.data.lastName
      })
    }
  }, [existingData, isEditing, form])

  if (isDataLoading) {
    return <LoadingComponent />
  }

  // only staff and admin
  const roleOptions = Object.values(UserRole)
    .map((role) => ({ value: role, label: role }))
    .filter((option) => option.value === UserRole.STAFF || option.value === UserRole.ADMIN)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='w-3xl space-y-4'
    >
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <form.AppField name='userName'>
          {(field) => <field.TextField label={t('username')} placeholder={t('usernamePlaceholder')} />}
        </form.AppField>
        <form.AppField name='email'>
          {(field) => <field.TextField label='Email' type='email' placeholder={t('emailPlaceholder')} />}
        </form.AppField>
        <form.AppField name='firstName'>
          {(field) => <field.TextField label={t('firstName')} placeholder={t('firstNamePlaceholder')} />}
        </form.AppField>
        <form.AppField name='lastName'>
          {(field) => <field.TextField label={t('lastName')} placeholder={t('lastNamePlaceholder')} />}
        </form.AppField>
        <form.AppField name='password'>
          {(field) => (
            <field.TextField
              label={t('password')}
              type='password'
              placeholder={isEditing ? t('passwordDescription') : ''}
            />
          )}
        </form.AppField>
        <form.AppField name='role'>
          {(field) => <field.SelectField label={t('role')} options={roleOptions} />}
        </form.AppField>
      </div>

      <div className='flex justify-end gap-2 pt-4'>
        <form.AppForm>
          <form.SubmitButton loading={isCreating || isUpdating}>
            {isEditing ? t('updateButton') : t('createButton')}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
