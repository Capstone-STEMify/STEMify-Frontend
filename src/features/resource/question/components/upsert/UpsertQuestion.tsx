'use client'

import { useEffect, useState } from 'react'
import QuestionSidebar from './QuestionSidebar'
import QuestionEditor from './QuestionEditor'
import { useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import { useParams } from 'next/navigation'
import { Question } from '@/features/resource/question/types/question.type'

export default function UpsertQuestion() {
  const params = useParams()
  const quizId = Number(params.quizId) || 0 // ép kiểu sang number
  const { data, isLoading, isError } = useGetQuizByIdQuery(quizId)

  const [questionsByQuiz, setQuestionsByQuiz] = useState<Record<number, Question[]>>({})
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)

  useEffect(() => {
    if (data?.data?.questions) {
      setQuestionsByQuiz((prev) => ({
        ...prev,
        [quizId]: data.data.questions
      }))
      if (data.data.questions.length > 0) {
        setSelectedQuestionId(data.data.questions[0].id)
      }
    }
  }, [data, quizId])

  if (isLoading) return <p className='p-4'>Loading questions...</p>
  if (isError) return <p className='p-4 text-red-500'>Failed to load quiz</p>

  return (
    <div className='flex h-[90vh]'>
      <QuestionSidebar
        questions={questionsByQuiz[quizId] || []}
        setQuestions={(newQs) => setQuestionsByQuiz((prev) => ({ ...prev, [quizId]: newQs }))}
        selectedQuestionId={selectedQuestionId}
        setSelectedQuestionId={setSelectedQuestionId}
      />

      <main className='flex-1 overflow-auto'>
        <QuestionEditor
          quizId={quizId}
          questions={questionsByQuiz[quizId] || []}
          setQuestions={(newQs) =>
            setQuestionsByQuiz((prev) => ({
              ...prev,
              [quizId]: typeof newQs === 'function' ? newQs(prev[quizId] || []) : newQs
            }))
          }
          selectedQuestionId={selectedQuestionId}
        />
      </main>
    </div>
  )
}
