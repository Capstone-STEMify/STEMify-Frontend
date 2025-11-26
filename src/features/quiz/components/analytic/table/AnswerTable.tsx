import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { cn } from '@/shadcn/utils'
import { useState } from 'react'
import { QuizResultPopup } from '../pop-up/QuizResultPopup'
import {
  answerColors,
  answerIcons,
  QuestionStatistic,
  QuizStatistics,
  StudentStatistic
} from '@/features/quiz/types/studentQuiz.type'
import { use } from 'matter'
import { useTranslations } from 'next-intl'

type AnswerGridTableProps = {
  studentData: StudentStatistic[]
  questionData: QuestionStatistic[]
  data: QuizStatistics
}

export function AnswerGridTable({ data, studentData, questionData }: AnswerGridTableProps) {
  const [selectedLearner, setSelectedLearner] = useState<StudentStatistic | null>(null)

  const t = useTranslations('quiz.teacher.answerTable')

  return (
    <>
      <div className='overflow-hidden rounded-lg border'>
        <div className='relative overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 hover:bg-gray-50'>
                <TableHead className='sticky left-0 z-10 w-[350px] bg-inherit'>{t('head')}</TableHead>
                {questionData.map((q, index) => (
                  <TableHead key={q.questionId} className='min-w-[120px] p-4 text-center whitespace-nowrap'>
                    Q.{index + 1}
                    <Badge variant='secondary' className='ml-2 font-normal'>
                      {q.correctRate}%
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData.map((learner, index) => (
                <TableRow key={learner.studentId} className='group'>
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky left-0 z-10'>
                    <div className='flex cursor-pointer items-center gap-3' onClick={() => setSelectedLearner(learner)}>
                      <span className='w-6 text-center text-sm font-medium text-gray-500'>{index + 1}</span>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={learner.imageUrl || '/images/macbg.png'} />
                        <AvatarFallback>
                          {learner.studentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='flex items-center gap-2 font-medium'>
                          {learner.studentName}
                          {/* {learner.designation && (
                            <Badge variant='outline' className='font-normal'>
                              {learner.designation}
                            </Badge>
                          )} */}
                        </p>
                        {/* <span className='text-xs text-gray-500'>{learner.role}</span> */}
                      </div>
                    </div>
                  </TableCell>

                  {learner.questionResults.map((answer) => {
                    const key = answer.isCorrect ? 'true' : 'false'
                    const Icon = answerIcons[key]
                    const color = answerColors[key]
                    return (
                      <TableCell key={`${learner.studentId}-${answer.questionId}`} className='text-center'>
                        <Icon className={cn('mx-auto h-5 w-5', color)} />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <QuizResultPopup
        isOpen={!!selectedLearner}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedLearner(null)
          }
        }}
        learner={selectedLearner}
        quiz={data}
      />
    </>
  )
}
