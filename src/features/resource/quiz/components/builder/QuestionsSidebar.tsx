'use client'

import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/shadcn/badge'
import { useQuizBuilder } from '@/features/resource/section/components/quiz/context/quiz-builder-context'

interface QuestionsSidebarProps {
  onClose?: () => void
}

export default function QuestionsSidebar({ onClose }: QuestionsSidebarProps) {
  const { quiz, currentQuestionId, setCurrentQuestionId, addQuestion, deleteQuestion } = useQuizBuilder()

  return (
    <div className='space-y-4 p-4'>
      <div>
        <h2 className='text-muted-foreground mb-3 text-sm font-semibold'>QUESTIONS ({quiz.questions.length})</h2>
        <Button onClick={addQuestion} variant='outline' size='sm' className='w-full bg-transparent'>
          <Plus className='mr-2 h-4 w-4' />
          Add Question
        </Button>
      </div>

      <div className='space-y-2'>
        {quiz.questions.map((question) => (
          <Card
            key={question.id}
            className={`cursor-pointer p-3 transition-colors ${
              currentQuestionId === question.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            onClick={() => {
              setCurrentQuestionId(question.id)
              onClose?.()
            }}
          >
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-semibold'>{question.number}</p>
                <p className='truncate text-xs opacity-75'>{question.text || 'Untitled question'}</p>
                <Badge variant='secondary' className='mt-2 text-xs'>
                  {question.type === 'multiple-choice'
                    ? 'Multiple choice'
                    : question.type === 'single-choice'
                      ? 'Single choice'
                      : question.type === 'true-false'
                        ? 'True/False'
                        : 'Short answer'}
                </Badge>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 flex-shrink-0'
                onClick={(e) => {
                  e.stopPropagation()
                  deleteQuestion(question.id)
                }}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
