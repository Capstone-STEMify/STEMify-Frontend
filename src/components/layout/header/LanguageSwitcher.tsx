'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'

import { US, VN } from 'country-flag-icons/react/3x2'

export default function LanguageSwitcher() {
  const t = useTranslations('Header')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  // map locale -> component cờ
  const flagByLocale = {
    en: US,
    vi: VN
  } as const

  const CurrentFlag = flagByLocale[locale as 'en' | 'vi'] ?? US

  const onSelectChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.replace(segments.join('/'))
  }

  return (
    <Select onValueChange={onSelectChange} defaultValue={locale}>
      <SelectTrigger className='w-fit border-none bg-transparent shadow-none focus-visible:ring-0'>
        <div className='flex items-center gap-2'>
          <CurrentFlag className='h-5 w-5 overflow-hidden' title={locale === 'vi' ? 'Việt Nam' : 'English'} />
          <span className='text-gray-700'>{locale === 'vi' ? t('vietnamese') : t('english')}</span>
        </div>
      </SelectTrigger>

      <SelectContent align='end'>
        <SelectItem value='en'>
          <div className='flex items-center gap-2'>
            <US className='h-5 w-5 overflow-hidden' title='English' />
            <span>{t('english')}</span>
          </div>
        </SelectItem>

        <SelectItem value='vi'>
          <div className='flex items-center gap-2'>
            <VN className='h-5 w-5 overflow-hidden' title='Việt Nam' />
            <span>{t('vietnamese')}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
