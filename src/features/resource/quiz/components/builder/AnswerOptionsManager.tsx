'use client'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Trash2, Plus, GripVertical } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { mockQuestionTypes } from '@/features/resource/quiz/data/mock-data'
import { addAnswer, deleteAnswer, updateAnswer } from '@/features/resource/quiz/slice/quiz-builder-slice'

interface AnswerOptionsManagerProps {
  questionId: number
}

export default function AnswerOptionsManager({ questionId }: AnswerOptionsManagerProps) {
  const { quiz } = useAppSelector((state) => state.quizBuilder)
  const dispatch = useAppDispatch()
  const question = quiz.questions.find((q) => q.id === questionId)

  if (!question) return null

  const typeName = mockQuestionTypes.find((t) => t.id === question.questionTypeId)?.name || ''

  if (typeName === 'true-false') {
    return (
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold'>Choices</span>
        </div>

        <div className='space-y-2'>
          {[
            { id: 1, content: 'True' },
            { id: 2, content: 'False' }
          ].map((option) => (
            <div key={option.id} className='bg-muted flex items-center gap-3 rounded-lg p-3'>
              <RadioGroup
                value={question.answers.find((a) => a.content === option.content && a.isCorrect)?.id.toString() || ''}
                onValueChange={(value) => {
                  question.answers.forEach((answer) => {
                    if (answer.content === option.content) {
                      dispatch(
                        updateAnswer({
                          questionId,
                          answerId: answer.id,
                          updates: { isCorrect: value === answer.id.toString() }
                        })
                      )
                    } else {
                      dispatch(updateAnswer({ questionId, answerId: answer.id, updates: { isCorrect: false } }))
                    }
                  })
                }}
              >
                <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
              </RadioGroup>
              <label htmlFor={`option-${option.id}`} className='flex-1 cursor-pointer font-medium'>
                {option.content}
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (typeName === 'short-answer') {
    return (
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold'>Correct Answer</span>
        </div>

        <div className='space-y-2'>
          {question.answers.map((answer, index) => (
            <div key={answer.id} className='bg-muted flex items-center gap-3 rounded-lg p-3'>
              <GripVertical className='text-muted-foreground h-4 w-4 cursor-grab' />
              <Input
                value={answer.content}
                onChange={(e) =>
                  dispatch(updateAnswer({ questionId, answerId: answer.id, updates: { content: e.target.value } }))
                }
                placeholder={`Correct answer ${index + 1}`}
                className='flex-1'
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => dispatch(deleteAnswer({ questionId, answerId: answer.id }))}
              >
                <Trash2 className='text-destructive h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant='outline'
          className='w-full bg-transparent'
          onClick={() =>
            dispatch(
              addAnswer({
                questionId,
                answer: {
                  id: Math.max(...question.answers.map((a) => a.id), 0) + 1,
                  questionId: question.id,
                  content: '',
                  isCorrect: true
                }
              })
            )
          }
        >
          <Plus className='mr-2 h-4 w-4' />
          Add answer
        </Button>
      </div>
    )
  }

  const isMultipleChoice = typeName === 'multiple-choice'

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-semibold'>Choices</span>
        <div className='flex gap-2'>
          {isMultipleChoice && (
            <>
              <Button variant='outline' size='sm' className='bg-transparent text-xs'>
                Multiple answer
              </Button>
              <Button variant='outline' size='sm' className='bg-transparent text-xs'>
                Answer with image
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        {question.answers.map((answer, index) => (
          <div key={answer.id} className='bg-muted flex items-center gap-3 rounded-lg p-3'>
            <GripVertical className='text-muted-foreground h-4 w-4 cursor-grab' />

            {isMultipleChoice ? (
              <Checkbox
                checked={answer.isCorrect}
                onCheckedChange={(checked) =>
                  dispatch(
                    updateAnswer({ questionId, answerId: answer.id, updates: { isCorrect: checked as boolean } })
                  )
                }
              />
            ) : (
              <RadioGroup
                value={answer.isCorrect ? answer.id.toString() : ''}
                onValueChange={(value) =>
                  dispatch(
                    updateAnswer({
                      questionId,
                      answerId: answer.id,
                      updates: { isCorrect: value === answer.id.toString() }
                    })
                  )
                }
              >
                <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
              </RadioGroup>
            )}

            <Input
              value={answer.content}
              onChange={(e) =>
                dispatch(updateAnswer({ questionId, answerId: answer.id, updates: { content: e.target.value } }))
              }
              placeholder={`Option ${index + 1}`}
              className='flex-1'
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => dispatch(deleteAnswer({ questionId, answerId: answer.id }))}
            >
              <Trash2 className='text-destructive h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant='outline'
        className='w-full bg-transparent'
        onClick={() =>
          dispatch(
            addAnswer({
              questionId,
              answer: {
                id: Math.max(...question.answers.map((a) => a.id), 0) + 1,
                questionId: question.id,
                content: '',
                isCorrect: false
              }
            })
          )
        }
      >
        <Plus className='mr-2 h-4 w-4' />
        Add answers
      </Button>
    </div>
  )
}
