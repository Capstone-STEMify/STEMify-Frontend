import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog'
import { SubmissionReviewDialog } from '../dialog/SubmissionReviewDialog'
import { format } from 'date-fns'
import React, { useState } from 'react'
import {
  AssignmentAttempt,
  AssignmentStatistics,
  StudentStatistic
} from '@/features/assignment/types/assigmentlistdetail.type'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { formatDate } from '@/utils/index'
import { useTranslations } from 'next-intl'

export type SubmissionStatus =
  | 'Passed'
  | 'Failed'
  | 'Not Submitted'
  | 'Submitted'
  | 'Pending'
  | 'UnderReview'
  | 'Graded'
  | string

export type Submission = {
  id: string
  studentName: string
  imageUrl: string
  submittedDate: string | null
  status: SubmissionStatus
  grade: string | null
  studentAssignmentId: number | null
  studentRole: string
  quizTitle: string
  quizFinishedDate: string
  quizQuestionCount: number
  accuracy: string | null
  point: number | null
  answered: string | null
  comment: string | null
  attempts: AssignmentAttempt[]
}

function mapApiToSubmissions(students: StudentStatistic[], assignmentTitle: string): Submission[] {
  return students.map((student) => {
    const latestAttempt = student.attempts.length > 0 ? student.attempts[student.attempts.length - 1] : null

    let grade: string | null = null
    // Show grade for attempts that have been reviewed (Graded, Passed, or Failed)
    if (latestAttempt && (latestAttempt.status === 'Graded' || latestAttempt.status === 'Passed' || latestAttempt.status === 'Failed')) {
      grade = `${latestAttempt.totalScore}`
    }

    return {
      id: student.studentId,
      studentName: student.studentName,
      imageUrl: student.imageUrl,
      submittedDate: student.lastSubmittedAt ? formatDate(student.lastSubmittedAt, { showTime: true }) : '-',
      status: latestAttempt ? latestAttempt.status : 'Not Submitted',
      grade: grade,
      comment: latestAttempt ? latestAttempt.feedback : null,
      point: latestAttempt ? latestAttempt.totalScore : null,
      studentAssignmentId: latestAttempt ? latestAttempt.studentAssignmentId : null,
      attempts: student.attempts,
      studentRole: 'Student',
      quizTitle: assignmentTitle,
      quizFinishedDate: student.lastSubmittedAt ? formatDate(student.lastSubmittedAt, { showTime: true }) : '-',
      quizQuestionCount: 0,
      accuracy: null,
      answered: null
    }
  })
}

export function AssignmentTable({
  data,
  filter,
  onRefresh
}: {
  data: AssignmentStatistics
  filter: 'reviewed' | 'not-reviewed'
  onRefresh?: () => void
}) {
  const [openSubmission, setOpenSubmission] = useState<Submission | null>(null)

  const t = useTranslations('assignment.teacher.table')

  // Helper function to translate submission status
  const getStatusTranslation = (status: SubmissionStatus): string => {
    const statusMap: Record<string, string> = {
      Passed: 'subStatus.passed',
      Failed: 'subStatus.failed',
      'Not Submitted': 'subStatus.notSubmitted',
      Submitted: 'subStatus.submitted',
      Pending: 'subStatus.pending',
      UnderReview: 'subStatus.underReview',
      Graded: 'subStatus.graded'
    }
    return t(statusMap[status] || 'subStatus.pending')
  }

  const allSubmissions = mapApiToSubmissions(data.studentStatistics, data.assignmentTitle)
  console.log('allSubmissions', allSubmissions)

  allSubmissions.forEach((s) => {
    s.quizQuestionCount = data.totalQuestions
  })

  const filteredSubmissions = allSubmissions.filter((s) => {
    const isReviewed = s.status === 'Passed' || s.status === 'Failed' || s.status === 'Graded'
    if (filter === 'reviewed') {
      return isReviewed
    }
    if (filter === 'not-reviewed') {
      return !isReviewed
    }
    return true
  })

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-200'>
            <TableHead className='w-[300px]'>{t('name')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('grade')}</TableHead>
            <TableHead>{t('date')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <TableRow
                key={submission.id}
                className='cursor-pointer hover:bg-gray-50'
                onClick={() => submission.status !== 'Not Submitted' && setOpenSubmission(submission)} // <<< Mở dialog bằng state
              >
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={submission.imageUrl} alt={submission.studentName} />
                      <AvatarFallback>
                        {submission.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-medium'>{submission.studentName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(submission.status)}>
                    {getStatusTranslation(submission.status)}
                  </Badge>
                </TableCell>
                <TableCell>{submission.grade ? submission.grade : 'N/A'}</TableCell>
                <TableCell>{submission.submittedDate ? submission.submittedDate : '—'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className='py-6 text-center text-sm text-gray-500'>
                {t('noSubmission')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!openSubmission}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenSubmission(null)
          }
        }}
      >
        <DialogTitle></DialogTitle>
        <DialogContent className='p-0'>
          {openSubmission && (
            <SubmissionReviewDialog
              submission={openSubmission}
              studentAssignmentId={openSubmission.studentAssignmentId}
              onClose={() => setOpenSubmission(null)}
              onSuccess={onRefresh}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
