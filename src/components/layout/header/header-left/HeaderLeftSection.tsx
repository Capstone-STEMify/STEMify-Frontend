import HeaderNavigation from '@/components/layout/header/header-left/HeaderNavigation'
import StemifyLogo from '@/components/shared/StemifyLogo'

export default function HeaderLeftSection() {
  return (
    <div className='flex h-20 items-center gap-10'>
      <div className='h-20'>
        <StemifyLogo />
      </div>
      <HeaderNavigation />
    </div>
  )
}
