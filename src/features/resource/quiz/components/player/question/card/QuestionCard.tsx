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

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.TRUE_FALSE:
        return 'Đúng/Sai'
      case QuestionType.SINGLE_CHOICE:
        return 'Một đáp án'
      case QuestionType.MULTIPLE_CHOICE:
        return 'Nhiều đáp án'
      default:
        return type
    }
  }

  const getQuestionTypeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.TRUE_FALSE:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      case QuestionType.SINGLE_CHOICE:
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
      case QuestionType.MULTIPLE_CHOICE:
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500'
    }
  }

  const isAnswered = userAnswers[question.id] !== undefined

  return (
    <div className='animate-in fade-in-0 slide-in-from-bottom-4 w-full max-w-3xl duration-500'>
      {/* Header Section */}
      <div className='mb-6 flex items-center justify-between md:mb-8'>
        <div className='flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl font-bold text-white shadow-lg'>
            {currentQuestionIndex + 1}
          </div>
          <Badge
            className={`${getQuestionTypeColor(question.questionType)} border-none px-4 py-1 text-white shadow-md`}
          >
            {getQuestionTypeLabel(question.questionType)}
          </Badge>
        </div>

        {isAnswered && (
          <div className='flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600'>
            <CheckCircle2 className='h-4 w-4' />
            Đã trả lời
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className='mb-6 md:mb-8'>
        <h2 className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl leading-tight font-bold text-transparent md:text-3xl lg:text-4xl'>
          {question.content}
        </h2>
        {question.points > 0 && (
          <div className='mt-4 flex items-center gap-2 text-amber-600'>
            <Award className='h-5 w-5' />
            <span className='font-semibold'>{question.points} điểm</span>
          </div>
        )}
      </div>

      {/* Question Type Component */}
      <Card className='overflow-hidden border-2 border-gray-100 bg-white shadow-xl transition-all hover:shadow-2xl'>
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
