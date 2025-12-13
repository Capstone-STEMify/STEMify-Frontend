import Image from 'next/image'
import React from 'react'
import { Badge } from '@/components/shadcn/badge'
import { useLocale, useTranslations } from 'next-intl'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDate, useStatusTranslation } from '@/utils/index'
import { OrganizationCurriculum } from '@/features/organization/types/organization.type'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'

type OrganizationCurriculumInfoSectionProps = {
  curriculum: OrganizationCurriculum
}

export default function OrganizationCurriculumInfoSection({ curriculum }: OrganizationCurriculumInfoSectionProps) {
  // Translations
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const t = useTranslations('curriculum')
  const to = useTranslations('organization.curriculum')

  const statusTranslate = useStatusTranslation()
  const locale = useLocale()
  const group = curriculum.subscriptionGroups[0]

  return (
    <div className='grid grid-cols-1 gap-12 py-5 md:grid-cols-3'>
      {/* Content Section */}
      <div className='flex flex-col md:col-span-2'>
        <div className='flex items-center gap-2'>
          <h2 className='mb-2 text-sm text-gray-500 uppercase'>{curriculum.code}</h2>
          <Badge className={getStatusBadgeClass(curriculum.subscriptionGroups[0].status)}>
            {statusTranslate(curriculum.subscriptionGroups[0].status)}
          </Badge>
        </div>
        <h1 className='mb-4 text-4xl font-bold text-gray-900'>{curriculum.title}</h1>

        <div className='mb-6 h-1 w-20 bg-yellow-500' />

        <p className='mb-4 text-gray-700'>{curriculum.description}</p>
      </div>

      {/* Image Section */}
      <div className='space-y-4'>
        <div className='relative aspect-[4/4] w-full overflow-hidden rounded-2xl shadow-md'>
          <Image
            src={curriculum.imageUrl || '/images/fallback.png'}
            alt='STEAM Starter Curriculum'
            fill
            className='object-cover'
          />
        </div>
        {/* Subscription Section */}
        <div className='overflow-hidden rounded-2xl border bg-white shadow-sm'>
          {/* Card body */}
          <div className='p-4'>
            {/* Subscription info */}
            <div className='space-y-2 text-sm'>
              {/* Subscription count + status */}
              <Badge className='flex items-center gap-2 bg-blue-100 text-blue-800'>
                <span>
                  {group.subscriptions.length}{' '}
                  {group.status === SubscriptionStatus.ACTIVE
                    ? to('activeSubscriptions')
                    : group.status === SubscriptionStatus.PENDING
                      ? to('upcomingSubscriptions')
                      : to('expiredSubscriptions')}
                </span>
              </Badge>

              {/* Access period */}
              <div className='flex flex-col gap-2'>
                <span className='text-gray-600'>{to('accessPeriod')}:</span>
                <span className='font-medium text-gray-900'>
                  {formatDate(new Date(Math.min(...group.subscriptions.map((s) => new Date(s.startDate).getTime()))), {
                    locale
                  })}
                  {' – '}
                  {formatDate(new Date(Math.max(...group.subscriptions.map((s) => new Date(s.endDate).getTime()))), {
                    locale
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
