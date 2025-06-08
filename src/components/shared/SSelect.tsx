import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

type SelectItemProps = {
  value: string
  content: string
}

type SSelectProps = {
  items: SelectItemProps[]
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function SSelect({ items, placeholder, value, onChange }: SSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-full bg-white/80 !ring-0 !ring-offset-0 backdrop-blur-md focus:!ring-0 focus:!outline-none sm:w-[200px]'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className='bg-white/90 backdrop-blur-md'>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.content}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
