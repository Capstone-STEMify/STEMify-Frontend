'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { Card } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Answer, Question, QuestionType } from '@/features/resource/question/types/question.type'
import { SortableItem } from '@/features/resource/question/components/upsert/SortableItem'
import { useAppDispatch } from '@/hooks/redux-hooks'

interface Props {
  question: Question
  onUpdateQuestion: (updates: Partial<Question>) => void
}

export default function QuestionEditor({ question, onUpdateQuestion }: Props) {
  const [answers, setAnswers] = useState<Answer[]>(question.answers)
  const [newAnswerText, setNewAnswerText] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    setAnswers(question.answers)
  }, [question.answers])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return
    const maxId = answers.length > 0 ? Math.max(...answers.map((a) => a.id)) : 0
    const newAnswer: Answer = {
      id: maxId + 1,
      content: newAnswerText.trim(),
      isCorrect: false
    }
    const updated = [...answers, newAnswer]
    setAnswers(updated)
    onUpdateQuestion({ answers: updated })
    setNewAnswerText('')
  }

  const handleDelete = (id: number) => {
    const updated = answers.filter((a) => a.id !== id)
    setAnswers(updated)
    onUpdateQuestion({ answers: updated })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = answers.findIndex((a) => a.id === active.id)
    const newIndex = answers.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(answers, oldIndex, newIndex)
    setAnswers(reordered)
    onUpdateQuestion({ answers: reordered })
  }

  const handleTypeChange = (newType: QuestionType) => {
    if (newType === QuestionType.TRUE_FALSE) {
      const tfAnswers: Answer[] = [
        { id: 1, content: 'True', isCorrect: false },
        { id: 2, content: 'False', isCorrect: false }
      ]
      setAnswers(tfAnswers)
      onUpdateQuestion({ questionType: newType, answers: tfAnswers })
    } else {
      onUpdateQuestion({ questionType: newType })
    }
  }

  return (
    <div className='mx-auto space-y-6 px-10 pt-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <select
          value={question.questionType}
          onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
          className='bg-primary/10 text-primary rounded-lg border px-4 py-2 font-medium'
        >
          <option value='SingleChoice'>Single Choice</option>
          <option value='MultipleChoice'>Multiple Choice</option>
          <option value='TrueFalse'>True/False</option>
        </select>

        <div className='flex items-center gap-3'>
          <Label htmlFor='points'>Points:</Label>
          <Input
            id='points'
            type='number'
            value={question.points}
            onChange={(e) => onUpdateQuestion({ points: parseInt(e.target.value) || 0 })}
            className='w-20'
          />
        </div>
      </div>

      {/* Question content */}
      <Card className='space-y-4 p-5'>
        <Label className='text-foreground font-semibold'>Question</Label>
        <Input
          value={question.content}
          onChange={(e) => onUpdateQuestion({ content: e.target.value })}
          placeholder='Enter question content...'
        />

        {/* Answers */}
        <Label className='text-foreground mt-4 font-semibold'>Answers</Label>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={answers.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className='space-y-3'>
              {answers.map((a) => (
                <SortableItem key={a.id} id={a.id}>
                  <div className='bg-secondary hover:bg-secondary/80 flex items-center justify-between rounded-lg p-3'>
                    <div className='flex items-center gap-2'>
                      <input
                        type={question.questionType === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                        checked={a.isCorrect}
                        onChange={() => {
                          const updated =
                            question.questionType === QuestionType.MULTIPLE_CHOICE
                              ? answers.map((ans) => (ans.id === a.id ? { ...ans, isCorrect: !ans.isCorrect } : ans))
                              : answers.map((ans) => ({ ...ans, isCorrect: ans.id === a.id }))
                          setAnswers(updated)
                          onUpdateQuestion({ answers: updated })
                        }}
                      />
                      <span>{a.content}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className='hover:bg-destructive/20 text-destructive rounded-lg p-2'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add answer */}
        {question.questionType !== QuestionType.TRUE_FALSE && (
          <div className='mt-3 flex gap-2'>
            <Input
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              placeholder='Add answer...'
            />
            <button onClick={handleAddAnswer} className='bg-primary text-primary-foreground rounded-lg px-4 py-2'>
              Add
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
