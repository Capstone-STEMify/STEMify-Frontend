import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useSearchNotificationQuery } from '@/features/notification/api/notificationApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { formatDate } from '@/utils/index'
import React from 'react'

export default function NotificationUnread() {
  const userId = useAppSelector((state) => state.auth.user?.userId)

  const { data, isLoading, isFetching } = useSearchNotificationQuery({
    userId,
    isRead: false
  })

  if (isLoading || isFetching) {
    return (
      <div className='space-y-3 p-4'>
        <Skeleton className='h-3 w-20' />
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-2 w-3/4' />
              <Skeleton className='h-2 w-16' />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <ScrollArea className='-mx-1 h-[320px]'>
      {data && data.data.items.length > 0 ? (
        <div className='space-y-1'>
          {data.data.items.map((noti) => (
            <div
              key={noti.id}
              className='group relative cursor-pointer rounded-lg border border-transparent p-3 transition-all duration-200 hover:border-gray-100 hover:bg-gray-50 dark:hover:border-gray-800 dark:hover:bg-gray-900/50'
            >
              {/* Unread indicator */}
              {!noti.isRead && <div className='absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500'></div>}

              {/* Content */}
              <div className='pr-4'>
                <h5 className='mb-1 line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100'>{noti.title}</h5>
                <p className='mb-2 line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400'>
                  {noti.message}
                </p>
                <time className='text-xs text-gray-400 dark:text-gray-500'>{formatDate(noti.createdDate)}</time>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex h-24 items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
          No new notifications
        </div>
      )}
    </ScrollArea>
  )
}
