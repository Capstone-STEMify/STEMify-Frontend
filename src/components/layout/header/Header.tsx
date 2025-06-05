import HeaderLeftSection from '@/components/layout/header/header-left/HeaderLeftSection'
import HeaderRightSection from '@/components/layout/header/header-right/HeaderRightSection'
import MobileMenu from '@/components/layout/header/MobileMenu'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 w-full bg-white/90 shadow-md backdrop-blur-md'>
      <div className='flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        {/* Hiển thị trên mobile */}
        <div className='flex w-full items-center justify-between lg:hidden'>
          <MobileMenu />
        </div>

        {/* Hiển thị trên desktop */}
        <div className='hidden w-full items-center justify-between lg:flex'>
          <HeaderLeftSection />
          <HeaderRightSection />
        </div>
      </div>
    </header>
  )
}
