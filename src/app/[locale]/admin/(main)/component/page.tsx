'use client'
import { useTranslations } from 'next-intl'
import React from 'react'
import ComponentList from '@/features/kit-components/components/list/ComponentList'

export default function ComponentListPage() {
  const t = useTranslations('components')
  return (
    <div className='px-5'>
      <h1 className='text-2xl font-semibold text-gray-800'>{t('list.title')}</h1>
      <ComponentList />
    </div>
  )
}
