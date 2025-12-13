'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Progress } from '@/components/shadcn/progress'
import { Users, GraduationCap, BookOpen, Calendar, CreditCard } from 'lucide-react'
import { useGetSubscriptionByIdQuery, useUpdateSubscriptionMutation } from '@/features/subscription/api/subscriptionApi'
import { useParams } from 'next/navigation'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { formatDate, useStatusTranslation } from '@/utils/index'
import SEmpty from '@/components/shared/empty/SEmpty'
import CardLayout from '@/components/shared/card/CardLayout'
import LicenseAssignmentList from '@/features/license-assignment/components/list/licenseAssignmentList'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import BackButton from '@/components/shared/button/BackButton'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { useLocale, useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'

export default function OrganizationSubscriptionDetail() {
  const locale = useLocale()
  const ts = useTranslations('subscription.detail')
  const to = useTranslations('organization')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { subscriptionId } = useParams()
  const statusTranslations = useStatusTranslation()
  const { openModal } = useModal()

  const { data: subscription, isLoading: isLoadingSubscription } = useGetSubscriptionByIdQuery(Number(subscriptionId))
  const [updateSubscription] = useUpdateSubscriptionMutation()

  const getRemainingMonths = (endDate?: string) => {
    if (!endDate) return 0

    const end = new Date(endDate)
    const now = new Date()

    if (isNaN(end.getTime())) return 0
    if (end <= now) return 0

    const yearsDiff = end.getFullYear() - now.getFullYear()
    const monthsDiff = end.getMonth() - now.getMonth()

    let totalMonths = yearsDiff * 12 + monthsDiff

    if (end.getDate() < now.getDate()) {
      totalMonths -= 1
    }

    return totalMonths > 0 ? totalMonths : 0
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

  const handleCancelSubscription = () => {
    openModal('confirm', {
      title: tt('confirmMessage.cancelledSubscriptions'),
      message: tt('confirmMessage.cancelledSubscriptions'),
      onConfirm: () =>
        updateSubscription({
          subscriptionId: Number(subscriptionId),
          body: { status: SubscriptionStatus.CANCELLED }
        })
    })
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
  console.log('Start:', subscription.data.startDate, new Date(subscription.data.startDate))
  console.log('End:', subscription.data.endDate, new Date(subscription.data.endDate))

  console.log(calculateProgressValue(new Date(subscription.data.startDate), new Date(subscription.data.endDate)))
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-3'>
              <BackButton className='mt-2 bg-slate-200' />
              <h1 className='text-foreground text-3xl font-bold tracking-tight'>{ts('overview')}</h1>
            </div>
            <p className='text-muted-foreground mt-1'>{ts('overviewDescription')}</p>
          </div>
          {/* Action Buttons */}
          <div className='flex gap-3 lg:items-end'>
            {/* <Button className='bg-sky-400 shadow-lg'>Change Plan</Button> */}
            <Button variant='outline' className='shadow-lg' onClick={handleCancelSubscription}>
              {tc('button.cancelSubscription')}
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
                      <h2 className='text-xl font-semibold'>{to('detail.subscription.currentPlan.title')}</h2>
                      <Badge className={`${getStatusBadgeClass(subscription?.data.status)}`}>
                        <span className='mr-1'>●</span> {statusTranslations(subscription?.data.status)}
                      </Badge>
                    </div>
                    {subscription?.data.status == SubscriptionStatus.PENDING && (
                      <p className='text-sm'>
                        {to('detail.subscription.currentPlan.pendingActivation')}{' '}
                        <span className='font-semibold'>{formatDate(subscription.data.startDate.toString())}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='rounded-xl bg-slate-50 p-4 shadow-sm backdrop-blur-sm'>
                    <p className='text-sm font-medium'>{to('detail.subscription.currentPlan.packageDetails')}</p>
                    <p className='mt-1 text-2xl font-bold'>{subscription?.data.planName}</p>
                    <p className='mt-1 text-sm'>
                      {subscription?.data.netAmount} đ/
                      {to(`detail.subscription.currentPlan.${subscription?.data.planBillingCycle.toLowerCase()}`)}
                    </p>
                  </div>
                  <div className='rounded-xl bg-slate-50 p-4 shadow-sm backdrop-blur-sm'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <p className='text-sm font-medium'>{to('detail.subscription.currentPlan.expiredOn')}</p>
                    </div>
                    <p className='mt-1 text-2xl font-bold'>
                      {subscription?.data.endDate ? formatDate(subscription.data.endDate, { locale }) : '—'}
                    </p>
                    <p className='mt-1 text-sm'>
                      {getRemainingMonths(subscription?.data.endDate)}{' '}
                      {to('detail.subscription.currentPlan.monthRemaing')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm font-semibold'>
                    <span className=''>{to('detail.subscription.currentPlan.subscriptionPeriod')}</span>
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
                      {subscription?.data.startDate ? formatDate(subscription.data.startDate, { locale }) : '—'}
                    </span>
                    <span>{subscription?.data.endDate ? formatDate(subscription.data.endDate, { locale }) : '—'}</span>
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
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>
                {to('detail.subscription.currentPlan.assignedLicenses')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-3xl font-bold'>
                {subscription?.data.currentStudentSeats + subscription?.data.currentTeacherSeats}{' '}
                <span className='text-muted-foreground text-lg font-normal'>
                  {to('detail.subscription.currentPlan.of')}{' '}
                  {subscription?.data.maxStudentSeats + subscription?.data.maxTeacherSeats}
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
                {to('detail.subscription.currentPlan.licenseRemaing')}
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
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>
                {to('detail.subscription.currentPlan.totalStudent')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>
                {subscription?.data.currentStudentSeats}{' '}
                <span className='text-muted-foreground text-lg font-normal'>
                  {to('detail.subscription.currentPlan.of')} {subscription?.data.maxStudentSeats}
                </span>
              </p>
              <Progress
                value={(subscription?.data.currentStudentSeats / subscription?.data.maxStudentSeats) * 100}
                className='h-2 bg-blue-100 [&>div]:bg-blue-600'
              />
              <p className='text-muted-foreground text-xs'>
                {subscription?.data.maxStudentSeats - subscription?.data.currentStudentSeats}{' '}
                {to('detail.subscription.currentPlan.seatRemaining')}
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
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>
                {to('detail.subscription.currentPlan.totalTeacher')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>
                {subscription?.data.currentTeacherSeats}{' '}
                <span className='text-muted-foreground text-lg font-normal'>
                  {to('detail.subscription.currentPlan.of')} {subscription?.data.maxTeacherSeats}
                </span>
              </p>
              <Progress
                value={(subscription?.data.currentTeacherSeats / subscription?.data.maxTeacherSeats) * 100}
                className='h-2 bg-blue-100 [&>div]:bg-blue-600'
              />
              <p className='text-muted-foreground text-xs'>
                {subscription?.data.maxTeacherSeats - subscription?.data.currentTeacherSeats}{' '}
                {to('detail.subscription.currentPlan.seatRemaining')}
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
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>
                {to('detail.subscription.currentPlan.totalCurricula')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>{subscription?.data.curriculumCount}</p>
              <p className='text-muted-foreground text-xs'>
                {to('detail.subscription.currentPlan.includingCurricula', {
                  curriculum: subscription?.data.curriculumCount
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Section */}
        <LicenseAssignmentList />

        {/* Curriculum Section */}
        <Card className='py-4 shadow-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>{to('detail.subscription.curricula.includedCurricula')}</CardTitle>
            <p className='text-muted-foreground mt-1 mb-4 text-sm'>{to('detail.subscription.curricula.description')}</p>
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
                      <Badge className='bg-rose-100 text-rose-700'>
                        {curriculum.courseCount} {to('detail.subscription.curricula.courses')}
                      </Badge>
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
