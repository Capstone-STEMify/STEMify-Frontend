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
}

export const SelectField = ({ label, options, placeholder }: SelectFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <div className='space-y-2'>
      <div className='space-y-1'>
        <Label htmlFor={field.name} className='text-lg font-bold'>
          {label}
        </Label>
        <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
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
