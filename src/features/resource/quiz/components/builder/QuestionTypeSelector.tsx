'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { CheckCircle2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { mockQuestionTypes } from '@/features/resource/quiz/data/mock-data'
import { updateQuestion } from '@/features/resource/quiz/slice/quiz-builder-slice'

interface QuestionTypeSelectorProps {
  questionId: number
}

export default function QuestionTypeSelector({ questionId }: QuestionTypeSelectorProps) {
  const { quiz } = useAppSelector((state) => state.quizBuilder)
  const dispatch = useAppDispatch()
  const question = quiz.questions.find((q) => q.id === questionId)

  if (!question) return null

  const currentTypeName = mockQuestionTypes.find((t) => t.id === question.questionTypeId)?.name || ''

  const getTypeLabel = (name: string) => {
    const labels: Record<string, string> = {
      'multiple-choice': 'Multiple choice',
      'single-choice': 'Single choice',
      'true-false': 'True/False',
      'short-answer': 'Short answer'
    }
    return labels[name] || name
  }

  return (
    <div className='flex items-center gap-2'>
      <CheckCircle2 className='text-primary h-5 w-5' />
      <Select
        value={currentTypeName}
        onValueChange={(value) => {
          const typeId = mockQuestionTypes.find((t) => t.name === value)?.id || 1
          dispatch(updateQuestion({ id: questionId, updates: { questionTypeId: typeId } }))
        }}
      >
        <SelectTrigger className='w-48'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {mockQuestionTypes.map((type) => (
            <SelectItem key={type.id} value={type.name}>
              {getTypeLabel(type.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
