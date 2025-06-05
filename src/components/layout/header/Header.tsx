// Header.tsx
'use client'

import HeaderLeftSection from '@/components/layout/header/header-left/HeaderLeftSection'
import HeaderRightSection from '@/components/layout/header/header-right/HeaderRightSection'
import MobileMenu from '@/components/layout/header/MobileMenu'
import { useEffect, useState } from 'react'

export default function Header() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className='sticky top-0 z-50 w-full bg-white/90 shadow-md backdrop-blur-md'>
      <div className='flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        {isMobile ? (
          <MobileMenu />
        ) : (
          <>
            <HeaderLeftSection />
            <HeaderRightSection />
          </>
        )}
      </div>
    </header>
  )
}
