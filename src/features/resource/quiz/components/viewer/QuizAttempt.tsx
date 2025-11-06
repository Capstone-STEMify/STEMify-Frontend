import { useGetStudentQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { QuizAttemptStatus } from '@/features/resource/quiz/types/quiz.type'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'

type QuizAttemptProps = {
  studentQuizId: number
}

export default function QuizAttempt({ studentQuizId }: QuizAttemptProps) {
  const { data: studentQuiz, isLoading: isLoadingStudentQuiz } = useGetStudentQuizByIdQuery(studentQuizId!, {
    skip: !studentQuizId
  })

  if (isLoadingStudentQuiz) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-48 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    )
  }

  if (!studentQuiz?.data) {
    return (
      <div className='flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-8'>
        <div className='text-center'>
          <AlertCircle className='mx-auto mb-2 h-12 w-12 text-amber-500' />
          <p className='text-lg font-medium text-amber-900'>No quiz attempt data available</p>
        </div>
      </div>
    )
  }

  const quizData = studentQuiz.data
  const completedAttempts = quizData.attempts.filter((a) => a.status !== QuizAttemptStatus.IN_PROGRESS)

  const getStatusBadge = (status: QuizAttemptStatus) => {
    switch (status) {
      case QuizAttemptStatus.PASSED:
        return (
          <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
            <CheckCircle2 className='mr-1 h-3 w-3' />
            Passed
          </Badge>
        )
      case QuizAttemptStatus.FAILED:
        return (
          <Badge className='bg-red-100 text-red-700 hover:bg-red-100'>
            <XCircle className='mr-1 h-3 w-3' />
            Failed
          </Badge>
        )
      case QuizAttemptStatus.IN_PROGRESS:
        return (
          <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-100'>
            <Clock className='mr-1 h-3 w-3' />
            In Progress
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDuration = (startedAt: string, completedAt?: string) => {
    if (!completedAt) return 'N/A'
    const start = new Date(startedAt).getTime()
    const end = new Date(completedAt).getTime()
    const minutes = Math.floor((end - start) / 60000)
    const seconds = Math.floor(((end - start) % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className='space-y-6'>
      {/* Overall Summary Card */}
      <Card className='border-gray-200 shadow-sm'>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-xl font-semibold text-gray-900'>Quiz Summary</h2>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Target className='h-4 w-4' />
                <span>Final Score</span>
              </div>
              <p className='text-2xl font-bold text-gray-900'>{quizData.finalScore}%</p>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <TrendingUp className='h-4 w-4' />
                <span>Status</span>
              </div>
              <div>{getStatusBadge(quizData.status)}</div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Trophy className='h-4 w-4' />
                <span>Attempts</span>
              </div>
              <p className='text-2xl font-bold text-gray-900'>{quizData.attemptCount}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Calendar className='h-4 w-4' />
                <span>Due Date</span>
              </div>
              <p className='text-sm font-medium text-gray-900'>{formatDate(quizData.dueDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attempts History */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 border-b border-gray-200 pb-3'>
          <h2 className='text-xl font-semibold text-gray-900'>Attempt History</h2>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
            {completedAttempts.length}
          </span>
        </div>

        <div className='space-y-3'>
          {completedAttempts.map((attempt) => {
            const totalQuestions = attempt.questionAttempts.length
            const correctAnswers = attempt.questionAttempts.filter((qa) => qa.isCorrect).length

            return (
              <Card key={attempt.id}>
                <CardContent className='p-0'>
                  <div className='flex items-center justify-between p-4'>
                    <div className='flex flex-1 items-center gap-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                        <span className='text-lg font-bold text-blue-700'>#{attempt.attemptNumber}</span>
                      </div>

                      <div className='flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <h3 className='font-semibold text-gray-900'>Attempt {attempt.attemptNumber}</h3>
                          {getStatusBadge(attempt.status)}
                        </div>
                        <div className='flex flex-wrap items-center gap-3 text-sm text-gray-600'>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-3.5 w-3.5' />
                            {formatDate(attempt.startedAt)}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Target className='h-3.5 w-3.5' />
                            {correctAnswers}/{totalQuestions} correct
                          </span>
                          <span className='flex items-center gap-1'>
                            <TrendingUp className='h-3.5 w-3.5' />
                            Duration: {calculateDuration(attempt.startedAt, attempt.completedAt)}
                          </span>
                        </div>
                      </div>

                      <div className='mr-5 flex items-center gap-3'>
                        <div className='text-right'>
                          <p className='text-sm text-gray-600'>Score</p>
                          <p className='text-2xl font-bold text-gray-900'>{attempt.totalScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {completedAttempts.length === 0 && (
          <div className='flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8'>
            <div className='text-center'>
              <Clock className='mx-auto mb-2 h-12 w-12 text-gray-400' />
              <p className='text-lg font-medium text-gray-600'>No completed attempts yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
