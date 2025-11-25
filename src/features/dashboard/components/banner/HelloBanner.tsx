'use client'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

export function WelcomeBanner() {
  const t = useTranslations('dashboard.organization.heroSec')
  const tc = useTranslations('common')

  const user = useAppSelector((state) => state.auth.user)
  return (
    <div className='flex flex-col items-center justify-between gap-8 rounded-2xl bg-white p-8 shadow-md md:flex-row'>
      <div className='flex-1 text-center md:text-left'>
        <h2 className='text-4xl font-bold text-gray-800'>
          {t('hi')}, {user?.name} 👋
        </h2>
        <p className='mt-2 text-2xl font-semibold text-gray-600'>{t('title')}</p>
        <p className='mx-auto mt-3 max-w-lg text-gray-500 md:mx-0'>{t('subTitle')}</p>
      </div>

      <div className='flex-shrink-0'>
        <img src='/images/banner.png' alt='Learning Illustration' className='h-72 object-contain md:h-60' />
      </div>
    </div>
  )
}
