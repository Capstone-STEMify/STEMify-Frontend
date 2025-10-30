'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Label } from '@/components/shadcn/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { useFieldContext } from '@/components/shared/form/items'

type DatePickerFieldProps = {
  label?: string
  placeholder?: string
}

export function DatePickerField({ label = 'Select Date', placeholder = 'Select date' }: DatePickerFieldProps) {
  const field = useFieldContext<Date | null>()
  const [open, setOpen] = React.useState(false)

  return (
    <div className='flex flex-col space-y-2'>
      {label && (
        <Label htmlFor={field.name} className='text-base'>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            id={field.name}
            className='w-48 justify-between font-normal'
            onClick={() => setOpen((o) => !o)}
          >
            {field.state.value ? new Date(field.state.value).toLocaleDateString() : placeholder}
            <ChevronDownIcon className='ml-2 h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto' align='start'>
          <Calendar
            mode='single'
            selected={field.state.value ?? undefined}
            onSelect={(date) => {
              field.handleChange(date ?? null)
              setOpen(false)
            }}
            captionLayout='dropdown'
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
