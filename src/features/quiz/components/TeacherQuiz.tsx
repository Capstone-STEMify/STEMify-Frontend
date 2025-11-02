'use client'

import { useState } from 'react'

import { cn } from '@/shadcn/utils'
import { QuizNavigation } from './navigation/QuizNavigation'
import QuizOverview from './overview/QuizOverView'
import QuizActive from './active/QuizActive'
import { useSearchStudentQuizQuery } from '../api/studentQuizApi'
import { useParams } from 'next/navigation'

export default function TeacherQuiz() {
  const [activeTab, setActiveTab] = useState('overview')
  const { classroomId } = useParams()

  const {
    data: quizStatisticData,
    isLoading,
    isFetching
  } = useSearchStudentQuizQuery({ classroomId: Number(classroomId) })

  console.log('quizData: ', quizStatisticData)

  const quizListDisplay = quizStatisticData?.data.items || []

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  return (
    <div className={cn('min-h-screen p-4 transition-colors duration-300', 'bg-slate-50/50')}>
      <div className='mx-auto max-w-7xl'>
        <QuizNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'overview' ? (
          <>
            <QuizOverview data={quizListDisplay} />
          </>
        ) : (
          <>
            <QuizActive data={quizListDisplay} />
          </>
        )}
      </div>
    </div>
  )
}
