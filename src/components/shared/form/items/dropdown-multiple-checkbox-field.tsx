'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label } from '@/components/shadcn/label'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from './field-errors'
import { cn } from '@/utils/shadcn/utils'
import { on } from 'events'
import { useTranslations } from 'next-intl'

type DropdownMultipleCheckboxFieldProps = {
  label?: string
  description?: string
  options: {
    value: string
    label: string
  }[]
  placeholder?: string
  maxHeight?: string
  onChange?: (value: any) => void
}

export const DropdownMultipleCheckboxField = ({
  label,
  description,
  options,
  placeholder = 'Select options...',
  maxHeight = '180px',
  onChange
}: DropdownMultipleCheckboxFieldProps) => {
  const tc = useTranslations('common.select')
  const field = useFieldContext<number[]>()
  const [open, setOpen] = useState(false)
  const selectedValues = field.state.value ?? []

  const toggle = (value: number, checked: boolean) => {
    const newValue = checked ? [...selectedValues, value] : selectedValues.filter((v) => v !== value)
    field.handleChange(newValue)
    onChange?.(newValue)
  }

  return (
    <div className='space-y-2'>
      {label && <Label className='text-base font-medium'>{label}</Label>}
      {description && <p className='text-muted-foreground text-xs'>{description}</p>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
            {selectedValues.length > 0 ? `${selectedValues.length} ${tc('selected')}` : tc('placeholder')}
            <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-2'>
          <ScrollArea style={{ maxHeight }}>
            <div className='space-y-2'>
              {options.map((opt) => {
                const checked = selectedValues.includes(Number(opt.value))
                return (
                  <div
                    key={opt.value}
                    className={cn(
                      'hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors',
                      checked && 'bg-muted/60'
                    )}
                    onClick={() => toggle(Number(opt.value), !checked)}
                  >
                    <Checkbox
                      checked={checked}
                      id={`${field.name}-${opt.value}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(Number(opt.value), !checked)
                      }}
                    />
                    <Label
                      htmlFor={`${field.name}-${opt.value}`}
                      className='flex-1 cursor-pointer text-sm select-none'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {opt.label}
                    </Label>

                    {checked && <Check className='text-primary h-4 w-4' />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
