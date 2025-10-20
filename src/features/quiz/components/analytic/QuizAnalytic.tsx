'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { QuizDetailHeader } from './header/QuizAnalHeader'
import { QuestionDetailTab } from './question/QuestionTab'
import { LearnerOverviewTab } from './overview/OverviewTab'

export default function QuizAnalytic() {
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl'>
        <QuizDetailHeader />

        <Tabs defaultValue='overview' className='mt-6'>
          <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
            <TabsTrigger
              value='questions'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              Questions
            </TabsTrigger>

            <TabsTrigger
              value='overview'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value='questions' className='mt-6'>
            <QuestionDetailTab />
          </TabsContent>
          <TabsContent value='overview' className='mt-6'>
            <LearnerOverviewTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
