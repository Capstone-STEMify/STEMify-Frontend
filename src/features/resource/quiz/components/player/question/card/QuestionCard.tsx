'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/shadcn/badge'
import { Card } from '@/components/shadcn/card'
import TrueFalseQuestion from '@/features/resource/quiz/components/player/question/types/TrueFalseQuestion'
import SingleChoiceQuestion from '@/features/resource/quiz/components/player/question/types/SingleChoiceQuestion'
import MultipleChoiceQuestion from '@/features/resource/quiz/components/player/question/types/MultipleChoiceQuestion'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { useAppSelector } from '@/hooks/redux-hooks'

type QuestionCardProps = {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { isSubmitted, userAnswers } = useAppSelector((state) => state.quizPlayer)

  return (
    <div className='w-full max-w-2xl'>
      {/* Question Type Badge */}
      <div className='mb-4 md:mb-6'>
        <Badge variant='secondary' className='text-xs md:text-sm'>
          {question.questionType}
        </Badge>
      </div>

      <h2 className='text-foreground mb-6 text-xl leading-tight font-bold md:mb-8 md:text-3xl lg:text-4xl'>
        {question.content}
      </h2>

      {/* Question Type Component */}
      <Card className='p-4 md:p-8'>
        {question.questionType === QuestionType.TRUE_FALSE && <TrueFalseQuestion question={question} />}
        {question.questionType === QuestionType.SINGLE_CHOICE && <SingleChoiceQuestion question={question} />}
        {question.questionType === QuestionType.MULTIPLE_CHOICE && <MultipleChoiceQuestion question={question} />}
      </Card>
    </div>
  )
}
