import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react'
import { OrganizationSubscription } from '@/features/subscription/types/subscription.type'
import { formatDateV2 } from '@/utils/index'
import { getStatusBadgeClass } from '@/utils/badgeColor'

type SubscriptionInfoProps = {
  subscription: OrganizationSubscription
}

export default function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const {
    planName,
    planBillingCycle,
    status,
    startDate,
    endDate,
    grossAmount,
    netAmount,
    discountPercent,
    maxStudentSeats,
    maxTeacherSeats,
    currentStudentSeats,
    currentTeacherSeats,
    curriculumCount,
    curriculums
  } = subscription

  const totalSeats = maxStudentSeats + maxTeacherSeats
  const activeSeats = currentStudentSeats + currentTeacherSeats
  const savingsAmount = grossAmount - netAmount

  return (
    <Card className='py-5'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-base'>Subscription Details</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex items-center gap-2'>
          <h3 className='text-xl font-semibold'>{planName}</h3>
          <Badge variant='secondary' className={getStatusBadgeClass(status)}>
            {status}
          </Badge>
        </div>
        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <div className='space-y-2'>
                <div className='flex items-baseline gap-2'>
                  <p className='text-2xl font-bold'>{netAmount.toLocaleString()} đ</p>
                  {discountPercent && (
                    <Badge variant='secondary' className='bg-green-100 text-xs text-green-700'>
                      -{discountPercent}%
                    </Badge>
                  )}
                </div>
                {grossAmount !== netAmount && (
                  <p className='text-sm text-gray-600'>
                    <span className='text-muted-foreground line-through'>{grossAmount.toLocaleString()}đ</span>
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Student seats</span>
                <span className='font-medium'>
                  {currentStudentSeats}/{maxStudentSeats}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Teacher seats</span>
                <span className='font-medium'>
                  {currentTeacherSeats}/{maxTeacherSeats}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Total seats</span>
                <span className='font-medium'>
                  {activeSeats}/{totalSeats}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Billing cycle</span>
                <Badge variant='secondary' className='bg-blue-500 text-white'>
                  {planBillingCycle}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Contract & Curriculum Info */}
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Gross amount</span>
              <span className='font-medium'>{grossAmount.toLocaleString()} đ</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Net amount</span>
              <span className='font-medium'>{netAmount.toLocaleString()} đ</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Start date</span>
              <span className='font-medium'>{formatDateV2(new Date(startDate))}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>End date</span>
              <span className='font-medium'>{formatDateV2(new Date(endDate))}</span>
            </div>

            {/* Curriculums */}
            {curriculumCount > 0 && (
              <>
                <div className='mt-4 border-t pt-3'>
                  <div className='mb-2 flex items-center gap-2'>
                    <BookOpen className='h-4 w-4 text-purple-500' />
                    <span className='font-medium'>Included Curriculums ({curriculumCount})</span>
                  </div>
                  <div className='space-y-2'>
                    {curriculums.map((c) => (
                      <div
                        key={c.id}
                        className='flex items-center justify-start gap-4 rounded-md border bg-gray-50 px-3 py-2'
                      >
                        <>
                          {c.imageUrl ? (
                            <img
                              src={c.imageUrl}
                              alt={c.title}
                              className='h-12 w-12 flex-shrink-0 rounded object-cover'
                            />
                          ) : (
                            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gradient-to-br from-sky-50 to-sky-400'>
                              <GraduationCap className='h-6 w-6 text-blue-500' />
                            </div>
                          )}
                        </>
                        <div>
                          <p className='text-sm font-medium'>{c.title}</p>
                          <p className='text-xs text-gray-600'>
                            {c.code} • {c.courseCount} courses
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
