'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { LearnerAnswer } from '../data'
import { Badge } from '@/components/shadcn/badge'
import {
  Printer,
  Download,
  X as XIcon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Star,
  Clock,
  Share
} from 'lucide-react'
import { ProgressCircle } from '../../active/circle/AccuracyCircle'
import { cn } from '@/shadcn/utils'

type Status = 'correct' | 'incorrect' | 'unanswered' | 'review'

interface QuizResultPopupProps {
  learner: LearnerAnswer | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const detailedQuestionExamples = [
  {
    status: 'incorrect' as Status,
    questionText: 'What does UI stand for in the context of design?',
    correctAnswer: 'User Interface'
  },
  {
    status: 'correct' as Status,
    questionText:
      'Which aspect of UI design involves choosing colors, typography, and creating icons for a digital interface?',
    correctAnswer: 'Visual Design'
  },
  {
    status: 'incorrect' as Status,
    questionText: 'What is the primary goal of UX design?',
    correctAnswer: 'To improve user satisfaction and loyalty'
  }
]

const AnswerGridItem = ({ status, number }: { status: Status; number: number }) => {
  const statusClasses = {
    correct: 'bg-green-100 text-green-700 border-green-200',
    incorrect: 'bg-red-100 text-red-700 border-red-200',
    unanswered: 'bg-gray-100 text-gray-500 border-gray-200',
    review: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  const Icon = {
    correct: <CheckCircle2 className='h-4 w-4' />,
    incorrect: <XCircle className='h-4 w-4' />,
    unanswered: <div className='h-4 w-4 rounded-full border-2 border-gray-400' />,
    review: <HelpCircle className='h-4 w-4' />
  }

  return (
    <div
      className={`flex items-center justify-between rounded-md border p-2 text-sm font-medium ${statusClasses[status]}`}
    >
      <span>{number}</span>
      {Icon[status]}
    </div>
  )
}

export function QuizResultPopup({ learner, isOpen, onOpenChange }: QuizResultPopupProps) {
  if (!learner) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl p-8'>
        <DialogHeader className='flex flex-row items-start justify-between border-b pb-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-14 w-14'>
              <AvatarImage src={learner.avatar} />
              <AvatarFallback>
                {learner.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className='flex items-center gap-2 text-xl font-bold'>
                {learner.name} <Badge variant='outline'>{learner.designation}</Badge>
              </DialogTitle>
              <p className='text-sm text-gray-500'>{learner.role}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='icon'>
              <Printer className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon'>
              <Download className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon'>
              <Share className='h-4 w-4' />
            </Button>
          </div>
        </DialogHeader>

        <div className='my-6 space-y-2'>
          <div className='flex items-start justify-between'>
            <h3 className='max-w-md text-2xl font-bold'>UI Design Fundamentals & Best Practice</h3>
            <div className='flex items-center gap-6 text-sm'>
              <div>
                <span className='text-gray-500'>Accuracy</span>
                <div className='mt-2 flex items-center gap-1.5 text-lg font-semibold'>
                  <ProgressCircle
                    value={85}
                    size={28}
                    className='text-green-500'
                    strokeWidth={3.5}
                    showPercentageText={false}
                  />
                  <span className='text-green-600'>85%</span>
                </div>
              </div>
              <div>
                <span className='text-gray-500'>Point</span>
                <p className='mt-2 text-lg font-semibold'>145</p>
              </div>
              <div>
                <span className='text-gray-500'>Answered</span>
                <p className='mt-2 text-lg font-semibold'>19/20</p>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-500'>
            <span>Finished Oct 03, 2023 - 10:00 AM</span>
            <span className='flex items-center gap-1.5'>
              <HelpCircle className='h-4 w-4' /> 20 Questions
            </span>
          </div>
        </div>

        <div className='mb-4 grid grid-cols-10 gap-2'>
          {learner.answers.map((ans, index) => (
            <AnswerGridItem key={ans.questionId} status={ans.status} number={index + 1} />
          ))}
        </div>

        <div className='mb-6 flex items-center gap-4 text-xs text-gray-600'>
          <span className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-green-500' />
            Correct 16 - 72%
          </span>
          <span className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-yellow-500' />
            Half Correct 1 - 3%
          </span>
          <span className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-red-500' />
            Incorrect 2 - 12%
          </span>
          <span className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-gray-400' />
            Skipped 1 - 3%
          </span>
        </div>

        {/* Question Accordion */}
        <Accordion type='single' collapsible className='w-full'>
          {detailedQuestionExamples.map((question, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className='text-left font-semibold no-underline hover:no-underline [&[data-state=open]>svg]:rotate-180'>
                <div className='flex w-full items-center justify-between pr-4'>
                  <div className='flex items-center gap-3'>
                    <HelpCircle className='h-5 w-5 text-gray-400' />
                    <span>Question {index + 1}</span>
                    <Badge
                      className={cn(
                        question.status === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      )}
                    >
                      {question.status}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-4 text-sm font-normal text-gray-600'>
                    <span className='flex items-center gap-1.5'>
                      <Layers className='h-4 w-4' /> Multiple choice
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <Clock className='h-4 w-4' /> Time 32s
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <Star className='h-4 w-4 text-yellow-500' /> 1 point
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='space-y-4 pl-12 text-base'>
                <p>{question.questionText}</p>

                {question.status === 'incorrect' && (
                  <div className='mt-4 rounded-r-md border-l-4 border-green-500 bg-green-50 p-4'>
                    <p className='text-xs font-semibold text-green-800'>CORRECT ANSWER</p>
                    <p className='font-medium text-green-900'>{question.correctAnswer}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}
