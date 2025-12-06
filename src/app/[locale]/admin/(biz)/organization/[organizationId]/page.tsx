'use client'
import BackButton from '@/components/shared/button/BackButton'
import SystemOrganizationDetail from '@/features/organization/components/detail/SystemOrganizationDetail'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function SystemOrganizationDetailPage() {
  const t = useTranslations('organization')
  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-5 pb-5'>
        <BackButton />
        <h1>{t('detail.header')}</h1>
      </div>
      <SystemOrganizationDetail />
    </div>
  )
}
