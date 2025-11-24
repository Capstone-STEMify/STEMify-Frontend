'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Progress } from '@/components/shadcn/progress'
import {
  CheckCircle,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Search,
  UserPlus,
  Calendar,
  CreditCard
} from 'lucide-react'
import { useModal } from '@/providers/ModalProvider'
import { useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { formatDate } from '@/utils/index'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useEffect } from 'react'
import { SCard } from '@/components/shared/card/SCard'
import CardLayout from '@/components/shared/card/CardLayout'
import LicenseAssignmentList from '@/features/license-assignment/components/list/licenseAssignmentList'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import BackButton from '@/components/shared/button/BackButton'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'

export default function OrganizationSubscriptionDetail() {
  const { openModal } = useModal()
  const { subscriptionId } = useParams()

  const { data: subscription, isLoading: isLoadingSubscription } = useGetSubscriptionByIdQuery(Number(subscriptionId))

  const getRemainingMonths = (endDate: string | undefined) => {
    if (!endDate) return 0
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const months = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30))
    return months > 0 ? months : 0
  }

  const calculateProgressValue = (startDate: Date, endDate: Date, today: Date = new Date()): number => {
    const start = startDate.getTime()
    const end = endDate.getTime()
    const current = today.getTime()

    if (current <= start) return 0
    if (current >= end) return 100

    const totalDuration = end - start
    const elapsed = current - start

    const progress = (elapsed / totalDuration) * 100
    return Math.round(progress)
  }

  if (isLoadingSubscription) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!subscription?.data) {
    return <SEmpty title='Organization Subscription Not Found' />
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-3'>
              <BackButton className='mt-2 bg-slate-200' />
              <h1 className='text-foreground text-3xl font-bold tracking-tight'>Subscription Overview</h1>
            </div>
            <p className='text-muted-foreground mt-1'>Manage your organization's subscription and users</p>
          </div>
          {/* Action Buttons */}
          <div className='flex gap-3 lg:items-end'>
            {/* <Button className='bg-sky-400 shadow-lg'>Change Plan</Button> */}
            <Button variant='outline' className='shadow-lg'>
              Cancel Subscription
            </Button>
          </div>
        </div>

        {/* Current Plan Card - Enhanced */}
        <Card className='overflow-hidden bg-sky-100 shadow-md'>
          <CardContent className='p-8'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
              <div className='flex-1 space-y-6'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                    <CreditCard className='h-6 w-6' />
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-xl font-semibold'>Current Plan</h2>
                      <Badge className={`${getStatusBadgeClass(subscription?.data.status)}`}>
                        <span className='mr-1'>●</span> {subscription?.data.status}
                      </Badge>
                    </div>
                    {subscription?.data.status == SubscriptionStatus.PENDING && (
                      <p className='text-sm'>
                        This subscription will be activated on{' '}
                        <span className='font-semibold'>{formatDate(subscription.data.startDate.toString())}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='rounded-xl bg-slate-50 p-4 shadow-sm backdrop-blur-sm'>
                    <p className='text-sm font-medium'>Package Details</p>
                    <p className='mt-1 text-2xl font-bold'>{subscription?.data.planName}</p>
                    <p className='mt-1 text-sm'>
                      {subscription?.data.netAmount} đ/
                      {subscription?.data.planBillingCycle}
                    </p>
                  </div>
                  <div className='rounded-xl bg-slate-50 p-4 shadow-sm backdrop-blur-sm'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <p className='text-sm font-medium'>Expires On</p>
                    </div>
                    <p className='mt-1 text-2xl font-bold'>
                      {subscription?.data.endDate ? formatDate(subscription.data.endDate.toString()) : '—'}
                    </p>
                    <p className='mt-1 text-sm'>{getRemainingMonths(subscription?.data.endDate)} months remaining</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm font-semibold'>
                    <span className=''>Subscription Period</span>
                  </div>
                  <Progress
                    value={calculateProgressValue(
                      new Date(subscription.data.startDate),
                      new Date(subscription.data.endDate)
                    )}
                    className='h-3 bg-white [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-500'
                  />
                  <div className='flex justify-between text-xs font-semibold'>
                    <span>
                      {subscription?.data.startDate ? formatDate(subscription.data.startDate.toString()) : '—'}
                    </span>
                    <span>{subscription?.data.endDate ? formatDate(subscription.data.endDate.toString()) : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid - Enhanced */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Assigned Licenses */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white'>
                  <Users className='h-6 w-6' />
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Assigned Licenses</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-3xl font-bold'>
                {subscription?.data.currentStudentSeats + subscription?.data.currentTeacherSeats}{' '}
                <span className='text-muted-foreground text-lg font-normal'>
                  of {subscription?.data.maxStudentSeats + subscription?.data.maxTeacherSeats}
                </span>
              </p>
              <Progress
                value={
                  ((subscription?.data.currentStudentSeats + subscription?.data.currentTeacherSeats) /
                    (subscription?.data.maxStudentSeats + subscription?.data.maxTeacherSeats)) *
                  100
                }
                className='h-2 bg-blue-100 [&>div]:bg-blue-600'
              />
              <p className='text-muted-foreground text-xs'>
                {subscription?.data.maxStudentSeats +
                  subscription?.data.maxTeacherSeats -
                  (subscription?.data.currentStudentSeats + subscription?.data.currentTeacherSeats)}{' '}
                licenses remaining
              </p>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-amber-100'>
                  <GraduationCap className='h-6 w-6' />
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Total Students</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>
                {subscription?.data.currentStudentSeats}{' '}
                <span className='text-muted-foreground text-lg font-normal'>
                  of {subscription?.data.maxStudentSeats}
                </span>
              </p>
              <Progress
                value={(subscription?.data.currentStudentSeats / subscription?.data.maxStudentSeats) * 100}
                className='h-2 bg-blue-100 [&>div]:bg-blue-600'
              />
              <p className='text-muted-foreground text-xs'>
                {subscription?.data.maxStudentSeats - subscription?.data.currentStudentSeats} seats remaining
              </p>
            </CardContent>
          </Card>

          {/* Total Teachers */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-emerald-100'>
                  <Users className='h-6 w-6' />
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Total Teachers</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>
                {subscription?.data.currentTeacherSeats}{' '}
                <span className='text-muted-foreground text-lg font-normal'>
                  of {subscription?.data.maxTeacherSeats}
                </span>
              </p>
              <Progress
                value={(subscription?.data.currentTeacherSeats / subscription?.data.maxTeacherSeats) * 100}
                className='h-2 bg-blue-100 [&>div]:bg-blue-600'
              />
              <p className='text-muted-foreground text-xs'>
                {subscription?.data.maxTeacherSeats - subscription?.data.currentTeacherSeats} seats remaining
              </p>
            </CardContent>
          </Card>

          {/* Total Curricula */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-purple-100'>
                  <BookOpen className='h-6 w-6' />
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Total Curricula</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>{subscription?.data.curriculumCount}</p>
              <p className='text-muted-foreground text-xs'>Including 10 courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Section */}
        <LicenseAssignmentList />

        {/* Curriculum Section */}
        <Card className='py-4 shadow-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>Included Curricula</CardTitle>
            <p className='text-muted-foreground mt-1 mb-4 text-sm'>
              Courses and learning materials available in your subscription
            </p>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {subscription?.data.curriculums.map((curriculum) => (
                <CardLayout
                  key={curriculum.id}
                  className='rounded-2xl border-none shadow-sm'
                  imageSrc={curriculum.imageUrl}
                  footer={
                    <div className='flex items-center gap-2'>
                      <Badge className='bg-sky-custom-300'>Age 6-12</Badge>
                      <Badge className='bg-rose-100 text-rose-700'>10+ Courses</Badge>
                    </div>
                  }
                >
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>{curriculum.code}</p>
                    <h3 className='text-md line-clamp-1 font-semibold text-gray-900'>{curriculum.title}</h3>
                  </div>
                </CardLayout>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
