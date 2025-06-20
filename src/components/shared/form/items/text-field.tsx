import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'

type TextFieldProps = {
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const TextField = ({ label, ...inputProps }: TextFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <div className='space-y-1'>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...inputProps}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
