'use client'

import HeaderEvent from '@/components/layout/header/header-action/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SAvatar from '@/components/shared/SAvatar'
import { SPopover } from '@/components/shared/SPopover'
import {
  ArrowRightToLine,
  ChevronRight,
  LogOut,
  Palette,
  Repeat,
  Settings,
  User as UserIcon,
  Sparkles
} from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import LanguageSwitcher from '@/components/layout/header/LanguageSwitcher'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { logout } from '@/features/auth/authSlice'
import { persistor } from '@/libs/redux/store'
import { clearSelectedOrganization } from '@/features/subscription/slice/selectedOrganizationSlice'

function MenuItem({
  children,
  icon,
  href,
  className
}: {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href ?? '#'}
      className={clsx(
        'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
        'hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none',
        'dark:hover:bg-zinc-800',
        className
      )}
    >
      <span className='flex items-center gap-3'>
        {icon}
        <span>{children}</span>
      </span>
    </Link>
  )
}

export default function AuthStatusMenuMobile() {
  const t = useTranslations('Header')
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()

  if (status === 'loading') {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={18} textShow={false} />
      </div>
    )
  }

  const isAuth = status === 'authenticated'
  const handleSignOut = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_IDENTITY_SERVER_URL}/account/logout`, {
        method: 'GET',
        credentials: 'include'
      })
      localStorage.removeItem('stemify_user_id')
      localStorage.removeItem('stemify_access_token')
      await signOut({ callbackUrl: '/' })
      dispatch(logout())
      dispatch(clearSelectedOrganization())
      persistor.purge()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <div>
      {isAuth ? (
        <div className='flex items-center justify-center gap-3'>
          <HeaderEvent />

          <SPopover
            className='w-65 rounded-xl border bg-white p-4 shadow-lg outline-none dark:border-zinc-800 dark:bg-zinc-900'
            trigger={
              <div>
                <SAvatar src={session?.user?.image || 'https://github.com/shadcn.png'} />
              </div>
            }
            children={
              <div>
                <div className='flex items-center gap-3'>
                  <SAvatar src={session?.user?.image || 'https://github.com/shadcn.png'} />
                  <div className='min-w-0'>
                    <div className='truncate text-base font-semibold'>{session?.user?.name}</div>
                    <div className='text-muted-foreground truncate text-sm'>{session?.user?.email}</div>
                  </div>
                </div>

                <div className='my-3 h-px w-full bg-gray-200 dark:bg-zinc-800' />

                <div className='grid gap-1'>
                  <MenuItem icon={<UserIcon size={16} />} href='/profile'>
                    {t('profile')}
                  </MenuItem>

                  <MenuItem icon={<Settings size={16} />}>{t('accountSettings')}</MenuItem>

                  <MenuItem icon={<Palette size={16} />}>{t('theme')}</MenuItem>

                  <div className='my-1 h-px w-full bg-gray-200 dark:bg-zinc-800' />

                  <button
                    onClick={handleSignOut}
                    className='flex items-center gap-2 px-3 py-2 text-red-600 hover:rounded-2xl hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
                  >
                    <LogOut size={16} />
                    {t('signOut')}
                  </button>
                </div>
              </div>
            }
          />
        </div>
      ) : (
        <div className='mx-auto w-full space-y-3'>
          <div className='mx-auto flex w-full justify-center'>
            <LanguageSwitcher />
          </div>
          <Button
            size='lg'
            onClick={() => signIn('oidc', { callbackUrl: '/', prompt: 'login' })}
            className='group relative w-full gap-4 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 px-6'
          >
            <ArrowRightToLine size={16} className='transition-transform duration-200 group-hover:translate-x-1' />
            <span className='font-semibold'>{t('signIn')}</span>
            <Sparkles size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}
