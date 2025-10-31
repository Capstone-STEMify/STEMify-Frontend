import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Calendar } from 'lucide-react'

type SubscriptionInfoProps = {
  subscriptionId?: number
}

export default function SubscriptionInfo({ subscriptionId }: SubscriptionInfoProps) {
  return (
    <Card className='py-5'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-base'>Price plan info</CardTitle>
            <Badge variant='secondary' className='bg-blue-500 text-white'>
              Default
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Left Column - Plan Details */}
          <div className='space-y-4'>
            <div>
              <div className='mb-4 flex items-center gap-2'>
                <h3 className='text-xl font-semibold'>Standard Annual</h3>
                <Badge variant='secondary' className='bg-green-100 text-green-700'>
                  Active
                </Badge>
              </div>
              <p className='text-2xl font-bold'>
                $8
                <span className='text-muted-foreground text-sm font-normal'> per seat per month</span>
              </p>
            </div>

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Seats</span>
                <span className='font-medium'>5-250</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Billing users</span>
                <span className='font-medium'>300</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Billing period</span>
                <span className='font-medium'>Annual</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Charges</span>
                <span className='font-medium'>12 months</span>
              </div>
            </div>
          </div>

          {/* Right Column - Invoice & Contract Info */}
          <div className='space-y-3 text-sm'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <span className='text-muted-foreground'>Upcoming Invoice: 5/10/20</span>
              </div>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Payment net</span>
              <span className='font-medium'>30 days</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Overage</span>
              <span className='font-medium'>Prorated</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Contract effective date</span>
              <span className='font-medium'>10/28/20</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Contract end date</span>
              <span className='font-medium'>10/28/21</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
