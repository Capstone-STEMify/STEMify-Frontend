'use client'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'

import { Save, Eye, FileText, Clock, Target } from 'lucide-react'

type AssignmentSidebarProps = {
  totalScore: number
  totalQuestions: number
  totalCriteria: number
  passingScore: number
  durationDays: number
  onSaveDraft?: () => void
  onPreview?: () => void
}

export function AssignmentSidebar({
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
