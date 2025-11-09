'use client'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Save, Eye, FileText, Clock, Target, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

type QuestionFormData = {
  type: string
  orderIndex: number
  points: number
  content: string
  rubricCriterion: any[]
}

type AssignmentSidebarProps = {
  questions: QuestionFormData[]
  totalScore: number
  totalQuestions: number
  totalCriteria: number
  passingScore: number
  durationDays: number
  onSaveDraft?: () => void
  onPreview?: () => void
}

// Sortable Question Item Component
function SortableQuestionItem({ question, index }: { question: QuestionFormData; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.orderIndex
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50'
    >
      <button
        type='button'
        className='cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing'
        {...attributes}
        {...listeners}
      >
        <GripVertical className='h-4 w-4' />
      </button>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-gray-500'>Q{question.orderIndex}</span>
          <span className='text-xs text-gray-600'>({question.points} pts)</span>
        </div>
        <p className='truncate text-sm text-gray-700'>{truncateContent(question.content) || 'Empty question'}</p>
      </div>
    </div>
  )
}

export function AssignmentSidebar({
  questions,
  totalScore,
  totalQuestions,
  totalCriteria,
  passingScore,
  durationDays,
  onSaveDraft,
  onPreview
}: AssignmentSidebarProps) {
  return (
    <div className='sticky top-6 space-y-4'>
      {/* Quick Actions */}
      <Card>
        <CardHeader className='py-4'>
          <CardTitle className='text-lg'>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 py-4'>
          <Button onClick={onSaveDraft} variant='outline' className='w-full justify-start gap-2'>
            <Save className='h-4 w-4' />
            Save as Draft
          </Button>
          <Button onClick={onPreview} variant='outline' className='w-full justify-start gap-2'>
            <Eye className='h-4 w-4' />
            Preview Assignment
          </Button>
        </CardContent>
      </Card>

      {/* Questions Order */}
      <Card>
        <CardHeader className='py-4'>
          <CardTitle className='text-lg'>Questions Order</CardTitle>
          <p className='mt-1 text-xs text-gray-500'>Drag to reorder questions</p>
        </CardHeader>
        <CardContent className='space-y-2 py-4'>
          <SortableContext items={questions.map((q) => q.orderIndex)} strategy={verticalListSortingStrategy}>
            {questions.map((question, index) => (
              <SortableQuestionItem key={question.orderIndex} question={question} index={index} />
            ))}
          </SortableContext>
        </CardContent>
      </Card>

      {/* Assignment Summary */}
      <Card>
        <CardHeader className='py-4'>
          <CardTitle className='text-lg'>Assignment Summary</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Target className='h-4 w-4' />
              <span className='text-sm'>Total Score</span>
            </div>
            <span className='text-lg font-semibold'>{totalScore}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <FileText className='h-4 w-4' />
              <span className='text-sm'>Questions</span>
            </div>
            <span className='font-semibold'>{totalQuestions}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <FileText className='h-4 w-4' />
              <span className='text-sm'>Rubric Criteria</span>
            </div>
            <span className='font-semibold'>{totalCriteria}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Target className='h-4 w-4' />
              <span className='text-sm'>Passing Score</span>
            </div>
            <span className='font-semibold'>{passingScore}%</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Clock className='h-4 w-4' />
              <span className='text-sm'>Duration</span>
            </div>
            <span className='font-semibold'>{durationDays} days</span>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className='border-blue-200 bg-blue-50'>
        <CardHeader className='py-4'>
          <CardTitle className='text-lg'>Tips</CardTitle>
        </CardHeader>
        <CardContent className='py-4'>
          <ul className='space-y-2 text-sm text-gray-700'>
            <li className='flex gap-2'>
              <span className='text-blue-600'>•</span>
              <span>Make sure your questions are clear and specific</span>
            </li>
            <li className='flex gap-2'>
              <span className='text-blue-600'>•</span>
              <span>Add rubric criteria to help with grading</span>
            </li>
            <li className='flex gap-2'>
              <span className='text-blue-600'>•</span>
              <span>Set a reasonable passing score (typically 70-80%)</span>
            </li>
            <li className='flex gap-2'>
              <span className='text-blue-600'>•</span>
              <span>Preview your assignment before publishing</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
