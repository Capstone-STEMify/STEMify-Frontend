'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Bell, BellRing, Gift } from 'lucide-react'
import SToolTip from '@/components/shared/SToolTip'

export default function HeaderNotification() {
  const notificationCount = 1

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-blue-200 hover:shadow-md`}
          >
            {notificationCount > 0 ? (
              <>
                <BellRing className='h-6 w-6 text-blue-500 transition-transform duration-200 group-hover:rotate-12' />
                <span className='absolute -top-0 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[7px] font-semibold text-white transition-transform duration-200'>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              </>
            ) : (
              <Bell className='h-6 w-6 text-blue-500 transition-transform duration-200 group-hover:rotate-12' />
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent side='bottom' align='end' className='w-80 rounded-xl p-4 shadow-lg'>
          <h4 className='mb-2 text-sm font-medium'>Notifications</h4>
          <div className='text-sm text-gray-500 dark:text-gray-400'>You have no new notifications.</div>
        </PopoverContent>
      </Popover>

      <SToolTip content={'Gift'}>
        <div
          className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-blue-500 transition-all duration-200 ease-in-out hover:bg-blue-200 hover:shadow-md`}
        >
          <Gift className={`h-5 w-5 transition-transform duration-200 group-hover:rotate-12`} />
        </div>
      </SToolTip>
    </>
  )
}
