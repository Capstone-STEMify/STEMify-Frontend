'use client'
import { Skeleton } from '@/components/shadcn/skeleton'
import STabs from '@/components/shared/STabs'
import { useLazySearchNotificationQuery } from '@/features/notification/api/notificationApi'
import { NotificationOrderBy } from '@/features/notification/types/notification.type'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const NotificationAll = dynamic(
  () => import('@/features/notification/components/notification-header/NotificationAll'),
  {
    ssr: false
  }
)

const NotificationUnread = dynamic(
  () => import('@/features/notification/components/notification-header/NotificationUnread'),
  {
    ssr: false
  }
)

export default function NotificationHeader() {
  return (
    <div>
      <h2 className='mb-1 text-base font-medium text-gray-900 dark:text-gray-100'>Notifications</h2>
      <STabs
        customStyle={{
          trigger: 'text-xs'
        }}
        items={[
          { label: 'All', value: 'all', content: <NotificationAll /> },
          { label: 'Unread', value: 'unread', content: <NotificationUnread /> }
        ]}
        defaultValue='all'
      />
    </div>
  )
}
