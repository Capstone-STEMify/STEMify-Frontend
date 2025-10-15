'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Progress } from '@/components/shadcn/progress'
import CardLayout from '@/components/shared/card/CardLayout'
import SearchBar from '@/components/shared/search/SearchBar'
import { useModal } from '@/providers/ModalProvider'

export default function OrganizationSubscriptionDetail() {
  const { openModal } = useModal()
  return (
    <div className='space-y-6 p-6'>
      {/* Current Plan Card */}
      <Card className='bg-gradient-to-r from-sky-50 to-sky-100 p-4 shadow-md'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-lg font-medium'>Current plan</p>
              <Badge className='bg-green-100 text-green-700'>● Active</Badge>
            </div>

            <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-md'>Basic Package</p>
                <p className='text-lg font-semibold'>100K đ/Seat/6 Months</p>
              </div>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-md'>Expired at</p>
                <p className='text-lg font-semibold'>Oct 26, 2025</p>
              </div>
            </div>
          </div>
          <div className='flex items-end gap-2'>
            <Button className='bg-gradient-to-r from-amber-400 to-amber-500' size='sm'>
              Send Renewal Request
            </Button>
            <Button className='bg-gradient-to-r from-sky-400 to-sky-600' size='sm'>
              Change plan
            </Button>
            <Button className='bg-gray-100 text-black' size='sm'>
              Cancel Subscription
            </Button>
          </div>
        </div>
        <div className='mt-4'>
          <Progress value={50} className='h-2 bg-gray-100 [&>div]:!bg-green-500' />
          <div className='text-muted-foreground flex flex-row justify-between text-sm'>
            <p>01/06/2025</p>
            <p>01/12/2025</p>
          </div>
        </div>
      </Card>
      {/* Metrics Summary */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='py-4 shadow-md'>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm'>Assigned Licenses</CardTitle>
            <p className='text-2xl font-bold'>80 of 100</p>
          </CardHeader>
          <CardContent className='mt-3 text-sm text-green-600'>
            <Progress value={75} className='h-1 bg-sky-100 [&>div]:!bg-blue-500' />
            <p className='text-muted-foreground mt-1 text-xs'>20 licenses remaining</p>
          </CardContent>
        </Card>
        <Card className='py-4 shadow-md'>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm'>Total Students</CardTitle>
            <p className='text-2xl font-bold'>60</p>
            <p className='text-muted-foreground text-xs'>Down 20% this period ↘</p>
          </CardHeader>
          <CardContent className='text-sm text-red-600'>-20%</CardContent>
        </Card>
        <Card className='py-4 shadow-md'>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm'>Total Teachers</CardTitle>
            <p className='text-2xl font-bold'>10</p>
            <p className='text-muted-foreground text-xs'>Strong user retention ↗</p>
          </CardHeader>
          <CardContent className='text-sm text-green-600'>+12.5%</CardContent>
        </Card>
        <Card className='py-4 shadow-md'>
          <CardHeader>
            <CardTitle className='text-muted-foreground text-sm'>Total Curricula</CardTitle>
            <p className='text-2xl font-bold'>2</p>
            <p className='text-muted-foreground text-xs'>Including 10 courses</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <div className='flex justify-between'>
        <SearchBar placeholder='Search users...' className='w-1/2' />
        <Button variant='outline' size='sm' onClick={() => openModal('uploadCSV')}>
          + Invite Users
        </Button>
      </div>
      <div className='space-x-2'>
        <Badge variant='default'>Users</Badge>
        <Badge variant='secondary'>Pending Invites</Badge>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-md border'>
        <div className='bg-muted grid grid-cols-6 px-4 py-2 text-sm font-medium'>
          <div className='col-span-2'>Name</div>
          <div>Email</div>
          <div>Status</div>
          <div>Account Type</div>
          <div>Date Added</div>
        </div>
        <div className='grid grid-cols-6 items-center border-t px-4 py-2 text-sm'>
          <div className='col-span-2'>Rosie</div>
          <div>rosie91@fpt.edu.vn</div>
          <div className='flex items-center gap-1 text-green-600'>
            <CheckCircle className='h-4 w-4' /> Active
          </div>
          <div>Student</div>
          <div>01/09/2025</div>
        </div>
        <div className='grid grid-cols-6 items-center border-t px-4 py-2 text-sm'>
          <div className='col-span-2'>Leo</div>
          <div>leo@example.com</div>
          <div className='flex items-center gap-1 text-green-600'>
            <CheckCircle className='h-4 w-4' /> Active
          </div>
          <div>Student</div>
          <div>01/09/2025</div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className='mt-10 flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Included Curricula</h1>
      </div>
      <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <CardLayout
          className='rounded-2xl border-none shadow-lg'
          imageSrc={'/images/fallback.png'}
          footer={
            <div className='flex items-center gap-2'>
              <Badge className='bg-sky-custom-300'>6-12+</Badge>
              <Badge>Beginner</Badge>
            </div>
          }
        >
          <div>
            <p className='text-muted-foreground text-sm font-medium'>STEM-01</p>
            <h3 className='text-md line-clamp-1 font-semibold text-gray-900'>Basic STEM</h3>
            <p className='line-clamp-2 text-sm text-gray-600'>Introduction to basic STEM concepts.</p>
          </div>
        </CardLayout>
      </div>
    </div>
  )
}
