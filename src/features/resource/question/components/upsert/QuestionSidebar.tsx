'use client'

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { SortableItem } from './SortableItem'
import { Plus } from 'lucide-react'
import { Question } from '@/features/resource/question/types/question.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { selectQuestion } from '@/features/resource/question/slice/questionSlice'

interface SidebarProps {
  questions: Question[]
  onReorderQuestions: (newOrder: Question[]) => void
}

export default function QuestionSidebar({ questions, onReorderQuestions }: SidebarProps) {
  const dispatch = useAppDispatch()
  const { selectedQuestionId } = useAppSelector((state) => state.question)
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = questions.findIndex((q) => q.id === active.id)
    const newIndex = questions.findIndex((q) => q.id === over.id)
    const reordered = arrayMove(questions, oldIndex, newIndex)
    onReorderQuestions(reordered)
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
          <button className='hover:bg-secondary text-foreground hover:text-primary rounded-lg transition-colors'>
            <Plus className='h-5 w-5' />
          </button>
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
