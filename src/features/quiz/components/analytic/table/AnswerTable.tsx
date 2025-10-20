import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { learners, questions, answerIcons, answerColors, LearnerAnswer } from '../data'
import { Badge } from '@/components/shadcn/badge'
import { cn } from '@/shadcn/utils'
import { useState } from 'react'
import { QuizResultPopup } from '../pop-up/QuizResultPopup'

export function AnswerGridTable() {
  const [selectedLearner, setSelectedLearner] = useState<LearnerAnswer | null>(null)

  return (
    <>
      <div className='overflow-hidden rounded-lg border'>
        <div className='relative overflow-x-auto'>
          <Table className='min-w-[2000px]'>
            <TableHeader>
              <TableRow className='bg-gray-50 hover:bg-gray-50'>
                <TableHead className='sticky left-0 z-10 w-[350px] bg-inherit'>Learner</TableHead>
                {questions.map((q) => (
                  <TableHead key={q.id} className='w-[100px] text-center'>
                    {q.title}
                    <Badge variant='secondary' className='ml-2 font-normal'>
                      {q.percentage}%
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {learners.map((learner, index) => (
                <TableRow key={learner.id} className='group'>
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky left-0 z-10'>
                    <div className='flex cursor-pointer items-center gap-3' onClick={() => setSelectedLearner(learner)}>
                      <span className='w-6 text-center text-sm font-medium text-gray-500'>{index + 1}</span>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={learner.avatar} />
                        <AvatarFallback>
                          {learner.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='flex items-center gap-2 font-medium'>
                          {learner.name}
                          {learner.designation && (
                            <Badge variant='outline' className='font-normal'>
                              {learner.designation}
                            </Badge>
                          )}
                        </p>
                        <span className='text-xs text-gray-500'>{learner.role}</span>
                      </div>
                    </div>
                  </TableCell>

                  {learner.answers.map((answer) => {
                    const Icon = answerIcons[answer.status]
                    const color = answerColors[answer.status]
                    return (
                      <TableCell key={`${learner.id}-${answer.questionId}`} className='text-center'>
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
      />
    </>
  )
}
