'use client'

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'
import { Plus } from 'lucide-react'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { addQuestion, selectQuestion, reorderQuestions } from '@/features/resource/question/slice/questionSlice'
import { Button } from '@/components/shadcn/button'

export default function QuestionSidebar() {
  const dispatch = useAppDispatch()
  const { questions, selectedQuestionId } = useAppSelector((state) => state.question)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = questions.findIndex((q) => q.id === active.id)
    const newIndex = questions.findIndex((q) => q.id === over.id)
    const reordered = arrayMove(questions, oldIndex, newIndex)
    dispatch(reorderQuestions(reordered))
  }

  const handleAddQuestion = () => {
    const tempId = -(questions.length + 1)
    const newQuestion: Question = {
      id: tempId,
      questionType: QuestionType.SINGLE_CHOICE,
      content: 'New question',
      orderIndex: questions.length + 1,
      answerExplanation: '',
      points: 1,
      answers: []
    }

    dispatch(addQuestion(newQuestion))
    dispatch(selectQuestion(newQuestion.id))
  }

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'SingleChoice':
        return 'Single choice'
      case 'MultipleChoice':
        return 'Multiple choice'
      case 'TrueFalse':
        return 'True/False'
      default:
        return 'Unknown'
    }
  }

  return (
    <aside className='border-border bg-card flex w-64 flex-col border-r'>
      <div className='border-border border-b p-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-foreground text-lg font-bold'>Questions</h2>
          <Button variant='ghost' onClick={handleAddQuestion}>
            <Plus className='h-5 w-5' />
          </Button>
        </div>
        <p className='text-muted-foreground mt-1 text-sm'>{questions.length} questions</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className='flex-1 space-y-2 overflow-auto p-4'>
            {questions.map((question, index) => (
              <SortableItem key={question.id} id={question.id}>
                <button
                  onPointerDown={() => dispatch(selectQuestion(question.id))}
                  className={`group flex w-full flex-col rounded-lg p-3 text-left transition-all ${
                    selectedQuestionId === question.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  <div className='font-semibold'>Q{index + 1}</div>
                  <div className='truncate text-sm'>{question.content}</div>
                  <div className='text-xs opacity-70'>{getTypeDisplayName(question.questionType)}</div>
                </button>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </aside>
  )
}
