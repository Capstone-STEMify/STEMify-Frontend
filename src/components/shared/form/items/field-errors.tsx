import { AnyFieldMeta } from '@tanstack/react-form'
import { ZodError } from 'zod'

type FieldErrorsProps = {
  meta: AnyFieldMeta
}
export const FieldErrors = ({ meta }: FieldErrorsProps) => {
  if (!meta.isTouched) return null
  return meta.errors.map(({ message }: ZodError, index) => (
    <p key={index} className='text-destructive text-sm font-medium'>
      {message}
    </p>
  ))
}
