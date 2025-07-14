'use client'

import { useEffect, useState } from 'react'
import HeaderAction from '@/components/layout/header/HeaderAction'
import MobileMenu from '@/components/layout/header/MobileMenu'
import HeaderNavigation from '@/components/layout/header/HeaderNavigation'

export default function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-white/90 shadow-md backdrop-blur-md transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* mobile */}
        <div className='flex w-full items-center justify-between lg:hidden'>
          <MobileMenu />
        </div>

        {/* desktop */}
        <div className='hidden w-full items-center justify-between lg:flex'>
          <HeaderNavigation />
          <HeaderAction />
        </div>
      </div>
    </header>
  )
}
