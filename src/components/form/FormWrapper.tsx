// components/form/FormWrapper.tsx
import { FormProvider, useForm, SubmitHandler, FieldValues, DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType, TypeOf } from 'zod'
import React from 'react'

type Props<TSchema extends ZodType<any, any, any>> = {
  schema: TSchema
  onSubmit: SubmitHandler<TypeOf<TSchema>>
  defaultValues?: DefaultValues<TypeOf<TSchema>>
  children: React.ReactNode
}

export const FormWrapper = <TSchema extends ZodType<any, any, any>>({
  schema,
  onSubmit,
  defaultValues,
  children
}: Props<TSchema>) => {
  const methods = useForm<TypeOf<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  )
}
