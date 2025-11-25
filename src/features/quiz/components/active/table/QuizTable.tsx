import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { ChevronUp, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { Button } from '@/components/shadcn/button'
import { ProgressCircle } from '../circle/AccuracyCircle'
import { QuizStatistics } from '@/features/quiz/types/studentQuiz.type'
import { useTranslations } from 'next-intl'

type QuizTableProps = {
  data: QuizStatistics[]
}

export function QuizTable({ data }: QuizTableProps) {
  const t = useTranslations('dashboard.classroom')
  const tc = useTranslations('common')

  const getAccuracyColor = (accuracy: number | null): string => {
    if (accuracy === null) return 'text-gray-400'
    if (accuracy >= 90) return 'text-green-500'
    if (accuracy >= 70) return 'text-orange-400'
    return 'text-red-500'
  }

  return (
    <div className='mt-4 rounded-lg border'>
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
                {t('quiz.active.name')}
              </button>
            </TableHead>
            <TableHead className='w-[180px]'>
              <button className='flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('quiz.active.learner')}
              </button>
            </TableHead>
            <TableHead className='w-[120px] text-center'>
              <button className='mx-auto flex items-center text-xs font-semibold text-gray-500 uppercase'>
                {t('quiz.active.accuracy')}
              </button>
            </TableHead>
            <TableHead className='w-[120px] text-center'>
              <button className='mx-auto flex items-center justify-center text-xs font-semibold text-gray-500 uppercase'>
                {t('submission')}
              </button>
            </TableHead>
            <TableHead className='w-[120px] text-center'>
              <button className='mx-auto flex items-center justify-center text-xs font-semibold text-gray-500 uppercase'>
                {t('quiz.active.date')}
              </button>
            </TableHead>
            <TableHead className='w-[80px] text-center text-xs font-semibold text-gray-500 uppercase'>
              {t('quiz.active.action')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((quiz) => {
            const learners = quiz.studentStatistics || []
            const extra = learners.length > 3 ? learners.length - 3 : 0
            return (
              <TableRow key={`quiz-${quiz.quizId}`}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Checkbox id={`quiz-${quiz.quizId}`} />
                    <div className='rounded-full bg-gray-100 p-2'>
                      {/* use a simple icon placeholder */}
                      <span className='block h-4 w-4' />
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  <label htmlFor={`quiz-${quiz.quizId}`} className='cursor-pointer text-gray-800'>
                    {quiz.quizName}
                  </label>
                  <div className='mt-1 flex items-center text-xs text-gray-500'>
                    <span className='font-semibold'>{quiz.totalQuestions} Qs - </span>
                    <span className='text-gray-500'>{quiz.timeLimitMinutes} mins</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center'>
                    <div className='flex -space-x-2'>
                      {learners.slice(0, 3).map((learner) => (
                        <Avatar key={learner.studentId} className='h-7 w-7 border-2 border-white'>
                          {learner.imageUrl ? (
                            <AvatarImage src={learner.imageUrl} />
                          ) : (
                            <AvatarFallback>
                              {learner.studentName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      ))}
                    </div>
                    {extra > 0 && <span className='ml-2 text-sm text-gray-600'>+{extra}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <ProgressCircle
                      value={quiz.averageScore}
                      size={40}
                      strokeWidth={4}
                      className={getAccuracyColor(quiz.averageScore)}
                    />
                  </div>
                </TableCell>
                <TableCell className='text-center text-gray-600'>{quiz.submissions}</TableCell>
                <TableCell className='text-center text-gray-600'>{quiz.dueDate || '-'}</TableCell>
                <TableCell className='text-center'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
