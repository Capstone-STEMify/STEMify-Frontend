'use client'
import HeaderEvent from '@/components/layout/header/header-action/HeaderEvent'
import { Button } from '@/components/shadcn/button'
import { ArrowRightToLine, Sparkles } from 'lucide-react'
import React from 'react'
import { signIn } from 'next-auth/react'
import AuthStatusMenu from '@/components/layout/header/header-action/AuthStatusMenu'
// highlight-next-line
import { useTranslations } from 'next-intl'
import AuthStatusMenuMobile from '@/components/layout/header/header-action/AuthStatusMenuMobile'

export default function HeaderAction() {
  // highlight-next-line
  const t = useTranslations('Header')

  return (
    <>
      {/* Desktop Layout */}
      <div className='hidden items-center gap-2 lg:flex'>
        <AuthStatusMenu />
      </div>

      {/* Mobile Layout */}
      <div className='flex w-full flex-col space-y-4 lg:hidden'>
        <div className='flex w-full flex-col space-y-3 pt-2'>
          <AuthStatusMenuMobile />
        </div>
      </div>
    </>
  )
}
