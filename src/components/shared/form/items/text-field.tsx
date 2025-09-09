import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'

type TextFieldProps = {
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function TextField({ label, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string | number>()

  return (
    <div className='space-y-2'>
      <Label className='text-base' htmlFor={field.name}>
        {label}
      </Label>
      <Input
        id={field.name}
        value={field.state.value ?? ''}
        onChange={(e) => {
          const value =
            inputProps.type === 'number' ? (e.target.value === '' ? undefined : e.target.valueAsNumber) : e.target.value
          field.handleChange(value ?? '')
        }}
        onBlur={field.handleBlur}
        {...inputProps}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
