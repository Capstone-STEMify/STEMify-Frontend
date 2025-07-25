'use client'
import HeaderEvent from '@/components/layout/header/header-action/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SAvatar from '@/components/shared/SAvatar'
import { SPopover } from '@/components/shared/SPopover'
import { ArrowRightToLine, Sparkles } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function AuthStatusMenu() {
  const { data: session, status } = useSession()
  if (status === 'loading') {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={50} textShow={false} />
      </div>
    )
  }
  const isAuth = status === 'authenticated'

  return (
    <div className='hiden items-center justify-center gap-3 lg:flex'>
      {isAuth ? (
        <div className='flex items-center gap-3'>
          <HeaderEvent />
          <div className='relative h-8 w-px'>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600' />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-amber-300/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100' />
          </div>
          <SPopover
            trigger={
              <div>
                <SAvatar src={session.user.image || 'https://github.com/shadcn.png'} />
              </div>
            }
            children={
              <div>
                <div>{session.user.name}</div>
                <div>{session.user.email}</div>
                <div>{session.user.role}</div>
                <div>Profile</div>
                <Button className='mt-3' onClick={() => signOut({ callbackUrl: '/' })}>
                  Sign Out
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <Button
          size='lg'
          onClick={() => signIn('oidc', { callbackUrl: '/', prompt: 'login' })}
          className='group relative gap-4 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 px-6'
        >
          <ArrowRightToLine size={16} className='transition-transform duration-200 group-hover:translate-x-1' />
          <span className='font-semibold'>Sign In</span>
          <Sparkles size={14} />
        </Button>
      )}
    </div>
  )
}
