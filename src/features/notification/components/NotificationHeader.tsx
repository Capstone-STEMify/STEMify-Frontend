'use client'
import STabs from '@/components/shared/STabs'
import NotificationAll from '@/features/notification/components/notification-header/NotificationAll'
import NotificationUnread from '@/features/notification/components/notification-header/NotificationUnread'

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
