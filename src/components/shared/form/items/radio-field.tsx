import { Label } from '@/components/shadcn/label'
import { FieldErrors } from './field-errors'
import { useFieldContext } from '@/components/shared/form/items'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'

type RadioOption = {
  value: string
  label: string
}

type RadioFieldProps = {
  label?: string
  options: RadioOption[]
  description?: string
  className?: string
}

export const RadioField = ({ label, options, description, className }: RadioFieldProps) => {
  const field = useFieldContext<string>()

  const handleChange = (value: string) => {
    field.handleChange(value)
  }

  return (
    <div className={'space-y-2'}>
      <div className='space-y-1'>
        <Label>{label}</Label>
        {description && <p className='text-muted-foreground text-sm'>{description}</p>}
      </div>

      <RadioGroup
        value={field.state.value ?? ''}
        onValueChange={handleChange}
        onBlur={field.handleBlur}
        className={className}
      >
        {options.map((option) => (
          <div key={option.value} className='flex items-center space-x-2'>
            <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
            <Label htmlFor={`${field.name}-${option.value}`} className='cursor-pointer'>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
