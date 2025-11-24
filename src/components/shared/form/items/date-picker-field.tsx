'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Label } from '@/components/shadcn/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { useFieldContext } from '@/components/shared/form/items'
import { Matcher } from 'react-day-picker'

type DatePickerFieldProps = {
  label?: string
  placeholder?: string
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
}

export function DatePickerField({
  label = 'Select Date',
  placeholder = 'Select date',
  onChange,
  minDate,
  maxDate
}: DatePickerFieldProps) {
  const field = useFieldContext<Date | null>()
  const [open, setOpen] = React.useState(false)

  return (
    <div className='flex w-full flex-col space-y-2'>
      {label && (
        <Label htmlFor={field.name} className='text-sm font-medium text-gray-700'>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            id={field.name}
            className='h-10 w-full justify-between rounded-lg border-gray-300 bg-white px-3 text-left font-normal hover:bg-gray-50'
            onClick={() => setOpen((o) => !o)}
          >
            <span className='text-sm text-gray-900'>
              {field.state.value ? new Date(field.state.value).toLocaleDateString() : ''}
            </span>
            {!field.state.value && <span className='text-sm text-gray-400'>{placeholder}</span>}
            <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 text-gray-400' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0' align='start' sideOffset={4}>
          <Calendar
            mode='single'
            selected={field.state.value ?? undefined}
            disabled={
              [minDate ? { before: minDate } : undefined, maxDate ? { after: maxDate } : undefined].filter(
                Boolean
              ) as Matcher[]
            }
            onSelect={(date) => {
              const selectedDate = date ?? null
              field.handleChange(selectedDate)

              if (onChange) {
                onChange(selectedDate)
              }

              setOpen(false)
            }}
            captionLayout='dropdown'
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
