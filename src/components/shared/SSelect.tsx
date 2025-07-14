import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

type SelectItemProps = {
  value: string
  label: string
}

type SSelectProps = {
  placeholder: string
  value: string
  options: SelectItemProps[]
  onChange: (value: string) => void
  onOpen?: (open: boolean) => void
}

export default function SSelect({ options, placeholder, value, onChange, onOpen }: SSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} onOpenChange={onOpen}>
      <SelectTrigger className='w-full bg-white/80 !ring-0 !ring-offset-0 backdrop-blur-md focus:!ring-0 focus:!outline-none'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className='bg-white/90 backdrop-blur-md'>
        <SelectGroup>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
