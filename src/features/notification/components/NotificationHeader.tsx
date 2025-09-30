'use client'
import STabs from '@/components/shared/STabs'
import NotificationAll from '@/features/notification/components/notification-header/NotificationAll'
import NotificationUnread from '@/features/notification/components/notification-header/NotificationUnread'
import { useTranslations } from 'next-intl'

export default function NotificationHeader() {
  const t = useTranslations('Header')
  return (
    <div className='p-4'>
      <h2 className='mb-1 text-base font-medium text-gray-900 dark:text-gray-100'>{t('notifications.title')}</h2>
      <STabs
        customStyle={{
          trigger: 'text-xs'
        }}
        items={[
          { label: `${t('notifications.all')}`, value: 'all', content: <NotificationAll /> },
          { label: `${t('notifications.unread')}`, value: 'unread', content: <NotificationUnread /> }
        ]}
        defaultValue='all'
      />
    </div>
  )
}
