'use client'

import { useAppForm } from '@/components/shared/form/items'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

const ContactMethod = z.union([z.literal('email'), z.literal('phone'), z.literal('whatsapp'), z.literal('sms')])
type ContactMethod = z.infer<typeof ContactMethod>

const ContactMethods = ContactMethod.options.map(({ value }) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1)
}))

const tv = useTranslations('validation')

const UserSchema = z.object({
  name: z
    .string()
    .regex(/^[A-Z]/, tv('user.name'))
    .min(3, tv('user.nameLength', {length: 3})),
  surname: z
    .string()
    .min(3, tv('user.surnameLength', {length: 3}))
    .regex(/^[A-Z]/, tv('user.surname')),
  isAcceptingTerms: z.boolean().refine((val) => val, {
    message: 'You must accept the terms and conditions'
  }),
  contact: z.object({
    email: z.string().email(tv('user.email')),
    phone: z.string().optional(),
    preferredContactMethod: ContactMethod
  })
})
type User = z.infer<typeof UserSchema>

const defaultUser = {
  name: '',
  surname: '',
  isAcceptingTerms: false,
  contact: {
    email: '',
    phone: '',
    preferredContactMethod: 'email'
  }
} as User
export default function UserForm() {
  const form = useAppForm({
    defaultValues: defaultUser,
    validators: {
      onChange: UserSchema
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
        <form.SubmitButton>Submit</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
