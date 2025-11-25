'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { QuizDetailHeader } from './header/QuizAnalHeader'
import { QuestionDetailTab } from './question/QuestionTab'
import { LearnerOverviewTab } from './overview/OverviewTab'
import { useSelector } from 'react-redux'
import { RootState } from '@/libs/redux/store'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'

export default function QuizAnalytic() {

  const t = useTranslations('quiz.teacher.tab')
  
  const quiz = useSelector((state: RootState) => state.quizSelected.selectedQuiz)

  if (!quiz) {
    return <LoadingComponent />
  }

  return (
    <div className='min-h-screen bg-slate-50/50 p-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <QuizDetailHeader data={quiz} />

        <Tabs defaultValue='overview' className='mt-6'>
          <TabsList className='w-full justify-start rounded-none border-b bg-transparent p-0'>
            <TabsTrigger
              value='questions'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {t('question')}
            </TabsTrigger>

            <TabsTrigger
              value='overview'
              className='data-[state=active]:text-foreground data-[state=active]:border-b-primary w-auto flex-none rounded-none text-gray-400 data-[state=active]:border-b-2 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            >
              {t('overview')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='questions' className='mt-6'>
            <QuestionDetailTab data={quiz} />
          </TabsContent>
          <TabsContent value='overview' className='mt-6'>
            <LearnerOverviewTab data={quiz} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
