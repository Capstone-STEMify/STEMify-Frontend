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
import { Badge } from '@/components/shadcn/badge'
import { useTranslations } from 'next-intl'

type Option = {
  value: number | string
  label: string
  subLabel?: string
  imageUrl?: string
  status?: string
  date?: string
}

type Props = {
  options: Option[]
  value: string | null
  onChange: (val: string) => void
  placeholder?: string
  label?: string
}

export function SingleSelectWithSearch({ options, value, onChange, placeholder = 'Select...', label }: Props) {
  const tc = useTranslations('common')
  const [open, setOpen] = useState(false)

  const selected = options.find((opt) => opt.value === value)

  return (
    <div className='w-full'>
      {label && <label className='mb-2 block text-sm font-medium text-gray-700'>{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='h-10 w-full justify-between rounded-lg border-gray-200 bg-white px-3 text-left font-normal hover:bg-gray-50'
          >
            {selected ? (
              <div className='flex items-center gap-2.5'>
                <Avatar className='h-6 w-6 shrink-0'>
                  {selected.imageUrl ? (
                    <AvatarImage src={selected.imageUrl} alt={selected.label} />
                  ) : (
                    <AvatarFallback className='bg-sky-100 text-xs font-semibold text-sky-600'>
                      {selected.label[0]?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className='text-md truncate font-semibold text-gray-900'>{selected.label}</span>
                {selected.status && (
                  <Badge className='ml-auto shrink-0 bg-sky-100 text-xs text-blue-800'>{selected.status}</Badge>
                )}
              </div>
            ) : (
              <span className='text-sm text-gray-400'>{placeholder}</span>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 text-gray-400' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='p-0'
          align='start'
          sideOffset={4}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <Command className='rounded-lg border-0'>
            <CommandInput placeholder={tc('search.placeholder')} className='h-10 border-b' />
            <CommandEmpty className='py-6 text-center text-sm text-gray-500'>{tc('search.noResults')}</CommandEmpty>
            <CommandList className='max-h-[300px]'>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value.toString()}
                    onSelect={() => {
                      onChange(opt.value.toString())
                      setOpen(false)
                    }}
                    className='flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-gray-50'
                  >
                    <Avatar className='h-7 w-7 shrink-0'>
                      {opt.imageUrl ? (
                        <AvatarImage src={opt.imageUrl} alt={opt.label} />
                      ) : (
                        <AvatarFallback className='bg-sky-100 text-xs font-semibold text-sky-600'>
                          {opt.label[0]?.toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className='flex min-w-0 flex-1 flex-col'>
                      <div className='flex items-center justify-between gap-2'>
                        <div>
                          <span className='truncate text-sm font-medium text-gray-900'>{opt.label}</span>
                          {opt.date ? (
                            <p className='truncate text-xs text-gray-500'>{opt.date}</p>
                          ) : opt.subLabel ? (
                            <p className='truncate text-xs text-gray-500'>{opt.subLabel}</p>
                          ) : null}
                        </div>
                        {opt.status && (
                          <Badge className='shrink-0 bg-sky-100 text-xs text-blue-800'>{opt.status}</Badge>
                        )}
                      </div>
                    </div>

                    {value === opt.value && <Check className='h-4 w-4 shrink-0 text-sky-500' />}
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
