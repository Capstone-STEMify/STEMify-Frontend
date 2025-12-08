import { useGetStudentQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import React from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { AlertCircle, CheckCircle2, XCircle, Clock, Eye, ArrowLeft } from 'lucide-react'
import { QuizAttemptStatus, Attempt } from '@/features/resource/quiz/types/quiz.type'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import QuizResult from '@/features/resource/quiz/components/player/QuizResult'
import { useLocale, useTranslations } from 'next-intl'
import { formatDate } from '@/utils/index'
import { cn } from '@/utils/shadcn/utils'

type QuizAttemptProps = {
  studentQuizId: number
  selectedAttempt: Attempt | null
  onSelectAttempt: (attempt: Attempt | null) => void
}

export default function QuizAttempt({ studentQuizId, selectedAttempt, onSelectAttempt }: QuizAttemptProps) {
  const locale = useLocale()
  const tc = useTranslations('common')
  const tq = useTranslations('quiz.detail')

  const { data: studentQuiz, isLoading: isLoadingStudentQuiz, refetch } = useGetStudentQuizByIdQuery(studentQuizId)

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
          <p className='text-lg font-medium text-amber-900'>{tq('noData')}</p>
        </div>
      </div>
    )
  }

  const quizData = studentQuiz.data
  const completedAttempts = quizData.attempts.filter((a) => a.status !== QuizAttemptStatus.IN_PROGRESS)

  // Nếu đang xem một attempt cụ thể, render QuizResult thay thế toàn bộ
  if (selectedAttempt && quizData.quizId) {
    return (
      <div className='space-y-4'>
        <Button variant='outline' onClick={() => onSelectAttempt(null)} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {tc('button.back')}
        </Button>
        <QuizResult quizId={quizData.quizId} studentQuizAttempt={selectedAttempt} />
      </div>
    )
  }

  const getStatusBadge = (status: QuizAttemptStatus) => {
    switch (status) {
      case QuizAttemptStatus.PASSED:
        return (
          <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
            <CheckCircle2 className='mr-1 h-3 w-3' />
            {tc('status.passed')}
          </Badge>
        )
      case QuizAttemptStatus.FAILED:
        return (
          <Badge className='bg-red-100 text-red-700 hover:bg-red-100'>
            <XCircle className='mr-1 h-3 w-3' />
            {tc('status.failed')}
          </Badge>
        )
      case QuizAttemptStatus.IN_PROGRESS:
        return (
          <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-100'>
            <Clock className='mr-1 h-3 w-3' />
            {tc('status.inProgress')}
          </Badge>
        )
    }
  }

  const calculateDuration = (startedAt: string, completedAt?: string) => {
    if (!completedAt) return '00:00'

    const start = new Date(startedAt).getTime()
    const end = new Date(completedAt).getTime()

    const totalSeconds = Math.max(0, Math.floor((end - start) / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const isBeforeDueDate = new Date() < new Date(studentQuiz.data.dueDate)

  return (
    <div className='space-y-6'>
      {/* Overall Summary Card */}
      {completedAttempts.length > 0 && (
        <Card className='border-gray-200 bg-sky-100 shadow-sm'>
          <CardContent className='p-6'>
            <p className='text-xl font-semibold text-gray-900'>
              {tq('yourFinalScore')}: {quizData.finalScore}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* Attempts History */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 border-b border-gray-200 pb-3'>
          <h2 className='text-xl font-semibold text-gray-900'>{tq('attemptHistory')}</h2>
          <span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'>
            {completedAttempts.length}
          </span>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tc('tableHeader.status')}</TableHead>
                <TableHead>{tc('tableHeader.score')}</TableHead>
                <TableHead>{tc('tableHeader.correctAnswer')}</TableHead>
                <TableHead>{tc('tableHeader.quizDuration')}</TableHead>
                <TableHead>{tc('tableHeader.submissionDate')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedAttempts.map((attempt) => {
                const totalQuestions = attempt.questionAttempts.length
                const correctAnswers = attempt.questionAttempts.filter((qa) => qa.isCorrect).length
                return (
                  <TableRow key={attempt.id}>
                    <TableCell>{getStatusBadge(attempt.status)}</TableCell>
                    <TableCell className='text-right'>
                      <span className='flex items-center gap-1.5 text-sm text-gray-600'>{attempt.totalScore}%</span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                        {correctAnswers}/{totalQuestions}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                        {calculateDuration(attempt.startedAt, attempt.completedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                        <Clock className='h-3.5 w-3.5' />
                        {formatDate(attempt.completedAt, { locale })}
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Eye
                        className={cn(
                          'h-5 w-5',
                          isBeforeDueDate
                            ? 'cursor-not-allowed text-gray-300'
                            : 'cursor-pointer text-gray-400 hover:text-gray-600'
                        )}
                        onClick={() => {
                          if (isBeforeDueDate) return
                          onSelectAttempt(attempt)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {completedAttempts.length === 0 && (
          <div className='flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8'>
            <div className='text-center'>
              <Clock className='mx-auto mb-2 h-12 w-12 text-gray-400' />
              <p className='text-lg font-medium text-gray-600'>{tq('noAttempts')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
