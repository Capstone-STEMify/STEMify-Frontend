'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppForm } from '@/components/shared/form/items'
import { useModal } from '@/providers/ModalProvider'
import { useCreateClassroomMutation } from '@/features/classroom/api/classroomApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { setPageIndex } from '@/features/user/slice/userSlice'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Calendar } from '@/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Button } from '@/components/shadcn/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/shadcn/utils'
import BackButton from '@/components/shared/button/BackButton'
import GroupTableWithTeacher from '@/features/group/components/list/GroupTableWithTeacher'
import { Grade } from '@/features/classroom/types/classroom.type'

type ClassroomFormData = {
  grade: string
  description?: string
  courseId: number
  organizationSubscriptionOrderId: number
  durationWeeks: string
  startDate: string
  endDate: string
  studentGroups: {
    groupCode: string
    groupName: string
    teacherId: string
    studentIds: string[]
  }[]
}

const defaultClassroomFormData: ClassroomFormData = {
  grade: '',
  description: '',
  courseId: 1,
  organizationSubscriptionOrderId: 1,
  durationWeeks: '8',
  startDate: new Date().toISOString(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 56)).toISOString(),
  studentGroups: []
}

export default function CreateClassroom() {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tClassroom = useTranslations('classroom.create')

  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const locale = useLocale()

  const [selectedGroups, setSelectedGroups] = useState<
    {
      groupCode: string
      groupName: string
      teacherId: string
      studentIds: string[]
    }[]
  >([])

  const [minDate, setMinDate] = useState<Date | undefined>(undefined)
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined)

  // Form states
  const [grade, setGrade] = useState('')
  const [description, setDescription] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('8')
  const [startDate, setStartDateState] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 56)))

  const selectedSubscriptionId = useAppSelector((state) => state.selectedOrganization.selectedSubscriptionOrderId)

  const GRADE_OPTIONS = Object.values(Grade)
    .filter((v) => typeof v === 'number')
    .map((grade) => ({
      label: `${tc('grade')} ${grade}`,
      value: grade.toString()
    }))

  const DURATION_OPTIONS = [
    { label: `4 ${tClassroom('weeks')}`, value: '4' },
    { label: `6 ${tClassroom('weeks')}`, value: '6' },
    { label: `8 ${tClassroom('weeks')}`, value: '8' },
    { label: `10 ${tClassroom('weeks')}`, value: '10' },
    { label: `${tClassroom('custom')}`, value: 'custom' }
  ]

  const isCustomDuration = durationWeeks === 'custom'

  const [createClassroom, { isLoading: isCreating }] = useCreateClassroomMutation()

  const form = useAppForm({
    defaultValues: defaultClassroomFormData,
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        courseId: Number(value.courseId),
        organizationSubscriptionOrderId: selectedSubscriptionId!,
        studentGroups: selectedGroups
      }

      const result = await createClassroom(payload).unwrap()
      toast.success(tt('successMessage.createNoTitle'))

      router.push(`/${locale}/organization/classroom`)
      closeModal()
    }
  })

  // Auto-calculate end date
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

  // Sync search
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
    if (startDate) form.setFieldValue('startDate', startDate.toISOString())
  }, [startDate])
  useEffect(() => {
    if (endDate) form.setFieldValue('endDate', endDate.toISOString())
  }, [endDate])

  return (
    <div>
      {/* Header */}
      <div className='border-b bg-gradient-to-b from-gray-50 to-white px-6 py-5'>
        <div className='mx-auto max-w-6xl'>
          <div className='flex items-center justify-between'>
            <BackButton />
            <div className='absolute left-1/2 -translate-x-1/2 text-center'>
              <h2 className='text-2xl font-bold text-gray-900'>{tClassroom('header')}</h2>
              <p className='mt-1 text-sm text-gray-500'>{tClassroom('subheader')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className='flex-1 overflow-y-auto px-6 py-6'
      >
        <div className='mx-auto max-w-6xl'>
          <div className='mb-4 space-y-2'>
            <div className='flex justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>{tClassroom('groupList')}</h2>

              <div className='flex items-center space-x-4'>
                <Label htmlFor='grade'>{tClassroom('grade')}</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder={tClassroom('grade')} />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <GroupTableWithTeacher grade={grade} onGroupsChange={(groups) => setSelectedGroups(groups)} />
          </div>

          {/* Basic Information Section */}
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-gray-900'>{tClassroom('basicInfo')}</h3>
            <div className='space-y-4 rounded-lg border bg-white p-6 shadow-sm'>
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

              {/* Duration */}
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
                <div className='space-y-2'>
                  <Label>
                    {tClassroom('startDate')} <span className='text-red-500'>*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {startDate ? format(startDate, 'MM/dd/yyyy') : <span>Select start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        captionLayout='dropdown'
                        startMonth={new Date()}
                        endMonth={new Date(2030, 11)} // December 2030
                        selected={startDate}
                        onSelect={setStartDateState}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className='space-y-2'>
                  <Label>
                    {tClassroom('endDate')} <span className='text-red-500'>*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                        disabled={!isCustomDuration}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {endDate ? format(endDate, 'MM/dd/yyyy') : <span>Select end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar mode='single' selected={endDate} onSelect={setEndDate} disabled={true} autoFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-6'>
            <form.AppForm>
              <form.SubmitButton
                loading={isCreating}
                className='bg-amber-custom-400 cursor-pointer rounded-lg px-8 py-2.5 font-medium text-white transition-colors hover:bg-amber-500'
              >
                {tc('button.create')}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </div>
      </form>
    </div>
  )
}
