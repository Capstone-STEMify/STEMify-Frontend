'use client'

import React from 'react'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import SAvatar from '@/components/shared/SAvatar'
import { Plus } from 'lucide-react'
import SSheet from '@/components/shared/SSheet'

type PricingTierUpsertProps = {
  onSubmit?: () => void
}

export default function PricingTierUpsert({ onSubmit }: PricingTierUpsertProps) {
  return (
    <div className='mb-4 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <span>Organization:</span>
        <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2'>
          <SAvatar src='https://github.com/shadcn.png' fallback='CN' />
          <SAvatar src='https://github.com/shadcn.png' fallback='CN' />
          <SAvatar src='https://github.com/shadcn.png' fallback='CN' />
        </div>
      </div>

      <SSheet
        title='Add Pricing Tier'
        description='Create or update pricing tiers here.'
        triggerLabel='Add Pricing Tier'
        triggerIcon={<Plus className='mr-1 h-3 w-3' />}
        triggerClassName='gap-2 bg-transparent'
        onSubmit={onSubmit}
        submitLabel='Save changes'
      >
        <div className='grid gap-3'>
          <Label htmlFor='minSeat'>Min Seats</Label>
          <Input id='minSeat' type='number' placeholder='Enter min seat' />
        </div>

        <div className='grid gap-3'>
          <Label htmlFor='maxSeat'>Max Seats</Label>
          <Input id='maxSeat' type='number' placeholder='Enter max seat' />
        </div>

        <div className='grid gap-3'>
          <Label htmlFor='price'>Price per Seat ($)</Label>
          <Input id='price' type='number' step='0.01' placeholder='Enter price' />
        </div>
      </SSheet>
    </div>
  )
}
