'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { ChevronUp, Mic, FileText, MoreHorizontal } from 'lucide-react'
import { ProgressCircle } from '@/features/quiz/components/active/circle/AccuracyCircle'
import { useSearchStudentAssignmentQuery } from '../../api/studentAssignmentApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { AssignmentStatistics } from '../../types/assigmentlistdetail.type'
import { format } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { skip } from 'node:test'

export function AssignmentList() {
  const locale = useLocale()
  const t = useTranslations('dashboard.classroom')
  const tc = useTranslations('common')

  const getAccuracyColor = (accuracy: number | null): string => {
    if (accuracy === null) return 'text-gray-400'
    if (accuracy >= 90) return 'text-green-500'
    if (accuracy >= 70) return 'text-orange-400'
    return 'text-red-500'
  }
  const { classroomId } = useParams()

  const { data: studentAssignmentResponse, isLoading } = useSearchStudentAssignmentQuery(
    {
      classroomId: Number(classroomId)
    },
    { skip: !classroomId }
  )

  if (isLoading) return <LoadingComponent />

  const assignments: AssignmentStatistics[] = studentAssignmentResponse?.data?.items || []

  return (
    <div className='mx-auto mt-10 w-full max-w-7xl rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50/50 hover:bg-gray-50'>
            <TableHead className='w-[80px]'>
              <div className='flex items-center gap-3'>
                <Checkbox />
              </div>
            </TableHead>
            <TableHead className='min-w-[250px]'>
              <button className='flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('assignment.name')} <ChevronUp className='ml-1 h-3 w-3' />
              </button>
            </TableHead>
            <TableHead className='w-[180px] text-center'>
              <button className='mx-auto flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('assignment.learner')} <ChevronUp className='ml-1 h-3 w-3' />
              </button>
            </TableHead>
            <TableHead className='w-[120px] text-center'>
              <button className='mx-auto flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('submission')} <ChevronUp className='ml-1 h-3 w-3' />
              </button>
            </TableHead>
            <TableHead className='w-[120px] text-center'>
              <button className='mx-auto flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('passRate')}
                <ChevronUp className='ml-1 h-3 w-3' />
              </button>
            </TableHead>
            <TableHead className='w-[180px] text-center'>
              <button className='mx-auto flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('score')}
                <ChevronUp className='ml-1 h-3 w-3' />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => {
            const extraLearners = assignment.studentStatistics.length > 3 ? assignment.studentStatistics.length - 3 : 0

            return (
              <TableRow key={assignment.assignmentId}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Checkbox id={`asm-${assignment.assignmentId}`} />
                    <div className='rounded-full bg-gray-100 p-2'>
                      <FileText className='h-4 w-4 text-gray-600' />
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  <Link href={`/${locale}/classroom/${classroomId}/assignment/${assignment.assignmentId}`}>
                    <label
                      htmlFor={`asm-${assignment.assignmentId}`}
                      className='cursor-pointer text-gray-800 hover:text-blue-500 hover:underline'
                    >
                      {assignment.assignmentTitle}
                    </label>
                    <div className='mt-1 flex items-center text-xs text-gray-500'>
                      <span className='font-semibold'>
                        {assignment.totalQuestions} {t('assignment.question')}
                      </span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center'>
                    <div className='flex -space-x-2'>
                      {assignment.studentStatistics.slice(0, 3).map((student) => (
                        <Avatar key={student.studentId} className='h-7 w-7 border-2 border-white'>
                          {student.imageUrl ? (
                            <AvatarImage src={student.imageUrl} />
                          ) : (
                            <AvatarFallback>{student.studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>
                      ))}
                    </div>
                    {extraLearners > 0 && <span className='ml-2 text-sm text-gray-600'>+{extraLearners}</span>}
                  </div>
                </TableCell>
                <TableCell className='text-center text-gray-600'>{assignment.submissions}</TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <ProgressCircle
                      value={assignment.passRate}
                      size={40}
                      strokeWidth={4}
                      className={getAccuracyColor(assignment.averageScore)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center gap-2'>
                    <p className='text-gray-800'>{assignment.averageScore}</p>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
