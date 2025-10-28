import { QuizCard } from '../card/QuizCard'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'

type QuizCardGridProps = {
  data: QuizStatistics[]
}

export function QuizCardGrid({data}: QuizCardGridProps) {
  return (
    <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {data.map((quiz) => (
        <QuizCard key={quiz.quizId} quiz={quiz} />
      ))}
    </div>
  )
}
