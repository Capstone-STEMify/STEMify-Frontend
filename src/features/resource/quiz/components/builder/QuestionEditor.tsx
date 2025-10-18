'use client'

import { Card } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Textarea } from '@/components/shadcn/textarea'
import { Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { mockQuestionTypes } from '@/features/resource/quiz/data/mock-data'
import { updateQuestion, updateQuiz } from '@/features/resource/quiz/slice/quiz-builder-slice'
import QuestionTypeSelector from '@/features/resource/quiz/components/builder/QuestionTypeSelector'
import AnswerOptionsManager from '@/features/resource/quiz/components/builder/AnswerOptionsManager'
import QuizSettings from '@/features/resource/quiz/components/builder/QuizSettings'

export default function QuestionEditor() {
  const { quiz, currentQuestionId } = useAppSelector((state) => state.quizBuilder)
  const dispatch = useAppDispatch()
  const [showSettings, setShowSettings] = useState(false)

  const currentQuestion = quiz.questions.find((q) => q.id === currentQuestionId)

  if (!currentQuestion) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-muted-foreground'>No question selected</p>
      </div>
    )
  }

  const getQuestionTypeLabel = (questionTypeId: number) => {
    const typeName = mockQuestionTypes.find((t) => t.id === questionTypeId)?.name || ''
    const labels: Record<string, string> = {
      'multiple-choice': 'Multiple choice',
      'single-choice': 'Single choice',
      'true-false': 'True/False',
      'short-answer': 'Short answer'
    }
    return labels[typeName] || typeName
  }

  return (
    <div className='max-w-4xl space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex-1'>
          <Input
            placeholder='Quiz Title'
            value={quiz.title}
            onChange={(e) => dispatch(updateQuiz({ title: e.target.value }))}
            className='text-xl font-semibold'
          />
        </div>
        <Button variant='outline' size='icon'>
          <Settings className='h-4 w-4' />
        </Button>
      </div>

      {/* Search Bar */}
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
        <Input placeholder='Search...' className='pl-10' />
      </div>

      {/* Question Card */}
      <Card className='space-y-6 p-6'>
        {/* Question Type and Required */}
        <div className='flex items-center justify-between'>
          <QuestionTypeSelector questionId={currentQuestion.id} />
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>Required</span>
            <input type='checkbox' className='h-5 w-5 rounded' />
          </div>
        </div>

        {/* Question Number and Text */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline'>Question {currentQuestion.orderIndex}</Badge>
            <Badge variant='secondary'>{getQuestionTypeLabel(currentQuestion.questionTypeId)}</Badge>
          </div>
          <Textarea
            placeholder='Enter your question here...'
            value={currentQuestion.name}
            onChange={(e) => dispatch(updateQuestion({ id: currentQuestion.id, updates: { name: e.target.value } }))}
            className='min-h-24'
          />
        </div>

        {/* Image Preview */}
        <div className='flex min-h-48 items-center justify-center rounded-lg bg-blue-100 p-8'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-lg bg-blue-200'>
              <span className='text-2xl text-blue-600'>📷</span>
            </div>
            <p className='text-muted-foreground text-sm'>Add image</p>
          </div>
        </div>

        {/* Answer Options */}
        <AnswerOptionsManager questionId={currentQuestion.id} />
      </Card>

      {/* Settings */}
      <QuizSettings questionId={currentQuestion.id} />
    </div>
  )
}
