import { CheckboxField } from '@/components/shared/form/items/checkbox-field'
import FileField from '@/components/shared/form/items/file-field'
import ImageField from '@/components/shared/form/items/image-field'
import { MarkdownEditorField } from '@/components/shared/form/items/MarkdownEditorField'
import { MultipleCheckboxField } from '@/components/shared/form/items/multiple-checkbox-field'
import { RadioField } from '@/components/shared/form/items/radio-field'
import { SelectField } from '@/components/shared/form/items/select-field'
import { SubmitButton } from '@/components/shared/form/items/submit-button'
import { TextAreaField } from '@/components/shared/form/items/text-area'
import { TextField } from '@/components/shared/form/items/text-field'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

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
    FileField,
    MarkdownEditorField
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})
