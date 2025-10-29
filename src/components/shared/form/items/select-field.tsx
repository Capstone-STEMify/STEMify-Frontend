import { useFieldContext } from '@/components/shared/form/items'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { FieldErrors } from '@/components/shared/form/items/field-errors'

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  label: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

export const SelectField = ({ label, options, placeholder, disabled }: SelectFieldProps) => {
  const field = useFieldContext<string>()
  const stringValue = field.state.value !== undefined && field.state.value !== null ? String(field.state.value) : ''
  return (
    <div className='space-y-2'>
      <div className='space-y-2'>
        <Label htmlFor={field.name} className='text-base'>
          {label}
        </Label>
        <Select
          key={stringValue}
          value={stringValue}
          onValueChange={(value) => field.handleChange(value)}
          disabled={disabled}
        >
          <SelectTrigger id={field.name} onBlur={field.handleBlur} className='w-full'>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
