import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'

type TextFieldProps<T = string> = {
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function TextField<T = string>({ label, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<T>()

  return (
    <div className='space-y-1'>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        value={field.state.value as any}
        onChange={(e) => field.handleChange(e.target.value as any)}
        onBlur={field.handleBlur}
        {...inputProps}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
