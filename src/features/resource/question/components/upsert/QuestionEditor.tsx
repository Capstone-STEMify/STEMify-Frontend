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
import { Button } from '@/components/shadcn/button'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/features/resource/question/api/questionApi'
import { toast } from 'sonner'
import SSelect from '@/components/shared/SSelect'
import BackButton from '@/components/shared/button/BackButton'

interface Props {
  quizId: number
  questions: Question[]
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
  selectedQuestionId: number | null
}

export default function QuestionEditor({ quizId, questions, setQuestions, selectedQuestionId }: Props) {
  const question = questions.find((q) => q.id === selectedQuestionId)
  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestionApi] = useUpdateQuestionMutation()
  const [newAnswerText, setNewAnswerText] = useState('')
  const [answers, setAnswers] = useState<Answer[]>(question?.answers || [])

  useEffect(() => {
    if (question) setAnswers(question.answers)
  }, [question])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  if (!question) {
    return <div className='text-muted-foreground p-10'>Select a question to edit</div>
  }

  const updateQuestion = (updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === question.id ? { ...q, ...updates } : q)))
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = answers.findIndex((a) => a.id === active.id)
    const newIndex = answers.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(answers, oldIndex, newIndex)
    setAnswers(reordered)
    updateQuestion({ answers: reordered })
  }

  const handleTypeChange = (newType: QuestionType) => {
    if (newType === QuestionType.TRUE_FALSE) {
      const tfAnswers: Answer[] = [
        { id: 1, content: 'True', isCorrect: false },
        { id: 2, content: 'False', isCorrect: false }
      ]
      setAnswers(tfAnswers)
      updateQuestion({ questionType: newType, answers: tfAnswers })
    } else updateQuestion({ questionType: newType })
  }

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return
    const maxId = answers.length > 0 ? Math.max(...answers.map((a) => a.id)) : 0
    const newAnswer: Answer = { id: maxId + 1, content: newAnswerText.trim(), isCorrect: false }
    const updated = [...answers, newAnswer]
    setAnswers(updated)
    updateQuestion({ answers: updated })
    setNewAnswerText('')
  }

  const handleDelete = (id: number) => {
    const updated = answers.filter((a) => a.id !== id)
    setAnswers(updated)
    updateQuestion({ answers: updated })
  }

  const handleSaveChanges = async () => {
    const cleanedQuestions = questions.map((q) => {
      const clone = { ...q }

      if (!clone.id || clone.id < 0) delete (clone as any).id

      // Duyệt answers
      clone.answers = (clone.answers || []).map((a) => {
        const answer = { ...a }

        if (!clone.id || !answer.id || answer.id < 0) {
          delete (answer as any).id
        }

        return answer
      })

      return clone
    })

    try {
      let result
      if (questions.every((q) => !q.id)) {
        result = await createQuestion({ quizId, questions: cleanedQuestions }).unwrap()
        toast.success('Quiz created successfully')
      } else {
        result = await updateQuestionApi({ quizId, questions: cleanedQuestions }).unwrap()
        toast.success('Quiz updated successfully')
      }

      // Cập nhật lại state từ backend (đảm bảo answers mới có id thật)
      if (result?.data?.questions) {
        setQuestions(result.data.questions)
      }
    } catch (error) {
      toast.error('Failed to save questions')
    }
  }

  return (
    <div className='mx-auto space-y-6 px-10 pt-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <BackButton />
          <SSelect
            options={[
              { label: 'Single Choice', value: QuestionType.SINGLE_CHOICE },
              { label: 'Multiple Choice', value: QuestionType.MULTIPLE_CHOICE },
              { label: 'True/False', value: QuestionType.TRUE_FALSE }
            ]}
            placeholder='Select question type'
            value={question.questionType}
            onChange={(value) => handleTypeChange(value as QuestionType)}
          />
          <div className='flex items-center gap-3'>
            <Label htmlFor='points'>Points:</Label>
            <Input
              id='points'
              type='number'
              value={question.points}
              onChange={(e) => updateQuestion({ points: parseInt(e.target.value) || 0 })}
              className='w-20'
            />
          </div>
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <Card className='space-y-4 p-5'>
        <Label className='text-foreground font-semibold'>Question</Label>
        <Input
          value={question.content}
          onChange={(e) => updateQuestion({ content: e.target.value })}
          placeholder='Enter question content...'
        />

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
                              : answers.map((ans) => ({
                                  ...ans,
                                  isCorrect: ans.id === a.id
                                }))
                          setAnswers(updated)
                          updateQuestion({ answers: updated })
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
