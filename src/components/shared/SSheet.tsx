'use client'

import React from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/shadcn/sheet'
import { Button } from '@/components/shadcn/button'

type SSheetProps = {
  title: string
  description?: string
  triggerLabel?: string
  triggerIcon?: React.ReactNode
  children: React.ReactNode
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  triggerClassName?: string
}

export default function SSheet({
  title,
  description,
  triggerLabel = 'Open Sheet',
  triggerIcon,
  children,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Close',
  triggerClassName
}: SSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className={triggerClassName}>
          {triggerIcon}
          {triggerLabel}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className='grid flex-1 auto-rows-min gap-6 px-4 py-4'>{children}</div>

        <SheetFooter>
          <Button type='submit' onClick={onSubmit}>
            {submitLabel}
          </Button>
          <SheetClose asChild>
            <Button variant='outline'>{cancelLabel}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
