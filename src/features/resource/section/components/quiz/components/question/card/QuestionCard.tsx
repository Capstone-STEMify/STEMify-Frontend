'use client'

import { Badge } from '@/components/shadcn/badge'
import { Card } from '@/components/shadcn/card'
import MultipleChoiceQuestion from '@/features/resource/section/components/quiz/components/question/types/MultipleChoiceQuestion'
import ShortAnswerQuestion from '@/features/resource/section/components/quiz/components/question/types/ShortAnswerQuestion'
import SingleChoiceQuestion from '@/features/resource/section/components/quiz/components/question/types/SingleChoiceQuestion'
import TrueFalseQuestion from '@/features/resource/section/components/quiz/components/question/types/TrueFalseQuestion'
import { Question } from '@/features/resource/section/components/quiz/components/quiz-context'

type QuestionCardProps = {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'true-false': 'Đúng/Sai',
      'single-choice': 'Chọn một đáp án',
      'multiple-choice': 'Chọn nhiều đáp án',
      'short-answer': 'Trả lời ngắn'
    }
    return labels[type] || type
  }

  return (
    <div className='w-full max-w-2xl'>
      {/* Question Type Badge */}
      <div className='mb-6'>
        <Badge variant='secondary' className='text-xs md:text-sm'>
          {getTypeLabel(question.type)}
        </Badge>
      </div>

      {/* Question Text */}
      <h2 className='text-foreground mb-8 text-3xl leading-tight font-bold md:text-4xl'>{question.question}</h2>

      {/* Question Type Component */}
      <Card className='p-4 md:p-8'>
        {question.type === 'true-false' && <TrueFalseQuestion question={question} />}
        {question.type === 'single-choice' && <SingleChoiceQuestion question={question} />}
        {question.type === 'multiple-choice' && <MultipleChoiceQuestion question={question} />}
        {question.type === 'short-answer' && <ShortAnswerQuestion question={question} />}
      </Card>
    </div>
  )
}
