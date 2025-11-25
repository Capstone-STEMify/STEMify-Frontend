'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { useTranslations } from 'next-intl'

interface QuizNavigationProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function QuizNavigation({ activeTab, onTabChange }: QuizNavigationProps) {
  const t = useTranslations('dashboard.classroom.quiz')
  return (
    <div className='mb-6'>
      <Tabs value={activeTab} onValueChange={onTabChange} className='mt-4'>
        <TabsList>
          <TabsTrigger value='overview'>{t('overviewTab')}</TabsTrigger>
          <TabsTrigger value='active'>{t('activeTab')}</TabsTrigger>
          {/* <TabsTrigger value='progress' disabled>
            Progress
          </TabsTrigger> */}
        </TabsList>
      </Tabs>
    </div>
  )
}
