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
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Separator } from '@/components/shadcn/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Plus } from 'lucide-react'

export default function CreateSubscriptionPlanSheet() {
  return (
    <Sheet>
      {/* 🔹 Trigger button */}
      <SheetTrigger asChild>
        <Button className='gap-2 bg-blue-500 text-white hover:bg-blue-600'>
          <Plus className='h-4 w-4' />
          Add New Plan
        </Button>
      </SheetTrigger>

      {/* 🔹 Sheet content */}
      <SheetContent className='overflow-y-auto sm:max-w-2xl'>
        <SheetHeader className='pb-0'>
          <SheetTitle>Create subscription plan</SheetTitle>
          <SheetDescription>Define your plan details, pricing conditions, and billing cycle.</SheetDescription>
        </SheetHeader>

        {/* 🔸 BASIC SECTION */}
        <div className='space-y-8 px-1'>
          <section>
            <h3 className='text-foreground mb-2 text-base font-semibold'>Basic</h3>
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='planName'>Name</Label>
                <Input id='planName' placeholder='Type a name' />
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox id='defaultPlan' />
                <Label htmlFor='defaultPlan' className='text-sm'>
                  Mark as default plan
                </Label>
                <Button variant='link' className='h-auto p-0 text-sm text-blue-500'>
                  Set up order
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* 🔸 SEATS & PRICING SECTION */}
          <section>
            <h3 className='text-foreground mb-2 text-base font-semibold'>Seats &amp; Pricing</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='minSeats'>Min N of Seats</Label>
                <Input id='minSeats' type='number' placeholder='e.g. 5' />
              </div>
              <div>
                <Label htmlFor='maxSeats'>Max N of Seats</Label>
                <Input id='maxSeats' type='number' placeholder='e.g. 250' />
              </div>
            </div>

            {/* Pricing conditions */}
            <div className='mt-6 space-y-4'>
              <h4 className='text-foreground text-sm font-semibold'>Pricing Conditions</h4>

              <div className='text-muted-foreground text-sm font-medium'>If</div>

              <div className='grid grid-cols-1 items-end gap-4 md:grid-cols-3'>
                <div>
                  <Label>Condition</Label>
                  <Select defaultValue='less-than'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select condition' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='less-than'>Less than</SelectItem>
                      <SelectItem value='greater-than'>Greater than</SelectItem>
                      <SelectItem value='equal'>Equal to</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Number of users</Label>
                  <Input placeholder='e.g. 200' type='number' />
                </div>

                <div>
                  <Label>Rate per seat</Label>
                  <Input placeholder='e.g. 10' type='number' />
                </div>
              </div>

              <Button variant='outline' size='sm' className='mt-2'>
                + Add new condition
              </Button>
            </div>
          </section>

          <Separator />

          {/* 🔸 BILLING TERMS SECTION */}
          <section>
            <h3 className='text-foreground mb-2 text-base font-semibold'>Billing terms</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Billing period</Label>
                <Input type='number' placeholder='e.g. 12' />
              </div>
              <div>
                <Label>Charges each</Label>
                <Input type='number' placeholder='e.g. 1' />
              </div>
            </div>

            <div className='mt-4'>
              <Label className='mb-1 block'>Overage</Label>
              <div className='flex items-center gap-6'>
                <div className='flex items-center space-x-2'>
                  <input type='radio' id='fullPrice' name='overage' defaultChecked className='accent-blue-600' />
                  <Label htmlFor='fullPrice'>Full Price</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input type='radio' id='prorated' name='overage' className='accent-blue-600' />
                  <Label htmlFor='prorated'>Prorated</Label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 🔸 Footer */}
        <SheetFooter className='mt-8'>
          <Button
            type='submit'
            className='bg-blue-600 text-white hover:bg-blue-700'
            onClick={() => console.log('Create plan')}
          >
            Create Plan
          </Button>
          <SheetClose asChild>
            <Button variant='outline'>Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
