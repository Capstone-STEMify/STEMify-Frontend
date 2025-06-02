'use client'

import HeaderLeftSection from '@/components/layout/header/header-left/HeaderLeftSection'
import HeaderNavigation from '@/components/layout/header/header-left/HeaderNavigation'
import HeaderRightSection from '@/components/layout/header/header-right/HeaderRightSection'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import StemifyLogo from '@/components/shared/StemifyLogo'
import SToolTip from '@/components/shared/SToolTip'
import { ArrowRightToLine, Bell, Gift, UserPlus } from 'lucide-react'

export default function Header() {
  return (
    <div className='flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0'>
      {/* Left side action */}
      <HeaderLeftSection />

      {/* Right side actions */}
      <HeaderRightSection />
    </div>
  )
}
