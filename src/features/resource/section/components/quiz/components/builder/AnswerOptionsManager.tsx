'use client'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { useQuizBuilder } from '@/features/resource/section/components/quiz/context/quiz-builder-context'
import { Trash2, Plus, GripVertical } from 'lucide-react'

interface AnswerOptionsManagerProps {
  questionId: string
}

export default function AnswerOptionsManager({ questionId }: AnswerOptionsManagerProps) {
  const { quiz, addAnswer, deleteAnswer, updateAnswer } = useQuizBuilder()
  const question = quiz.questions.find((q) => q.id === questionId)

  if (!question) return null

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-semibold'>Choices</span>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' className='bg-transparent text-xs'>
            Multiple answer
          </Button>
          <Button variant='outline' size='sm' className='bg-transparent text-xs'>
            Answer with image
          </Button>
        </div>
      </div>

      <div className='space-y-2'>
        {question.answers.map((answer, index) => (
          <div key={answer.id} className='bg-muted flex items-center gap-3 rounded-lg p-3'>
            <GripVertical className='text-muted-foreground h-4 w-4 cursor-grab' />
            <RadioGroup
              value={answer.isCorrect ? answer.id : ''}
              onValueChange={(value) =>
                updateAnswer(questionId, answer.id, {
                  isCorrect: value === answer.id
                })
              }
            >
              <RadioGroupItem value={answer.id} id={answer.id} />
            </RadioGroup>
            <Input
              value={answer.text}
              onChange={(e) => updateAnswer(questionId, answer.id, { text: e.target.value })}
              placeholder={`Option ${index + 1}`}
              className='flex-1'
            />
            <Button variant='ghost' size='icon' onClick={() => deleteAnswer(questionId, answer.id)}>
              <Trash2 className='text-destructive h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant='outline'
        className='w-full bg-transparent'
        onClick={() =>
          addAnswer(questionId, {
            id: `a${Date.now()}`,
            text: '',
            isCorrect: false
          })
        }
      >
        <Plus className='mr-2 h-4 w-4' />
        Add answers
      </Button>
    </div>
  )
}
