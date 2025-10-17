'use client'

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from '@/components/shadcn/sheet'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Separator } from '@/components/shadcn/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Plus, ChevronLeft, Info, Trash2 } from 'lucide-react'

export default function CreateSubscriptionPlanSheet() {
  return (
    <Sheet>
      {/* Trigger button */}
      <SheetTrigger asChild>
        <Button className='gap-2 bg-blue-500 text-white hover:bg-blue-600'>
          <Plus className='h-4 w-4' />
          Add New Plan
        </Button>
      </SheetTrigger>

      {/* Sheet content */}
      <SheetContent className='flex flex-col overflow-y-auto sm:max-w-md'>
        <SheetHeader className='border-b pb-4'>
          <SheetTitle className='text-lg font-semibold'>Create subscription plan</SheetTitle>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4'>
          {/* BASIC SECTION */}
          <section>
            <h3 className='text-foreground mb-4 text-sm font-semibold'>Basic</h3>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='planName' className='text-muted-foreground text-sm font-normal'>
                  Name
                </Label>
                <Input id='planName' placeholder='Type a name' className='h-9' />
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Checkbox id='defaultPlan' />
                  <Label htmlFor='defaultPlan' className='text-sm font-normal'>
                    Mark as default plan
                  </Label>
                  <Info className='text-muted-foreground h-4 w-4' />
                </div>
                <Button variant='link' className='h-auto p-0 text-sm text-blue-600 hover:text-blue-700'>
                  Set up order
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* SEATS & PRICING SECTION */}
          <section>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-foreground text-sm font-semibold'>Seats &amp; Pricing</h3>
              <Button variant='link' className='h-auto gap-1 p-0 text-sm text-blue-600 hover:text-blue-700'>
                <ChevronLeft className='h-3 w-3' />
                Back to simple settings
              </Button>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='minSeats' className='text-muted-foreground text-sm font-normal'>
                  Max Teacher Seats
                </Label>
                <Input id='minSeats' type='number' defaultValue='5' className='h-9' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='maxSeats' className='text-muted-foreground text-sm font-normal'>
                  Max Student Seats
                </Label>
                <Input id='maxSeats' type='number' defaultValue='250' className='h-9' />
              </div>
            </div>

            {/* Pricing conditions */}
            <div className='mt-6 space-y-5'>
              <h4 className='text-muted-foreground text-center text-xs font-medium tracking-wide uppercase'>
                PRICING CONDITIONS
              </h4>

              <div className='border-border relative rounded-lg border px-4 pt-8 pb-6'>
                {/* If badge - overlapping top border */}
                <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                  <span className='bg-background border-border text-foreground inline-flex rounded-md border px-4 py-1 text-xs font-medium'>
                    If
                  </span>
                </div>

                <div className='space-y-4'>
                  <div className='w-full space-y-2'>
                    <Label className='text-muted-foreground text-sm font-normal'>Condition</Label>
                    <Select defaultValue='less-than'>
                      <SelectTrigger className='h-9 w-full'>
                        <SelectValue placeholder='Select condition' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='less-than'>Less than</SelectItem>
                        <SelectItem value='greater-than'>Greater than</SelectItem>
                        <SelectItem value='equal'>Equal to</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-muted-foreground text-sm font-normal'>Number of users</Label>
                    <Input placeholder='200' type='number' defaultValue='200' className='h-9' />
                  </div>
                </div>

                {/* Then badge - overlapping middle border */}
                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='border-border w-full border-t'></div>
                  </div>
                  <div className='relative flex justify-center'>
                    <span className='bg-background border-border text-foreground inline-flex rounded-md border px-4 py-1 text-xs font-medium'>
                      Then
                    </span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label className='text-muted-foreground text-sm font-normal'>Rate per seat</Label>
                  <div className='relative'>
                    <Input placeholder='E.g. 10' type='text' className='h-9 pr-8' />
                    <span className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm'>$</span>
                  </div>
                </div>

                {/* Delete button - centered */}
                <div className='flex justify-center pt-4'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='bg-muted text-muted-foreground hover:bg-muted/80 hover:text-destructive h-8 w-8 rounded-full'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='flex justify-center pt-2'>
                <Button variant='link' size='sm' className='h-auto gap-1 p-0 text-sm text-blue-600 hover:text-blue-700'>
                  <Plus className='h-4 w-4' />
                  Add new condition
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* BILLING TERMS SECTION */}
          <section>
            <h3 className='text-foreground mb-4 text-sm font-semibold'>Billing terms</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-muted-foreground text-sm font-normal'>Billing period</Label>
                <div className='flex items-center gap-2'>
                  <Input type='number' defaultValue='12' className='h-9' />
                  <span className='text-muted-foreground text-sm'>month(s)</span>
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-muted-foreground text-sm font-normal'>Charges each</Label>
                <div className='flex items-center gap-2'>
                  <Input type='number' defaultValue='1' className='h-9' />
                  <span className='text-muted-foreground text-sm'>month(s)</span>
                </div>
              </div>
            </div>

            <div className='mt-6 space-y-3'>
              <Label className='text-muted-foreground text-sm font-normal'>Overage</Label>
              <div className='flex items-center gap-6'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    id='fullPrice'
                    name='overage'
                    defaultChecked
                    className='h-4 w-4 accent-blue-600'
                  />
                  <Label htmlFor='fullPrice' className='text-sm font-normal'>
                    Full Price
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input type='radio' id='prorated' name='overage' className='h-4 w-4 accent-blue-600' />
                  <Label htmlFor='prorated' className='text-sm font-normal'>
                    Prorated
                  </Label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <SheetFooter className='flex-row gap-2 border-t'>
          <SheetClose asChild>
            <Button variant='outline' className='flex-1 bg-transparent'>
              Cancel
            </Button>
          </SheetClose>
          <Button
            className='flex-1 bg-blue-600 text-white hover:bg-blue-700'
            onClick={() => console.log('Create plan')}
          >
            Create Plan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
