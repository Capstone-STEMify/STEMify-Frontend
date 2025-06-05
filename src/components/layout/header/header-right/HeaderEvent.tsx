import { Button } from '@/components/shadcn/button'
import SToolTip from '@/components/shared/SToolTip'
import { Bell, Gift } from 'lucide-react'
import Link from 'next/link'

export default function HeaderEvent() {
  const eventItems = [
    {
      event: 'Notifications',
      icon: <Bell className='h-4 w-4' />,
      href: '/',
      hasNotification: true // Example notification state
    },
    {
      event: 'Rewards & Gifts',
      icon: <Gift className='h-4 w-4' />,
      href: '/',
      hasNotification: false
    }
  ]

  return (
    <div className='flex flex-row items-center justify-center gap-2 sm:gap-3 lg:flex-row lg:gap-3'>
      {eventItems.map((item, index) => (
        <SToolTip content={item.event} key={index}>
          <Link href={item.href}>
            <Button
              variant='ghost'
              size='sm'
              className='group relative h-10 w-10 rounded-xl transition-all duration-300 hover:bg-amber-50 hover:text-amber-500 dark:hover:bg-amber-950/20'
            >
              <div className='relative'>
                {item.icon}
                {/* Notification dot */}
                {item.hasNotification && (
                  <div className='absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full border border-white bg-red-500 dark:border-gray-800' />
                )}
              </div>

              {/* Hover effect */}
              <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/0 to-orange-400/0 transition-all duration-300 group-hover:from-amber-400/10 group-hover:to-orange-400/10' />
            </Button>
          </Link>
        </SToolTip>
      ))}
    </div>
  )
}
