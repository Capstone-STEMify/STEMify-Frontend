'use client'
import Link from 'next/link'
import { QuizCard } from '../card/QuizCard'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'
import { useDispatch } from 'react-redux'
import { setSelectedQuiz } from '@/features/quiz/slice/studentQuizSlice'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'

type QuizCardGridProps = {
  data: QuizStatistics[]
}

export function QuizCardGrid({ data }: QuizCardGridProps) {
  const dispatch = useDispatch()
  const locale = useLocale()
  const { classroomId } = useParams()
  return (
    <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {data.map((quiz) => (
        <Link
          key={quiz.quizId}
          href={`/${locale}/classroom/${classroomId}/quiz/${quiz.quizId}`}
          onClick={() => dispatch(setSelectedQuiz(quiz))}
        >
          <QuizCard quiz={quiz} />
        </Link>
      ))}
    </div>
  )
}
