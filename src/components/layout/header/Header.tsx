'use client'

import HeaderLeftSection from '@/components/layout/header/header-left/HeaderLeftSection'
import HeaderRightSection from '@/components/layout/header/header-right/HeaderRightSection'

export default function Header() {
  return (
    <div className='flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0'>
      <HeaderLeftSection />

      <HeaderRightSection />
    </div>
  )
}
