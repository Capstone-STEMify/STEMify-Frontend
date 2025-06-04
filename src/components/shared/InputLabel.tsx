import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

type InputWithLabelProps = {
  label: string
  type?: string
  placeholder?: string
  id?: string
  className?: string
}

export function InputWithLabel({ id, label, type, placeholder }: InputWithLabelProps) {
  return (
    <div className={`grid w-full max-w-sm items-center gap-3`}>
      <Label htmlFor='email'>{label}</Label>
      <Input type={type} id={id} placeholder={placeholder} />
    </div>
  )
}
