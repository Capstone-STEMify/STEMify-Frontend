import { Input } from '@/components/shadcn/input'
import { formatDateV2 } from '@/utils/index'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Button } from '@/components/shadcn/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/shadcn/calendar'

export default function ClassroomCalendar() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now()))
  const [month, setMonth] = useState<Date | undefined>(date)
  const [value, setValue] = useState(formatDateV2(date))

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false
    }
    return !isNaN(date.getTime())
  }
  return (
    <div className='relative flex gap-2'>
      <Input
        id='date'
        value={value}
        placeholder='June 01, 2025'
        className='bg-background pr-10'
        onChange={(e) => {
          const date = new Date(e.target.value)
          setValue(e.target.value)
          if (isValidDate(date)) {
            setDate(date)
            setMonth(date)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id='date-picker' variant='ghost' className='absolute top-1/2 right-2 size-6 -translate-y-1/2'>
            <CalendarIcon className='size-3.5' />
            <span className='sr-only'>Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='end' alignOffset={-8} sideOffset={10}>
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              setDate(date)
              setValue(formatDateV2(date))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
