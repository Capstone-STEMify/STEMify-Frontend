import LanguageSwitcher from '@/components/layout/header/LanguageSwitcher'
import { Button } from '@/components/shadcn/button'
import BackButton from '@/components/shared/button/BackButton'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

export default function Creator3DHeader() {
  const locale = useLocale()
  const t3d = useTranslations('creator3D')

  return (
    <div className='flex-shrink-0 border-b bg-white px-6 py-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <BackButton url={`/${locale}/straw-lab`} />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{t3d('header.title')}</h1>
            <p className='text-sm text-gray-600'>{t3d('header.subtitle')}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <LanguageSwitcher />
          <Button className='bg-blue-600 hover:bg-blue-700'>{t3d('header.save')}</Button>
        </div>
      </div>
    </div>
  )
}
