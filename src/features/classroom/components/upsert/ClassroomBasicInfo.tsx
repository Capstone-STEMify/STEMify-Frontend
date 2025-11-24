'use client'

import React, { useEffect, useState } from 'react'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Calendar } from '@/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Button } from '@/components/shadcn/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/shadcn/utils'
import { useTranslations } from 'next-intl'

type ClassroomBasicInfoProps = {
  form: any
  organizationSubscriptionData: any
  gradeOptions: { label: string; value: string }[]
  minDate: Date | undefined
  maxDate: Date | undefined
}

export default function ClassroomBasicInfo({ form, gradeOptions, minDate, maxDate }: ClassroomBasicInfoProps) {
  const tClassroom = useTranslations('classroom.create.step1')

  const DURATION_OPTIONS = [
    { label: `4 ${tClassroom('weeks')}`, value: '4' },
    { label: `6 ${tClassroom('weeks')}`, value: '6' },
    { label: `8 ${tClassroom('weeks')}`, value: '8' },
    { label: `10 ${tClassroom('weeks')}`, value: '10' },
    { label: `${tClassroom('custom')}`, value: 'custom' }
  ]

  const [name, setName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [grade, setGrade] = useState('')
  const [description, setDescription] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('8')
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 56)))

  const isCustomDuration = durationWeeks === 'custom'

  // Sync với form khi mount (cho trường hợp edit)
  useEffect(() => {
    const formName = form.getFieldValue('name')
    const formClassCode = form.getFieldValue('classCode')
    const formGrade = form.getFieldValue('grade')
    const formDescription = form.getFieldValue('description')
    const formDuration = form.getFieldValue('durationWeeks')
    const formStartDate = form.getFieldValue('startDate')
    const formEndDate = form.getFieldValue('endDate')

    if (formName) setName(formName)
    if (formClassCode) setClassCode(formClassCode)
    if (formGrade) setGrade(formGrade)
    if (formDescription) setDescription(formDescription)
    if (formDuration) setDurationWeeks(formDuration)
    if (formStartDate) setStartDate(new Date(formStartDate))
    if (formEndDate) setEndDate(new Date(formEndDate))
  }, [])

  // Tự động tính endDate khi thay đổi duration hoặc startDate
  useEffect(() => {
    if (durationWeeks !== 'custom' && startDate) {
      const weeks = parseInt(durationWeeks)
      if (!isNaN(weeks)) {
        const end = new Date(startDate)
        end.setDate(end.getDate() + weeks * 7)
        setEndDate(end)
        form.setFieldValue('endDate', end.toISOString())
      }
    }
  }, [durationWeeks, startDate])

  // Sync state với form
  useEffect(() => {
    form.setFieldValue('name', name)
  }, [name])

  useEffect(() => {
    form.setFieldValue('classCode', classCode)
  }, [classCode])

  useEffect(() => {
    form.setFieldValue('grade', grade)
  }, [grade])

  useEffect(() => {
    form.setFieldValue('description', description)
  }, [description])

  useEffect(() => {
    form.setFieldValue('durationWeeks', durationWeeks)
  }, [durationWeeks])

  useEffect(() => {
    if (startDate) {
      form.setFieldValue('startDate', startDate.toISOString())
    }
  }, [startDate])

  useEffect(() => {
    if (endDate) {
      form.setFieldValue('endDate', endDate.toISOString())
    }
  }, [endDate])

  return (
    <div className='animate-fadeIn mx-auto max-w-6xl space-y-6'>
      <div className='rounded-lg border bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>{tClassroom('basicInfo')}</h3>

        <div className='space-y-4'>
          {/* Classroom Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              {tClassroom('className')} <span className='text-red-500'>*</span>
            </Label>
            <Input id='name' placeholder='e.g., STEM-1A-2025' value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Row 1: class code + Grade */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='classCode'>
                {tClassroom('classCode')} <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='classCode'
                placeholder='e.g., STEM-1A-2025'
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='grade'>
                {tClassroom('gradeLevel')} <span className='text-red-500'>*</span>
              </Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder={tClassroom('selectGrade')} />
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
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>{tClassroom('description')}</Label>
            <Textarea
              id='description'
              placeholder={tClassroom('descriptionPlaceholder')}
              rows={4}
              className='resize-none'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Duration Dropdown */}
          <div className='space-y-2'>
            <Label htmlFor='duration'>
              {tClassroom('duration')} <span className='text-red-500'>*</span>
            </Label>
            <Select value={durationWeeks} onValueChange={setDurationWeeks}>
              <SelectTrigger>
                <SelectValue placeholder={tClassroom('selectDuration')} />
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

          {/* Row 2: Dates */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Start Date */}
            <div className='space-y-2'>
              <Label>
                {tClassroom('startDate')} <span className='text-red-500'>*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {startDate ? format(startDate, 'MM/dd/yyyy') : <span>Select start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const effectiveMinDate = minDate && minDate > today ? minDate : today
                      return date < effectiveMinDate || (maxDate ? date > maxDate : false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className='space-y-2'>
              <Label>
                {tClassroom('endDate')} <span className='text-red-500'>*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                    disabled={!isCustomDuration}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {endDate ? format(endDate, 'MM/dd/yyyy') : <span>Select end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => {
                      return (minDate ? date < minDate : false) || (maxDate ? date > maxDate : false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
