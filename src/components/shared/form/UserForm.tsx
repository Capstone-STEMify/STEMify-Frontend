'use client'

import { useAppForm } from '@/components/shared/form/items'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { parseWithZod } from '@conform-to/zod/v4'

export default function UserForm() {
  const tv = useTranslations('validation')
  const tm = useTranslations('message')
  const tc = useTranslations('common')

  const contactMethods = ['email', 'phone', 'whatsapp', 'sms'] as const
  type ContactMethod = (typeof contactMethods)[number]

  const ContactMethods: { value: string; label: string }[] = contactMethods.map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }))

  // Zod schema
  const UserSchema = z.object({
    name: z
      .string()
      .regex(/^[A-Z]/, tv('user.name'))
      .min(3, tv('user.nameLength', { length: 3 })),
    surname: z
      .string()
      .min(3, tv('user.surnameLength', { length: 3 }))
      .regex(/^[A-Z]/, tv('user.surname')),
    isAcceptingTerms: z.boolean().refine((val) => val, {
      message: tm('user')
    }),
    contact: z.object({
      email: z.string().email(tv('user.email')),
      phone: z.string().default(''),
      preferredContactMethod: z.enum(contactMethods)
    })
  })

  type User = z.infer<typeof UserSchema>

  const defaultUser: User = {
    name: '',
    surname: '',
    isAcceptingTerms: false,
    contact: {
      email: '',
      phone: '',
      preferredContactMethod: 'email'
    }
  }

  function objectToFormData(obj: any, prefix = ''): FormData {
    const fd = new FormData()
    const append = (key: string, value: any) => {
      fd.append(key, value == null ? '' : String(value))
    }

    const walk = (o: any, pfx: string) => {
      if (typeof o !== 'object' || o === null) {
        append(pfx, o)
        return
      }
      for (const k of Object.keys(o)) {
        const v = o[k]
        const key = pfx ? `${pfx}.${k}` : k
        if (typeof v === 'object' && v !== null) {
          walk(v, key)
        } else {
          append(key, v)
        }
      }
    }

    walk(obj, prefix)
    return fd
  }

  const form = useAppForm({
    defaultValues: defaultUser,
    validators: {
      onChange: (value) => parseWithZod(objectToFormData(value), { schema: UserSchema })
    },
    onSubmit: ({ value }) => {
      console.log('Form submitted:', value)
    }
  })

  return (
    <form
      className='mx-auto flex w-[400px] flex-col gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppField name='name' children={(field) => <field.TextField label='Name' />} />
      <form.AppField name='surname' children={(field) => <field.TextField label='Surname' />} />
      <form.AppField
        name='isAcceptingTerms'
        children={(field) => <field.CheckboxField label='I accept the terms and conditions' />}
      />

      <div className='my-2 space-y-2'>
        <h3 className='text-lg font-medium'>Contacts</h3>
        <div className='space-y-2'>
          <form.AppField name='contact.email' children={(field) => <field.TextField label='Email' type='email' />} />
          <form.AppField name='contact.phone' children={(field) => <field.TextField label='Phone' />} />
          <form.AppField
            name='contact.preferredContactMethod'
            children={(field) => <field.SelectField label='Preferred Contact Method' options={ContactMethods} />}
          />
        </div>
      </div>

      <form.AppForm>
        <form.SubmitButton>{tc('button.submit')}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
