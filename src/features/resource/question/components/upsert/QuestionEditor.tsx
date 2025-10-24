'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { Card } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Answer, QuestionType } from '@/features/resource/question/types/question.type'
import { SortableItem } from '@/features/resource/question/components/upsert/SortableItem'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { questionSlice, updateQuestion } from '@/features/resource/question/slice/questionSlice'
import { Button } from '@/components/shadcn/button'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/features/resource/question/api/questionApi'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import SSelect from '@/components/shared/SSelect'

export default function QuestionEditor() {
  const dispatch = useAppDispatch()
  const { quizId } = useParams()
  const { questions, selectedQuestionId } = useAppSelector((state) => state.question)
  const question = questions.find((q) => q.id === selectedQuestionId)
  const [createQuestion, { isLoading, isSuccess }] = useCreateQuestionMutation()
  const [updateQuestionApi] = useUpdateQuestionMutation()
  const [newAnswerText, setNewAnswerText] = useState('')
  const [answers, setAnswers] = useState<Answer[]>(question?.answers || [])

  useEffect(() => {
    if (question) setAnswers(question.answers)
  }, [question])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )
  if (!question) {
    return <div className='text-muted-foreground p-10'>Select a question to edit</div>
  }
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = answers.findIndex((a) => a.id === active.id)
    const newIndex = answers.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(answers, oldIndex, newIndex)
    setAnswers(reordered)
    dispatch(updateQuestion({ id: question.id, updates: { answers: reordered } }))
  }

  const handleTypeChange = (newType: QuestionType) => {
    if (newType === QuestionType.TRUE_FALSE) {
      const tfAnswers: Answer[] = [
        { id: 1, content: 'True', isCorrect: false },
        { id: 2, content: 'False', isCorrect: false }
      ]
      setAnswers(tfAnswers)
      dispatch(updateQuestion({ id: question.id, updates: { questionType: newType, answers: tfAnswers } }))
    } else {
      dispatch(updateQuestion({ id: question.id, updates: { questionType: newType } }))
    }
  }

  // 🧠 Add new answer
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
    dispatch(updateQuestion({ id: question.id, updates: { answers: updated } }))
    setNewAnswerText('')
  }

  // 🧠 Delete answer
  const handleDelete = (id: number) => {
    const updated = answers.filter((a) => a.id !== id)
    setAnswers(updated)
    dispatch(updateQuestion({ id: question.id, updates: { answers: updated } }))
  }

  const handleSaveChanges = async () => {
    // 🔹 Chuẩn hóa dữ liệu: xóa `id` nếu là câu hỏi mới
    const cleanedQuestions = questions.map((q) => {
      const clone = { ...q }
      if (!clone.id) delete (clone as any).id
      return clone
    })

    try {
      if (questions.every((q) => !q.id)) {
        await createQuestion({ quizId: Number(quizId), questions: cleanedQuestions })
        toast.success('Quiz created successfully')
      } else {
        await updateQuestionApi({ quizId: Number(quizId), questions: cleanedQuestions })
        toast.success('Quiz updated successfully')
      }
    } catch (error) {
      toast.error('Failed to save questions')
    }
  }

  return (
    <div className='mx-auto space-y-6 px-10 pt-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
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
              onChange={(e) =>
                dispatch(updateQuestion({ id: question.id, updates: { points: parseInt(e.target.value) || 0 } }))
              }
              className='w-20'
            />
          </div>
        </div>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      {/* Question content */}
      <Card className='space-y-4 p-5'>
        <Label className='text-foreground font-semibold'>Question</Label>
        <Input
          value={question.content}
          onChange={(e) => dispatch(updateQuestion({ id: question.id, updates: { content: e.target.value } }))}
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
                          dispatch(updateQuestion({ id: question.id, updates: { answers: updated } }))
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
