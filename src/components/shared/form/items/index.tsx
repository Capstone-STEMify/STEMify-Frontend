import { CheckboxField } from '@/components/shared/form/items/checkbox-field'
import FileField from '@/components/shared/form/items/file-field'
import ImageField from '@/components/shared/form/items/image-field'
import { MultipleCheckboxField } from '@/components/shared/form/items/multiple-checkbox-field'
import { RadioField } from '@/components/shared/form/items/radio-field'
import { SelectField } from '@/components/shared/form/items/select-field'
import { SubmitButton } from '@/components/shared/form/items/submit-button'
import { TextAreaField } from '@/components/shared/form/items/text-area'
import { TextField } from '@/components/shared/form/items/text-field'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import MultiImageField from '@/components/shared/form/items/multi-image-field'
import SwitchField from '@/components/shared/form/items/switch-field'
import { DropdownMultipleCheckboxField } from '@/components/shared/form/items/dropdown-multiple-checkbox-field'
import { DatePickerField } from '@/components/shared/form/items/date-picker-field'
import { SingleSelectWithSearch } from '@/components/shared/SingleSelectWithSearch'

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
    DatePickerField,
    SelectField,
    CheckboxField,
    MultipleCheckboxField,
    RadioField,
    ImageField,
    FileField,
    MultiImageField,
    SwitchField,
    DropdownMultipleCheckboxField,
    SingleSelectWithSearch
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})
