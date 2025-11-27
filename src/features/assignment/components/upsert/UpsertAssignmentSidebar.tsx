'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { FileText, Clock, Target, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTranslations } from 'next-intl'

type QuestionFormData = {
  type: string
  orderIndex: number
  points: number
  content: string
  rubricCriterion: Array<{
    criterionName: string
    maxPoints: number
  }>
}

type AssignmentSidebarProps = {
  questions: QuestionFormData[]
  totalScore: number
  totalQuestions: number
  totalCriteria: number
  passingScore: number
  durationDays: number
}

// Sortable Question Item Component
function SortableQuestionItem({ question, index }: { question: QuestionFormData; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.orderIndex
  })
  const ta = useTranslations('assignment')

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // ✅ Calculate total points from rubric criteria
  const questionPoints = question.rubricCriterion.reduce((acc, curr) => acc + (curr.maxPoints || 0), 0)

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
          <span className='text-xs text-gray-600'>
            ({questionPoints} {ta('upsert.question.point')})
          </span>
        </div>
        <p className='truncate text-sm text-gray-700'>
          {truncateContent(question.content) || ta('upsert.question.emptyQuestion')}
        </p>
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
  durationDays
}: AssignmentSidebarProps) {
  const ta = useTranslations('assignment')
  return (
    <div className='sticky top-6 space-y-4'>
      {/* Questions Order */}
      <Card>
        <CardHeader className='py-4'>
          <CardTitle className='text-lg'>{ta('upsert.question.question')}</CardTitle>
          <p className='mt-1 text-xs text-gray-500'>{ta('upsert.question.questionOrderSubtitle')}</p>
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
          <CardTitle className='text-lg'>{ta('upsert.summary')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Target className='h-4 w-4' />
              <span className='text-sm'>{ta('upsert.totalPoints')}</span>
            </div>
            <span className='text-lg font-semibold'>{totalScore}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <FileText className='h-4 w-4' />
              <span className='text-sm'>{ta('upsert.question.question')}</span>
            </div>
            <span className='font-semibold'>{totalQuestions}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Target className='h-4 w-4' />
              <span className='text-sm'>{ta('upsert.passingScore')}</span>
            </div>
            <span className='font-semibold'>{passingScore}</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <Clock className='h-4 w-4' />
              <span className='text-sm'>{ta('upsert.duration')}</span>
            </div>
            <span className='font-semibold'>
              {durationDays} {ta('upsert.days')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
