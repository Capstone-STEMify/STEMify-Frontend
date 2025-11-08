import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog'
import { SubmissionReviewDialog } from '../dialog/SubmissionReviewDialog'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { AssignmentAttempt, AssignmentStatistics, StudentStatistic } from '@/features/assignment/types/assigmentlistdetail.type'

// (Các type và helper giữ nguyên)
export type SubmissionStatus =
  | 'Not Reviewed'
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

const statusVariantMap: Record<SubmissionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Passed: 'secondary',
  Failed: 'destructive',
  'Not Reviewed': 'default',
  'Not Submitted': 'outline',
  Submitted: 'default',
  Pending: 'outline',
  UnderReview: 'default',
  Graded: 'secondary'
}

function mapApiToSubmissions(students: StudentStatistic[], assignmentTitle: string): Submission[] {
  // (Hàm map giữ nguyên)
  return students.map((student) => {
    const latestAttempt = student.attempts.length > 0 ? student.attempts[0] : null
    
    let grade: string | null = null
    if (latestAttempt && (latestAttempt.status === 'Graded' || latestAttempt.status === 'Passed')) {
      grade = `${latestAttempt.totalScore}`
    }

    return {
      id: student.studentId,
      studentName: student.studentName,
      imageUrl: student.imageUrl,
      submittedDate: student.lastSubmittedAt ? format(new Date(student.lastSubmittedAt), 'MMM dd, yyyy') : null,
      status: student.status,
      grade: grade,
      comment: latestAttempt ? latestAttempt.feedback : null,
      point: latestAttempt ? latestAttempt.totalScore : null,
      studentAssignmentId: latestAttempt ? latestAttempt.studentAssignmentId : null,
      attempts: student.attempts,
      studentRole: 'Student',
      quizTitle: assignmentTitle,
      quizFinishedDate: student.lastSubmittedAt ? format(new Date(student.lastSubmittedAt), 'MMM dd, yyyy') : 'N/A',
      quizQuestionCount: 0,
      accuracy: null,
      answered: null
    }
  })
}

export function AssignmentTable({ data, filter }: { data: AssignmentStatistics; filter: 'reviewed' | 'not-reviewed' }) {
  // <<< THÊM: State để quản lý dialog
  const [openSubmission, setOpenSubmission] = useState<Submission | null>(null)

  const allSubmissions = mapApiToSubmissions(data.studentStatistics, data.assignmentTitle)
  
  allSubmissions.forEach((s) => {
    s.quizQuestionCount = data.totalQuestions
  })

  const filteredSubmissions = allSubmissions.filter((s) => {
    // (Logic filter giữ nguyên)
    const isReviewed = s.status === 'Passed' || s.status === 'Failed' || s.status === 'Graded'
    if (filter === 'reviewed') {
      return isReviewed
    }
    if (filter === 'not-reviewed') {
      return !isReviewed && s.status !== 'Pending' && s.status !== 'Not Submitted'
    }
    return true
  })

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-200'>
            <TableHead className='w-[300px]'>Student Name</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.map((submission) => (
            <TableRow
              key={submission.id}
              className='cursor-pointer hover:bg-gray-50'
              onClick={() => setOpenSubmission(submission)} // <<< Mở dialog bằng state
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
              <TableCell>{submission.submittedDate ? submission.submittedDate : '—'}</TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[submission.status] || 'default'}>{submission.status}</Badge>
              </TableCell>
              <TableCell className='text-right'>{submission.grade ? submission.grade : 'N/A'}</TableCell>
            </TableRow>
          ))}
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
        <DialogContent className='max-w-5xl p-0'>
          {openSubmission && (
            <SubmissionReviewDialog
              submission={openSubmission}
              studentAssignmentId={openSubmission.studentAssignmentId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}