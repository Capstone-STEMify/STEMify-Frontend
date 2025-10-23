'use client'

import { useEffect, useState } from 'react'
import QuestionSidebar from './QuestionSidebar'
import QuestionEditor from './QuestionEditor'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { useGetQuizByIdQuery, useSearchQuizQuery } from '@/features/resource/quiz/api/quizApi'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  reorderQuestions,
  selectQuestion,
  setQuestions,
  updateQuestion
} from '@/features/resource/question/slice/questionSlice'

export default function UpsertQuestion() {
  const { quizId } = useParams()
  const { data, isLoading, isError } = useGetQuizByIdQuery(Number(quizId))
  const { selectedQuestionId } = useAppSelector((state) => state.question)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (data?.data?.questions) {
      dispatch(setQuestions(data.data.questions))
      if (!selectedQuestionId && data.data.questions.length > 0) {
        dispatch(selectQuestion(data.data.questions[0].id))
      }
    }
  }, [data])

  if (isLoading) return <p className='p-4'>Loading questions...</p>
  if (isError) return <p className='p-4 text-red-500'>Failed to load quiz</p>

  return (
    <div className='flex h-screen'>
      <QuestionSidebar />
      <main className='flex-1 overflow-auto'>
        <QuestionEditor />
      </main>
    </div>
  )
}
