// highlight-next-line
import { useLocale, useTranslations } from 'next-intl'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Bell, BellRing, Gift, ShoppingBag } from 'lucide-react'
import NotificationHeader from '@/features/notification/components/NotificationHeader'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useSearchNotificationQuery } from '@/features/notification/api/notificationApi'
import LanguageSwitcher from '../LanguageSwitcher'
import { useGetCartByUserIdQuery } from '@/features/cart/api/cartApi'
import Link from 'next/link'
import { OrganizationSwitcherHeader } from '@/components/layout/header/organization-switcher-header'
import { OrganizationSwitcher } from '@/components/layout/organization/sidebar/organization-switcher'

export default function HeaderEvent() {
  const locale = useLocale()
  const { token, user } = useAppSelector((state) => state.auth)
  const { data } = useSearchNotificationQuery({ userId: user?.userId }, { skip: !token })
  // const { data: cartData } = useGetCartByUserIdQuery({ userId: user?.userId || '' }, { skip: !token })
  // highlight-next-line
  const t = useTranslations('Header')

  const unreadCount = data?.data?.items?.filter((item) => !item.isRead).length || 0

  return (
    <>
      <LanguageSwitcher />
      <OrganizationSwitcherHeader />
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:bg-blue-200 hover:shadow-md`}
          >
            {unreadCount > 0 ? (
              <>
                <BellRing className='h-6 w-6 cursor-pointer text-blue-500 transition-transform duration-200 group-hover:rotate-12' />
                {unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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

      {/* highlight-next-line */}
      {/* <Link
        href={`/${locale}/shop/cart`}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-blue-500 transition-all duration-200 ease-in-out hover:bg-blue-200 hover:shadow-md`}
      >
        <ShoppingBag className={`h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:rotate-12`} />
        {cartData && cartData.data.items.length > 0 && (
          <span className='absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-xs font-semibold text-white'>
            {cartData.data.items.length > 9 ? '9+' : cartData.data.items.length}
          </span>
        )}
      </Link> */}
    </>
  )
}
