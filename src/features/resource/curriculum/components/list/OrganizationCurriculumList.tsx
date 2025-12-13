'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo } from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDate, useStatusTranslation } from '@/utils/index'
import { useGetCurriculumsByOrganizationIdQuery } from '@/features/organization/api/organizationApi'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { BookOpen, Calendar, GraduationCap, Filter } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'
import { setSelectedCurriculum } from '@/features/resource/curriculum/slice/curriculumSlice'
import { OrganizationCurriculum } from '@/features/organization/types/organization.type'

export function getDominantSubscriptionGroup(groups: OrganizationCurriculum['subscriptionGroups']) {
  return (
    groups.find((g) => g.status === 'ACTIVE') ||
    groups.find((g) => g.status === 'UPCOMING') ||
    groups.find((g) => g.status === 'EXPIRED')
  )
}

export default function OrganizationCurriculumList() {
  const t = useTranslations('organization.curriculum')
  const tc = useTranslations('common')
  const statusTranslate = useStatusTranslation()
  const router = useRouter()
  const locale = useLocale()
  const dispatch = useAppDispatch()

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus>(SubscriptionStatus.ACTIVE)

  const { data: curriculumData, isLoading } = useGetCurriculumsByOrganizationIdQuery(
    { organizationId: selectedOrganizationId!, status: selectedStatus },
    { skip: !selectedOrganizationId }
  )
  const curriculums = curriculumData?.data.curriculums || []

  const statusOptions: Array<SubscriptionStatus> = [
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.PENDING,
    SubscriptionStatus.CANCELLED,
    SubscriptionStatus.EXPIRED
  ]

  return (
    <div className='mx-auto max-w-7xl px-5'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg'>
            <GraduationCap className='h-7 w-7 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
            <p className='mt-1 text-sm text-gray-600'>
              {t('orgCurriculumDescription', { count: curriculumData?.data.curriculums.length || 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className='mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
            <Filter className='h-4 w-4' />
            <span>{t('filterByStatus')}:</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tc(`status2.${status.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className='mt-3 text-sm text-gray-600'>
          {t('showing')} <span className='font-semibold text-gray-900'>{curriculums.length}</span> {t('results')}
        </div>
      </div>

      {/* Empty State for Filtered Results */}
      {!curriculumData || curriculums.length === 0 ? (
        <div className='py-12'>
          <SEmpty title={t('noResultsForFilter')} />
        </div>
      ) : (
        /* Curriculum Grid */
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4'>
          {curriculums.map((curriculum) => {
            const displayGroup = getDominantSubscriptionGroup(curriculum.subscriptionGroups)

            return (
              <CardLayout
                key={curriculum.id}
                className='cursor-pointer hover:-translate-y-1'
                imageSrc={curriculum.imageUrl}
                onClick={() => {
                  dispatch(setSelectedCurriculum(curriculum))
                  router.push(`/${locale}/organization/curriculum/${curriculum.id}`)
                }}
                badge={
                  <Badge className={`${getStatusBadgeClass(selectedStatus)} shadow-sm`}>
                    {tc(`status2.${selectedStatus.toLowerCase()}`)}
                  </Badge>
                }
                action={<Badge variant={'secondary'}>{curriculum.code}</Badge>}
              >
                <div>
                  {/* Title */}
                  <h2 className='mb-1 line-clamp-2 text-lg font-bold text-gray-900 transition-colors'>
                    {curriculum.title}
                  </h2>

                  <div className='space-y-2'>
                    {/* Course Count */}
                    <div className='flex items-center gap-2 text-sm text-gray-700'>
                      <BookOpen className='h-4 w-4 text-blue-600' />
                      <span className='font-medium'>
                        {curriculum.courseCount} {t('courses')}
                      </span>
                    </div>
                    {/* Dates */}
                    {displayGroup && (
                      <>
                        {displayGroup.subscriptions.length === 1 ? (
                          <>
                            <div className='flex items-center gap-2 text-sm'>
                              <span className='text-gray-600'>{t('startDate')}:</span>
                              <span className='font-medium text-gray-900'>
                                {formatDate(displayGroup.subscriptions[0].startDate, { locale })}
                              </span>
                            </div>

                            <div className='flex items-center gap-2 text-sm'>
                              <span className='text-gray-600'>{t('endDate')}:</span>
                              <span className='font-medium text-gray-900'>
                                {formatDate(displayGroup.subscriptions[0].endDate, { locale })}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className='flex items-center gap-2 text-sm'>
                            <span className='text-gray-600'>{t('accessPeriod')}:</span>
                            <span className='font-medium text-gray-900'>
                              {formatDate(
                                new Date(
                                  Math.min(...displayGroup.subscriptions.map((s) => new Date(s.startDate).getTime()))
                                ),
                                { locale }
                              )}
                              {' – '}
                              {formatDate(
                                new Date(
                                  Math.max(...displayGroup.subscriptions.map((s) => new Date(s.endDate).getTime()))
                                ),
                                { locale }
                              )}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardLayout>
            )
          })}
        </div>
      )}
    </div>
  )
}
