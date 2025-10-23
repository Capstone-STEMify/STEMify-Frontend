'use client'

import { useEffect, useState } from 'react'
import QuestionSidebar from './QuestionSidebar'
import QuestionEditor from './QuestionEditor'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { useGetQuizByIdQuery, useSearchQuizQuery } from '@/features/resource/quiz/api/quizApi'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { selectQuestion } from '@/features/resource/question/slice/questionSlice'
// const [questions, setQuestions] = useState<Question[]>([
//   {
//     id: 1,
//     questionType: QuestionType.SINGLE_CHOICE,
//     content: 'What does UI stand for?',
//     orderIndex: 1,
//     answerExplanation: '',
//     points: 5,
//     answers: [
//       { id: 1, content: 'User Interface', isCorrect: true },
//       { id: 2, content: 'User Integration', isCorrect: false }
//     ]
//   },
//   {
//     id: 2,
//     questionType: QuestionType.TRUE_FALSE,
//     content: 'HTML stands for HyperText Markup Language.',
//     orderIndex: 2,
//     answerExplanation: '',
//     points: 2,
//     answers: [
//       { id: 1, content: 'True', isCorrect: true },
//       { id: 2, content: 'False', isCorrect: false }
//     ]
//   },
//   {
//     id: 3,
//     questionType: QuestionType.TRUE_FALSE,
//     content: 'HTML stands for HyperText Markup Language.',
//     orderIndex: 3,
//     answerExplanation: '',
//     points: 2,
//     answers: [
//       { id: 1, content: 'True', isCorrect: true },
//       { id: 2, content: 'False', isCorrect: false }
//     ]
//   },
//   {
//     id: 4,
//     questionType: QuestionType.TRUE_FALSE,
//     content: 'HTML stands for HyperText Markup Language.',
//     orderIndex: 4,
//     answerExplanation: '',
//     points: 2,
//     answers: [
//       { id: 1, content: 'True', isCorrect: true },
//       { id: 2, content: 'False', isCorrect: false }
//     ]
//   },
//   {
//     id: 5,
//     questionType: QuestionType.TRUE_FALSE,
//     content: 'HTML stands for HyperText Markup Language.',
//     orderIndex: 5,
//     answerExplanation: '',
//     points: 2,
//     answers: [
//       { id: 1, content: 'True', isCorrect: true },
//       { id: 2, content: 'False', isCorrect: false }
//     ]
//   }
// ])
export default function UpsertQuestion() {
  const { quizId } = useParams()
  const { data, isLoading, isError } = useGetQuizByIdQuery(Number(quizId))
  const [questions, setQuestions] = useState<Question[]>([])
  const { selectedQuestionId } = useAppSelector((state) => state.question)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data?.data?.questions) {
      setQuestions(data.data.questions)
      if (!selectedQuestionId && data.data.questions.length > 0) {
        dispatch(selectQuestion(data.data.questions[0].id))
      }
    }
  }, [data])

  const handleUpdate = (updates: Partial<Question>) => {
    if (!selectedQuestionId) return
    setQuestions((prev) => prev.map((q) => (q.id === selectedQuestionId ? { ...q, ...updates } : q)))
  }

  const handleReorder = (newOrder: Question[]) => {
    setQuestions(newOrder.map((q, i) => ({ ...q, orderIndex: i + 1 })))
  }

  if (isLoading) return <p className='p-4'>Loading questions...</p>
  if (isError) return <p className='p-4 text-red-500'>Failed to load quiz</p>

  const currentQuestion = questions.find((q) => q.id === selectedQuestionId)

  return (
    <div className='flex h-screen'>
      <QuestionSidebar questions={questions} onReorderQuestions={handleReorder} />
      <main className='flex-1 overflow-auto'>
        {currentQuestion ? (
          <QuestionEditor question={currentQuestion} onUpdateQuestion={handleUpdate} />
        ) : (
          <div className='text-muted-foreground p-10'>Select a question to edit</div>
        )}
      </main>
    </div>
  )
}
