'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/shadcn/badge'
import { Card } from '@/components/shadcn/card'

import { Question } from '@/features/resource/quiz/context/quiz-player-slice'
import { mockQuestionTypes } from '@/libs/mock-data'
import TrueFalseQuestion from '@/features/resource/quiz/components/player/question/types/TrueFalseQuestion'
import SingleChoiceQuestion from '@/features/resource/quiz/components/player/question/types/SingleChoiceQuestion'
import MultipleChoiceQuestion from '@/features/resource/quiz/components/player/question/types/MultipleChoiceQuestion'
import ShortAnswerQuestion from '@/features/resource/quiz/components/player/question/types/ShortAnswerQuestion'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const isMobile = useIsMobile()

  const getTypeLabel = (questionTypeId: number) => {
    const typeName = mockQuestionTypes.find((t) => t.id === questionTypeId)?.name || ''
    const labels: Record<string, string> = {
      'true-false': 'Đúng/Sai',
      'single-choice': 'Chọn một đáp án',
      'multiple-choice': 'Chọn nhiều đáp án',
      'short-answer': 'Trả lời ngắn'
    }
    return labels[typeName] || typeName
  }

  const getTypeName = (questionTypeId: number) => {
    return mockQuestionTypes.find((t) => t.id === questionTypeId)?.name || ''
  }

  const typeName = getTypeName(question.questionTypeId)

  return (
    <div className='w-full max-w-2xl'>
      {/* Question Type Badge */}
      <div className='mb-4 md:mb-6'>
        <Badge variant='secondary' className='text-xs md:text-sm'>
          {getTypeLabel(question.questionTypeId)}
        </Badge>
      </div>

      <h2 className='text-foreground mb-6 text-xl leading-tight font-bold md:mb-8 md:text-3xl lg:text-4xl'>
        {question.name}
      </h2>

      {/* Question Type Component */}
      <Card className='p-4 md:p-8'>
        {typeName === 'true-false' && <TrueFalseQuestion question={question} />}
        {typeName === 'single-choice' && <SingleChoiceQuestion question={question} />}
        {typeName === 'multiple-choice' && <MultipleChoiceQuestion question={question} />}
        {typeName === 'short-answer' && <ShortAnswerQuestion question={question} />}
      </Card>
    </div>
  )
}
