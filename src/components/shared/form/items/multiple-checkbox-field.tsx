import { Checkbox } from '@/components/shadcn/checkbox'
import { FieldErrors } from './field-errors'
import { Label } from '@/components/shadcn/label'
import { useFieldContext } from '@/components/shared/form/items'

type CheckboxOption = {
  value: string
  label: string
}

type CheckboxFieldProps = {
  label?: string
  options: CheckboxOption[]
  description?: string
  className?: string
}

export const MultipleCheckboxField = ({
  label,
  options,
  description,
  className
}: CheckboxFieldProps) => {
  const field = useFieldContext<string[]>()

  const handleToggle = (optionValue: string, checked: boolean) => {
    const currentValues = field.state.value || []

    const newValue = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((val) => val !== optionValue)

    field.handleChange(newValue)
  }

  return (
    <div className='space-y-2'>
      <div className='space-y-1'>
        {label && <Label>{label}</Label>}
        {description && <p className='text-muted-foreground text-sm'>{description}</p>}
      </div>

      <div className={className}>
        {options.map((option) => (
          <div key={option.value} className='flex items-center space-x-2'>
            <Checkbox
              id={`${field.name}-${option.value}`}
              checked={!!field.state.value?.includes(option.value)}
              onCheckedChange={(checked) => handleToggle(option.value, checked === true)}
              onBlur={field.handleBlur}
            />
            <Label htmlFor={`${field.name}-${option.value}`} className='cursor-pointer'>
              {option.label}
            </Label>
          </div>
        ))}
      </div>

      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
