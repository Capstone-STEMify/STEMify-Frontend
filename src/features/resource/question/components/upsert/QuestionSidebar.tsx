'use client'

import type React from 'react'

import { Plus, MoreVertical, GripVertical } from 'lucide-react'

interface Question {
  id: number
  title: string
  type: string
  required: boolean
}

interface SidebarProps {
  questions: Question[]
  selectedQuestion: number
  onSelectQuestion: (id: number) => void
  onReorderQuestions: (fromIndex: number, toIndex: number) => void
  draggedQuestion: number | null
  onDraggedQuestion: (id: number | null) => void
}

export default function QuestionSidebar({
  questions,
  selectedQuestion,
  onSelectQuestion,
  onReorderQuestions,
  draggedQuestion,
  onDraggedQuestion
}: SidebarProps) {
  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'single-choice':
        return 'Single choice'
      case 'multiple-choice':
        return 'Multiple choice'
      case 'true-false':
        return 'True/False'
      default:
        return 'Multiple choice'
    }
  }

  const handleDragStart = (index: number) => {
    onDraggedQuestion(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (toIndex: number) => {
    if (draggedQuestion !== null && draggedQuestion !== toIndex) {
      onReorderQuestions(draggedQuestion, toIndex)
    }
    onDraggedQuestion(null)
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
      <div className='flex-1 overflow-auto'>
        <div className='space-y-2 p-4'>
          {questions.map((question, index) => (
            <div
              key={question.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className={`group flex cursor-move items-start gap-3 rounded-lg p-3 transition-all ${
                selectedQuestion === question.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : draggedQuestion === index
                    ? 'bg-secondary/50 opacity-50'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
              }`}
            >
              <GripVertical className='mt-1 h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
              <button onClick={() => onSelectQuestion(question.id)} className='min-w-0 flex-1 text-left'>
                <div className='truncate text-sm font-semibold'>Q{question.id}</div>
                <div className='mt-1 truncate text-xs opacity-75'>{question.title}</div>
                <div className='mt-2 text-xs opacity-60'>{getTypeDisplayName(question.type)}</div>
              </button>
              <button className='hover:bg-primary/20 flex-shrink-0 rounded p-1 opacity-0 transition-colors group-hover:opacity-100'>
                <MoreVertical className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
