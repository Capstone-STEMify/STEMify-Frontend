'use client'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/shadcn/command'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import { CheckIcon, ChevronsUpDown, X, BookOpen, GraduationCap, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/shadcn/utils'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface Curriculum {
  id: number
  title: string
  imageUrl?: string
  courseCount: number
}

interface CurriculumSelectorProps {
  curriculums: Curriculum[]
  selectedCurriculumIds: number[]
  onCurriculumChange: (ids: number[]) => void
  maxSelection: number // Curriculum count from plan
}

export default function CurriculumSelector({
  curriculums,
  selectedCurriculumIds,
  onCurriculumChange,
  maxSelection
}: CurriculumSelectorProps) {
  const to = useTranslations('organization.subscription.create')
  const [open, setOpen] = useState(false)

  const selectedCurriculums = curriculums.filter((curriculum) => selectedCurriculumIds.includes(curriculum.id))
  const isMaxReached = selectedCurriculumIds.length >= maxSelection

  const handleSelect = (curriculumId: number) => {
    const isSelected = selectedCurriculumIds.includes(curriculumId)

    if (isSelected) {
      // Remove curriculum
      onCurriculumChange(selectedCurriculumIds.filter((id) => id !== curriculumId))
    } else {
      // Add curriculum - check if max reached
      if (selectedCurriculumIds.length >= maxSelection) {
        toast.error(`You can only select up to ${maxSelection} curriculum(s)`)
        return
      }
      onCurriculumChange([...selectedCurriculumIds, curriculumId])
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <BookOpen className='h-5 w-5 text-slate-600' />
          <Label className='text-base font-semibold text-slate-900'>
            {to('curriculumSelection.header')} <span className='text-red-500'>*</span>
          </Label>
        </div>
        <div className='text-sm text-slate-500'>
          {selectedCurriculumIds.length} / {maxSelection} {to('curriculumSelection.selected')}
        </div>
      </div>

      {/* Info message */}
      <div className='flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700'>
        <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
        <p>{to('curriculumSelection.description', { maxCurriculums: maxSelection })}</p>
      </div>

      <div className='space-y-2'>
        <Label className='text-sm font-medium text-slate-700'>{to('curriculumSelection.label')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='h-auto min-h-[40px] w-full justify-between py-2'
            >
              {selectedCurriculumIds.length > 0 ? (
                <div className='flex flex-wrap gap-1'>
                  {selectedCurriculumIds.map((id) => {
                    const curriculum = curriculums.find((c) => c.id === id)
                    return curriculum ? (
                      <Badge
                        key={id}
                        variant='secondary'
                        className='mr-1 mb-1'
                        onClick={(e) => {
                          e.stopPropagation()
                          onCurriculumChange(selectedCurriculumIds.filter((cId) => cId !== id))
                        }}
                      >
                        {curriculum.title}
                        <X className='ml-1 h-3 w-3 cursor-pointer' />
                      </Badge>
                    ) : null
                  })}
                </div>
              ) : (
                <span className='text-slate-500'>{to('curriculumSelection.placeholder')}</span>
              )}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full p-0' align='start'>
            <Command>
              <CommandInput placeholder={to('curriculumSelection.searchCurriculum')} />
              <CommandEmpty>{to('curriculumSelection.noData')}</CommandEmpty>
              <CommandGroup className='max-h-64 overflow-auto'>
                {curriculums.map((curriculum) => {
                  const isSelected = selectedCurriculumIds.includes(curriculum.id)
                  const isDisabled = !isSelected && isMaxReached

                  return (
                    <CommandItem
                      key={curriculum.id}
                      onSelect={() => handleSelect(curriculum.id)}
                      className={cn('cursor-pointer', isDisabled && 'cursor-not-allowed opacity-50')}
                      disabled={isDisabled}
                    >
                      <div className='flex flex-1 items-center gap-2'>
                        <div
                          className={cn(
                            'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                            isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className='h-4 w-4' />
                        </div>
                        {curriculum.imageUrl ? (
                          <img
                            src={curriculum.imageUrl}
                            alt={curriculum.title}
                            className='h-8 w-8 rounded object-cover'
                          />
                        ) : (
                          <div className='flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-sky-100 to-sky-300'>
                            <GraduationCap className='h-4 w-4 text-blue-600' />
                          </div>
                        )}
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>{curriculum.title}</span>
                        </div>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Curriculums Display */}
      {selectedCurriculums.length > 0 && (
        <div className='mt-4 space-y-3'>
          <Label className='text-sm font-medium text-slate-700'>{to('curriculumSelection.selectedCurriculums')}</Label>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            {selectedCurriculums.map((curriculum) => (
              <div
                key={curriculum.id}
                className='group relative flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3'
              >
                {/* Remove button */}
                <button
                  type='button'
                  onClick={() => onCurriculumChange(selectedCurriculumIds.filter((id) => id !== curriculum.id))}
                  className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600'
                >
                  <X className='h-3 w-3' />
                </button>

                {curriculum.imageUrl ? (
                  <img
                    src={curriculum.imageUrl}
                    alt={curriculum.title}
                    className='h-12 w-12 flex-shrink-0 rounded object-cover'
                  />
                ) : (
                  <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gradient-to-br from-sky-50 to-sky-400'>
                    <GraduationCap className='h-6 w-6 text-blue-500' />
                  </div>
                )}
                <div className='flex flex-col'>
                  <p className='font-medium text-slate-900'>{curriculum.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
