'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Grid, LayoutGrid, Table } from 'lucide-react'
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
          <TabsTrigger value='overview'>
            <LayoutGrid />
          </TabsTrigger>
          <TabsTrigger value='active'>
            <Table />
          </TabsTrigger>
          {/* <TabsTrigger value='progress' disabled>
            Progress
          </TabsTrigger> */}
        </TabsList>
      </Tabs>
    </div>
  )
}
