import LanguageSwitcher from '@/components/layout/header/LanguageSwitcher'
import BackButton from '@/components/shared/button/BackButton'
import { Button } from 'components/shadcn/button'
import { Separator } from 'components/shadcn/separator'
import { SidebarTrigger } from 'components/shadcn/sidebar'
import { useTranslations } from 'next-intl'

export function SiteHeader() {
  const t = useTranslations('Admin')
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        {/* <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' /> */}
      </div>
      <LanguageSwitcher />
    </header>
  )
}
