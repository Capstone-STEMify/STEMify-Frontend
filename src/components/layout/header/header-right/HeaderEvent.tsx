import { Button } from '@/components/shadcn/button'
import SToolTip from '@/components/shared/SToolTip'
import { Bell, Gift } from 'lucide-react'
import Link from 'next/link'

export default function HeaderEvent() {
  const eventItems = [
    { event: 'Notification', icon: <Bell />, href: '/' },
    { event: 'Gift', icon: <Gift />, href: '/' }
  ]
  return (
    <div className='flex items-center justify-center'>
      {eventItems.map((item, index) => (
        <SToolTip content={item.event} key={index}>
          <Link href={item.href}>
            <Button variant='ghost' className='hover:text-amber-custom-400 transition-colors duration-200'>
              {item.icon}
            </Button>
          </Link>
        </SToolTip>
      ))}
    </div>
  )
}
