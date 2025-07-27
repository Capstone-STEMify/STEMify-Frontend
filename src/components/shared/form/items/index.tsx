import { CheckboxField } from '@/components/shared/form/items/checkbox-field'
import ImageField from '@/components/shared/form/items/image-field'
import { MultipleCheckboxField } from '@/components/shared/form/items/multiple-checkbox-field'
import { RadioField } from '@/components/shared/form/items/radio-field'
import { SelectField } from '@/components/shared/form/items/select-field'
import { SubmitButton } from '@/components/shared/form/items/submit-button'
import { TextAreaField } from '@/components/shared/form/items/text-area'
import { TextField } from '@/components/shared/form/items/text-field'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import FileField from './file-field'

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
    SelectField,
    CheckboxField,
    MultipleCheckboxField,
    RadioField,
    ImageField,
    FileField
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})
