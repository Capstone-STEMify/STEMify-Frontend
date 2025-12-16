'use client'

import { IconCreditCard, IconDotsVertical, IconLogout, IconNotification, IconUserCircle } from '@tabler/icons-react'

import { Avatar, AvatarFallback, AvatarImage } from 'components/shadcn/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/shadcn/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from 'components/shadcn/sidebar'
import { signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/layout/header/LanguageSwitcher'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { logout } from '@/features/auth/authSlice'
import { clearSelectedOrganization } from '@/features/subscription/slice/selectedOrganizationSlice'
import { persistor } from '@/libs/redux/store'
import { useRouter } from 'next/navigation'
import { stringToHslColor } from '@/utils/index'
export function NavUser({
  user
}: {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}) {
  const locale = useLocale()
  const t = useTranslations('Admin')
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/account/logout`, {
        method: 'GET',
        credentials: 'include'
      })
      localStorage.removeItem('stemify_user_id')
      localStorage.removeItem('stemify_access_token')

      await signOut({ redirect: false })
      dispatch(logout())
      dispatch(clearSelectedOrganization())
      persistor.purge()
      router.push(`/${locale}/`)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div
                className='flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-sm ring-1 ring-black/5 select-none'
                style={{
                  backgroundColor: stringToHslColor(user?.name || '')
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user?.name}</span>
                <span className='text-muted-foreground truncate text-xs'>{user?.email}</span>
              </div>
              <IconDotsVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <div
                  className='flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-sm ring-1 ring-black/5 select-none'
                  style={{
                    backgroundColor: stringToHslColor(user?.name || '')
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user?.name}</span>
                  <span className='text-muted-foreground truncate text-xs'>{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              {t('user.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
