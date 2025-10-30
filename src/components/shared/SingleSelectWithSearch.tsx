import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/shadcn/button'

type Option = {
  value: number | string
  label: string
  subLabel?: string
  imageUrl?: string
}

type Props = {
  options: Option[]
  value: string | null
  onChange: (val: string) => void
  placeholder?: string
  label?: string
}

export function SingleSelectWithSearch({ options, value, onChange, placeholder = 'Select...', label }: Props) {
  const [open, setOpen] = useState(false)

  const selected = options.find((opt) => opt.value === value)

  return (
    <div className='space-y-2'>
      {label && <label className='text-md font-medium'>{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {selected ? (
              <div className='flex items-center gap-2'>
                {selected.imageUrl && (
                  <Avatar className='h-5 w-5'>
                    <AvatarImage src={selected.imageUrl} alt={selected.label} />
                    <AvatarFallback>{selected.label[0]}</AvatarFallback>
                  </Avatar>
                )}
                <span>{selected.label}</span>
              </div>
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
            <ChevronsUpDown className='text-muted-foreground ml-2 h-4 w-4' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-[300px] p-0'>
          <Command>
            <CommandInput placeholder='Search...' />
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      onChange(opt.value.toString())
                      setOpen(false)
                    }}
                    className='flex items-center gap-3'
                  >
                    <Avatar className='h-6 w-6'>
                      <AvatarImage src={opt.imageUrl} alt={opt.label} />
                      <AvatarFallback>{opt.label}</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col'>
                      <span>{opt.label}</span>
                      {opt.subLabel && <span className='text-muted-foreground text-xs'>{opt.subLabel}</span>}
                    </div>

                    {value === opt.value && <Check className='text-primary ml-auto h-4 w-4' />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
