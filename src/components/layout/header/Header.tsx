'use client'

import HeaderLeftSection from '@/components/layout/header/header-left/HeaderLeftSection'
import HeaderRightSection from '@/components/layout/header/header-right/HeaderRightSection'

export default function Header() {
  return (
    <div className='bg-light/10 sticky top-0 z-50 flex flex-col items-center justify-between gap-2 px-5 py-2 shadow-md backdrop-blur-md sm:flex-row sm:gap-0 sm:px-2 lg:px-5 '>
      <HeaderLeftSection />

      <HeaderRightSection />
    </div>
  )
}
