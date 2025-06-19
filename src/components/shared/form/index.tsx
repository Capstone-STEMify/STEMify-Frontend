import { CheckboxField } from '@/components/shared/form/checkbox-field'
import { SelectField } from '@/components/shared/form/select-field'
import { SubmitButton } from '@/components/shared/form/submit-button'
import { TextField } from '@/components/shared/form/text-field'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    CheckboxField
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})
