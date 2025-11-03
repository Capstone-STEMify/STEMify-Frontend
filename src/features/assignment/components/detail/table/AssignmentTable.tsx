import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/shadcn/dialog'
import { SubmissionReviewDialog } from '../dialog/SubmissionReviewDialog'

export type SubmissionStatus = 'Not Reviewed' | 'Passed' | 'Failed' | 'Not Submitted'

export type Submission = {
  id: string
  studentName: string
  imageUrl: string
  submittedDate: string | null
  status: SubmissionStatus
  grade: string | null

  studentRole: string
  quizTitle: string
  quizFinishedDate: string
  quizQuestionCount: number
  accuracy: string | null
  point: number | null
  answered: string | null

  comment: string | null
}

const ALL_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    studentName: 'Nguyễn Văn An',
    imageUrl: 'https://github.com/shadcn.png',
    submittedDate: 'Oct 25, 2025',
    status: 'Passed',
    grade: '95/100',
    studentRole: 'Jr UI/UX Designer',
    quizTitle: 'UI Design Fundamentals & Best Practice',
    quizFinishedDate: 'Oct 03, 2023 · 10:00 AM',
    quizQuestionCount: 20,
    accuracy: '85%',
    point: 145,
    answered: '19/20',
    comment: 'Làm tốt lắm, phần phân tích màu sắc rất chi tiết.'
  },
  {
    id: '2',
    studentName: 'Trần Thị Bích',
    imageUrl: 'https://github.com/react.png',
    submittedDate: 'Oct 26, 2025',
    status: 'Not Reviewed',
    grade: null,
    studentRole: 'Product Designer',
    quizTitle: 'Color and Typography in UI Design',
    quizFinishedDate: 'Oct 26, 2025 · 09:15 AM',
    quizQuestionCount: 15,
    accuracy: null,
    point: null,
    answered: null,
    comment: null
  }
]

const statusVariantMap: Record<SubmissionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Passed: 'secondary',
  Failed: 'destructive',
  'Not Reviewed': 'default',
  'Not Submitted': 'outline'
}

export function AssignmentTable({ filter }: { filter: 'reviewed' | 'not-reviewed' }) {
  const filteredSubmissions = ALL_SUBMISSIONS.filter((s) => {
    const isReviewed = s.status === 'Passed' || s.status === 'Failed'
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
            <TableHead className='w-[300px]'>Student Name</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.map((submission) => (
            <Dialog key={submission.id}>
              <DialogTrigger asChild>
                <TableRow className='cursor-pointer hover:bg-gray-50'>
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
                    <Badge variant={statusVariantMap[submission.status]}>{submission.status}</Badge>
                  </TableCell>

                  <TableCell className='text-right'>{submission.grade ? submission.grade : 'N/A'}</TableCell>
                </TableRow>
              </DialogTrigger>
              <DialogContent className='max-w-5xl p-0'>
                <SubmissionReviewDialog submission={submission} />
              </DialogContent>
            </Dialog>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
