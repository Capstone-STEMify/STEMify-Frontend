'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { useQuizBuilder } from '@/features/resource/section/components/quiz/context/quiz-builder-context'
import { CheckCircle2 } from 'lucide-react'

interface QuestionTypeSelectorProps {
  questionId: string
}

export default function QuestionTypeSelector({ questionId }: QuestionTypeSelectorProps) {
  const { quiz, updateQuestion } = useQuizBuilder()
  const question = quiz.questions.find((q) => q.id === questionId)

  if (!question) return null

  return (
    <div className='flex items-center gap-2'>
      <CheckCircle2 className='text-primary h-5 w-5' />
      <Select value={question.type} onValueChange={(value: any) => updateQuestion(questionId, { type: value })}>
        <SelectTrigger className='w-48'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='multiple-choice'>Multiple choice</SelectItem>
          <SelectItem value='single-choice'>Single choice</SelectItem>
          <SelectItem value='true-false'>True/False</SelectItem>
          <SelectItem value='short-answer'>Short answer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
