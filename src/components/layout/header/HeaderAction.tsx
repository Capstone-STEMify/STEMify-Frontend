'use client'
import HeaderEvent from '@/components/layout/header/header-action/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import { ArrowRightToLine, Sparkles } from 'lucide-react'
import React from 'react'
import { signIn } from 'next-auth/react'
import AuthStatusMenu from '@/components/layout/header/header-action/AuthStatusMenu'
// highlight-next-line
import { useTranslations } from 'next-intl'

export default function HeaderAction() {
  // highlight-next-line
  const t = useTranslations('Header')

  return (
    <>
      {/* Desktop Layout */}
      <div className='hidden items-center gap-2 lg:flex'>
        <HeaderEvent />
        <AuthStatusMenu />
      </div>

      {/* Mobile Layout */}
      <div className='flex w-full flex-col space-y-4 lg:hidden'>
        <div className='flex w-full flex-col space-y-3 pt-2'>
          {/* Mobile Sign In Button */}
          <Button
            size='lg'
            onClick={() =>
              signIn('oidc', {
                callbackUrl: '/',
                prompt: 'login'
              })
            }
            className='group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 px-6 py-2.5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:scale-95'
          >
            <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/20 to-white/0 transition-transform duration-500 group-hover:translate-x-[100%]' />
            <div className='flex items-center gap-2'>
              <ArrowRightToLine size={16} className='transition-transform duration-200 group-hover:translate-x-1' />
              {/* highlight-next-line */}
              <span className='font-semibold'>{t('signIn')}</span>
              <Sparkles size={14} className='opacity-70 transition-opacity duration-200 group-hover:opacity-100' />
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}