import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Bell, BellRing, Gift } from 'lucide-react'
import SToolTip from '@/components/shared/SToolTip'
import NotificationHeader from '@/features/notification/components/NotificationHeader'

export default function HeaderEvent() {
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
                <span className='absolute -top-0 -right-0 mt-1 mr-0.5 h-1.25 w-1.25 rounded-full bg-red-500' />
              </>
            ) : (
              <Bell className='h-6 w-6 text-blue-500 transition-transform duration-200 group-hover:rotate-12' />
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent side='bottom' align='end' className='shadow-6 w-80 rounded-xl'>
          <NotificationHeader />
        </PopoverContent>
      </Popover>

      <SToolTip content={'Gift'}>
        <div
          className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-blue-500 transition-all duration-200 ease-in-out hover:bg-blue-200 hover:shadow-md`}
        >
          <Gift className={`h-6 w-6 transition-transform duration-200 group-hover:rotate-12`} />
        </div>
      </SToolTip>
    </>
  )
}
