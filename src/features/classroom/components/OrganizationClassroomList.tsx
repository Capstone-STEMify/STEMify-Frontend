'use client'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Input } from '@/components/shadcn/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { ClassroomCard } from '@/components/shared/card/ClassroomCard'
import ClassroomPage from '@/features/classroom/components/list/ClassroomTable'
import { formatDate, formatDateV2 } from '@/utils/index'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

export default function OrganizationClassroomList() {
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
  const classes = [
    {
      id: 1,
      category: 'JAVA FUNDAMENTAL',
      duration: '24 Hours',
      title: 'Contextual understanding and how to use the adobe illustrator',
      buttonText: 'START THE CLASS',
      buttonColor: 'bg-teal-500',
      students: [
        { id: 1, name: 'Student 1', avatar: '/diverse-students-studying.png' },
        { id: 2, name: 'Student 2', avatar: '/diverse-students-studying.png' },
        { id: 3, name: 'Student 3', avatar: '/diverse-students-studying.png' }
      ],
      bgColor: 'bg-teal-600'
    },
    {
      id: 2,
      category: 'UX FUNDAMENTAL',
      duration: '20 Hours',
      title: 'Introduction to foundation of desk design and how to present',
      buttonText: 'UPCOMING CLASS',
      buttonColor: 'bg-orange-400',
      students: [
        { id: 1, name: 'Student 1', avatar: '/diverse-students-studying.png' },
        { id: 2, name: 'Student 2', avatar: '/diverse-students-studying.png' },
        { id: 3, name: 'Student 3', avatar: '/diverse-students-studying.png' }
      ],
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      borderColor: 'border border-gray-200'
    },
    {
      id: 3,
      category: 'UX FUNDAMENTAL',
      duration: '22 Hours',
      title: 'Basic illustration and how to use the adobe illustrator',
      buttonText: 'UPCOMING CLASS',
      buttonColor: 'bg-orange-400',
      students: [
        { id: 1, name: 'Student 1', avatar: '/diverse-students-studying.png' },
        { id: 2, name: 'Student 2', avatar: '/diverse-students-studying.png' },
        { id: 3, name: 'Student 3', avatar: '/diverse-students-studying.png' }
      ],
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      borderColor: 'border border-gray-200'
    }
  ]

  return (
    <main className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex items-end justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>Upcoming class</h1>
            <p className='text-gray-600'>Today, you have 3 upcoming class</p>
          </div>
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
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {classes.map((classItem) => (
            <ClassroomCard key={classItem.id} {...classItem} />
          ))}
        </div>
        <ClassroomPage />
      </div>
    </main>
  )
}
