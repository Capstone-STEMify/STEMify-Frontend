import { useGetClassroomByIdQuery, useUpdateClassroomMutation } from '@/features/classroom/api/classroomApi'
import { Grade } from '@/features/classroom/types/classroom.type'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Calendar } from '@/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Button } from '@/components/shadcn/button'
import { CalendarIcon } from 'lucide-react'
import { format, parse } from 'date-fns'
import { cn } from '@/utils/shadcn/utils'
import { toast } from 'sonner'

type UpdateClassroomOrganizationBasicInfoProps = {
  classroomId: number
  onSuccess?: () => void
}

const DURATION_OPTIONS = [
  { label: '4 Weeks', value: '4' },
  { label: '6 Weeks', value: '6' },
  { label: '8 Weeks', value: '8' },
  { label: '10 Weeks', value: '10' },
  { label: 'Custom', value: 'custom' }
]

export default function UpdateClassroomOrganizationBasicInfo({
  classroomId,
  onSuccess
}: UpdateClassroomOrganizationBasicInfoProps) {
  const [name, setName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [grade, setGrade] = useState('')
  const [description, setDescription] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const { data: classroomData, isLoading } = useGetClassroomByIdQuery(classroomId!, { skip: !classroomId })
  const [updateClassroom, { isLoading: isUpdating }] = useUpdateClassroomMutation()

  const isCustomDuration = durationWeeks === 'custom'

  const gradeOptions = Object.entries(Grade).map(([key, value]) => ({
    label: value,
    value: value
  }))

  // Load data khi có classroomData
  useEffect(() => {
    if (classroomData?.data) {
      const p = classroomData.data
      console.log('API Grade:', p.grade)
      console.log('Select Options:', gradeOptions)

      setName(p.name)
      setClassCode(p.classCode)
      setGrade(p.grade)
      setDescription(p.description || '')

      // Parse dates từ format MM/dd/yyyy
      if (p.startDate) {
        try {
          const parsedStartDate = parse(p.startDate, 'MM/dd/yyyy', new Date())
          setStartDate(parsedStartDate)
        } catch (error) {
          console.error('Error parsing start date:', error)
        }
      }

      if (p.endDate) {
        try {
          const parsedEndDate = parse(p.endDate, 'MM/dd/yyyy', new Date())
          setEndDate(parsedEndDate)
        } catch (error) {
          console.error('Error parsing end date:', error)
        }
      }

      // Tính duration weeks
      if (p.startDate && p.endDate) {
        try {
          const start = parse(p.startDate, 'MM/dd/yyyy', new Date())
          const end = parse(p.endDate, 'MM/dd/yyyy', new Date())
          const diffTime = Math.abs(end.getTime() - start.getTime())
          const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

          if ([4, 6, 8, 10].includes(diffWeeks)) {
            setDurationWeeks(diffWeeks.toString())
          } else {
            setDurationWeeks('custom')
          }
        } catch (error) {
          console.error('Error calculating duration:', error)
          setDurationWeeks('custom')
        }
      }
    }
  }, [classroomData])

  // Tự động tính endDate khi thay đổi duration hoặc startDate
  useEffect(() => {
    if (durationWeeks && durationWeeks !== 'custom' && startDate) {
      const weeks = parseInt(durationWeeks)
      if (!isNaN(weeks)) {
        const end = new Date(startDate)
        end.setDate(end.getDate() + weeks * 7)
        setEndDate(end)
      }
    }
  }, [durationWeeks, startDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !classCode || !grade || !startDate || !endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await updateClassroom({
        id: classroomId,
        body: {
          name,
          classCode,
          grade,
          description,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }).unwrap()

      toast.success('Classroom updated successfully')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to update classroom')
    }
  }

  if (isLoading) {
    return <div className='py-8 text-center text-gray-500'>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Classroom Name */}
      <div className='space-y-2'>
        <Label htmlFor='name' className='text-sm font-medium text-gray-900'>
          Classroom Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='name'
          placeholder='e.g., Math Class 2024'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='h-11'
          required
        />
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-sm font-medium text-gray-900'>
          Description
        </Label>
        <Textarea
          id='description'
          placeholder='Brief description of this classroom...'
          rows={3}
          className='resize-none'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Grade + Class Code */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='grade' className='text-sm font-medium text-gray-900'>
            Grade Level <span className='text-red-500'>*</span>
          </Label>
          <Select key={grade} value={grade} onValueChange={setGrade}>
            <SelectTrigger className='h-11'>
              <SelectValue placeholder='Select grade' />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='classCode' className='text-sm font-medium text-gray-900'>
            Class Code <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='classCode'
            placeholder='e.g., STEM-1A-2025'
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className='h-11'
            required
          />
        </div>
      </div>

      {/* Duration */}
      <div className='space-y-2'>
        <Label htmlFor='duration' className='text-sm font-medium text-gray-900'>
          Duration <span className='text-red-500'>*</span>
        </Label>
        <Select key={durationWeeks} value={durationWeeks} onValueChange={setDurationWeeks}>
          <SelectTrigger className='h-11 md:w-1/2'>
            <SelectValue placeholder='Select duration' />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Start Date */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-gray-900'>
            Start Date <span className='text-red-500'>*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn('h-11 w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {startDate ? format(startDate, 'MM/dd/yyyy') : <span>Select start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar mode='single' selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-gray-900'>
            End Date <span className='text-red-500'>*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'h-11 w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                  !isCustomDuration && 'bg-gray-50'
                )}
                disabled={!isCustomDuration}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {endDate ? format(endDate, 'MM/dd/yyyy') : <span>Select end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar mode='single' selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end border-t pt-6'>
        <Button type='submit' disabled={isUpdating} className='bg-amber-500 px-8 hover:bg-amber-600'>
          {isUpdating ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  )
}
