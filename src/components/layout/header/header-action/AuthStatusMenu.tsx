'use client'
import { Button } from '@/components/shadcn/button'
import SAvatar from '@/components/shared/SAvatar'
import { SDropDown } from '@/components/shared/SDropDown'
import { SPopover } from '@/components/shared/SPopover'
import { useAppSelector } from '@/hooks/redux-hooks'
import { ArrowRightToLine, Sparkles } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function AuthStatusMenu() {
  const { data: session, status } = useSession()
  const isAuth = status === 'authenticated'

  return (
    <div>
      {isAuth ? (
        <SPopover
          trigger={
            <div>
              <SAvatar src={session.user.image || 'https://github.com/shadcn.png'} />
            </div>
          }
          children={
            <div>
              <div>Profile</div>
              <div>Profile</div>
              <div>Profile</div>
              <div>Profile</div>
              <Button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</Button>
            </div>
          }
        />
      ) : (
        <Button
          size='lg'
          onClick={() => signIn('oidc', { callbackUrl: '/' }, { prompt: 'login' })}
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
