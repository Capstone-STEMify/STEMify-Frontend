'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/shadcn/badge'
import { Card } from '@/components/shadcn/card'
import TrueFalseQuestion from '@/features/resource/quiz/components/player/question/types/TrueFalseQuestion'
import SingleChoiceQuestion from '@/features/resource/quiz/components/player/question/types/SingleChoiceQuestion'
import MultipleChoiceQuestion from '@/features/resource/quiz/components/player/question/types/MultipleChoiceQuestion'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { Award, CheckCircle2 } from 'lucide-react'

type QuestionCardProps = {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { isSubmitted, userAnswers, currentQuestionIndex } = useAppSelector((state) => state.quizPlayer)

  const isAnswered = userAnswers[question.id] !== undefined

  return (
    <div className='animate-in fade-in-0 slide-in-from-bottom-4 w-full max-w-4xl duration-500'>
      {/* Question Type Component */}
      <Card className='overflow-hidden border-2 border-gray-100 bg-white shadow-xl transition-all'>
        <div className='p-6 md:p-8'>
          {question.questionType === QuestionType.TRUE_FALSE && <TrueFalseQuestion question={question} />}
          {question.questionType === QuestionType.SINGLE_CHOICE && <SingleChoiceQuestion question={question} />}
          {question.questionType === QuestionType.MULTIPLE_CHOICE && <MultipleChoiceQuestion question={question} />}
        </div>
      </Card>

      {/* Answer Explanation (if submitted) */}
      {isSubmitted && question.answerExplanation && (
        <Card className='mt-6 border-l-4 border-blue-500 bg-blue-50'>
          <div className='p-6'>
            <h3 className='mb-2 font-semibold text-blue-900'>💡 Giải thích</h3>
            <p className='text-blue-800'>{question.answerExplanation}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
