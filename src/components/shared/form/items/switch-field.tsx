import { useId } from 'react'
import { Label } from '@/components/shadcn/label'
import { Switch } from '@/components/shadcn/switch'
import { useFieldContext } from '@/components/shared/form/items'

type SwitchFieldProps = {
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export default function SwitchField({ label, ...switchProps }: SwitchFieldProps) {
  const field = useFieldContext<boolean>()
  const id = useId()

  return (
    <div className={`flex items-center space-x-2 ${switchProps.className}`}>
      <Switch
        id={id}
        checked={!!field.state.value}
        onCheckedChange={(v) => field.setValue(v)}
        disabled={switchProps.disabled}
        required={switchProps.required}
      />
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  )
}
