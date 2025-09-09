import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'

type TextAreaProps = {
  label?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextAreaField = ({ label, ...inputProps }: TextAreaProps) => {
  const field = useFieldContext<string>()

  return (
    <div className='space-y-1'>
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
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
