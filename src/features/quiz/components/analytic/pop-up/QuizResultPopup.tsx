'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import {
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Star,
  Share,
  ChevronDown,
  X as XIcon
} from 'lucide-react'
import { ProgressCircle } from '../../active/circle/AccuracyCircle'
import { cn } from '@/shadcn/utils'
import { QuizStatistics, StudentStatistic } from '@/features/quiz/types/studentQuiz.type'
import { useLocale, useTranslations } from 'next-intl'
import { formatDate, useStatusTranslation } from '@/utils/index'

type Status = 'correct' | 'incorrect' | 'unanswered' | 'review'

interface QuizResultPopupProps {
  learner: StudentStatistic | null
  quiz: QuizStatistics
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

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

const CustomAccordionItem = ({
  triggerContent,
  bodyContent
}: {
  triggerContent: React.ReactNode
  bodyContent: React.ReactNode
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  return (
    <div className='mb-2 rounded-md border p-4'>
      <button
        type='button'
        className='flex w-full items-center justify-between text-left font-semibold no-underline hover:no-underline'
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
      >
        {triggerContent}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
            isAccordionOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Đây là AccordionContent */}
      {isAccordionOpen && <div className='pt-4'>{bodyContent}</div>}
    </div>
  )
}

export function QuizResultPopup({ learner, quiz, isOpen, onOpenChange }: QuizResultPopupProps) {
  const t = useTranslations('quiz.teacher.answerTable')
  const locale = useLocale()
  const tc = useTranslations('common')
  const statusTranslate = useStatusTranslation()
  if (!learner || !isOpen) return null

  const answered = learner.totalAnswers ?? learner.questionResults.length
  const correct = learner.totalCorrectAnswers ?? learner.questionResults.filter((q) => q.isCorrect).length
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0

  const detailedQuestions = (quiz.questionStatistics || []).map((qStat) => {
    const res = learner.questionResults.find((r) => r.questionId === qStat.questionId)
    const status: Status = res ? (res.isCorrect ? 'correct' : 'incorrect') : 'unanswered'
    return {
      ...qStat,
      status,
      learnerAnswer: res?.correctAnswer ?? null
    }
  })

  return (
    <div role='dialog' aria-modal='true' className='fixed inset-0 z-50'>
      <div className='fixed inset-0 bg-black/80' onClick={() => onOpenChange(false)} />

      <div className='fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900'>
        <button
          type='button'
          className='absolute top-4 right-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100'
          onClick={() => onOpenChange(false)}
        >
          <XIcon className='h-5 w-5' />
          <span className='sr-only'>{tc('button.close')}</span>
        </button>

        <div className='flex flex-row items-start justify-between border-b p-8 pb-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-14 w-14'>
              <AvatarImage src={learner.imageUrl || '/images/macbg.png'} />
              <AvatarFallback>
                {learner.studentName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className='flex items-center gap-2 text-xl font-bold'>
                {learner.studentName}
                <Badge variant='outline' className='ml-2'>
                  {statusTranslate(learner.status)}
                </Badge>
              </h2>
              <p className='text-sm text-gray-500'>
                {t('submitted')} {formatDate(learner.completedAt, { locale, showTime: true })}
              </p>
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-8'>
          <div className='mb-6 space-y-2'>
            <div className='flex items-start justify-between'>
              <h3 className='max-w-md text-2xl font-bold'>{quiz.quizName}</h3>
              <div className='flex items-center gap-6 text-sm'>
                <div>
                  <span className='text-gray-500'>{t('accuracy')}</span>
                  <div className='mt-2 flex items-center gap-1.5 text-lg font-semibold'>
                    <ProgressCircle
                      value={accuracy}
                      size={28}
                      className='text-green-500'
                      strokeWidth={3.5}
                      showPercentageText={false}
                    />
                    <span className='text-green-600'>{accuracy}%</span>
                  </div>
                </div>
                <div>
                  <span className='text-gray-500'>{t('point')}</span>
                  <p className='mt-2 text-lg font-semibold'>{learner.totalScore}</p>
                </div>
                <div>
                  <span className='text-gray-500'>{t('answered')}</span>
                  <p className='mt-2 text-lg font-semibold'>
                    {answered}/{quiz.totalQuestions}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3 text-sm text-gray-500'>
              <span className='flex items-center gap-1.5'>
                <HelpCircle className='h-4 w-4' /> {quiz.totalQuestions} {t('question')}
              </span>
            </div>
          </div>

          <div className='mb-4 grid grid-cols-10 gap-2'>
            {(learner.questionResults || []).map((ans, index) => {
              const status: Status = ans.isCorrect ? 'correct' : 'incorrect'
              return <AnswerGridItem key={ans.questionId} status={status} number={index + 1} />
            })}
          </div>

          <div className='mb-6 flex items-center gap-4 text-xs text-gray-600'>
            <span className='flex items-center gap-1.5'>
              <div className='h-2 w-2 rounded-full bg-green-500' />
              {t('correct')} {} - {learner.totalCorrectAnswers} {t('question')}
            </span>
            <span className='flex items-center gap-1.5'>
              <div className='h-2 w-2 rounded-full bg-red-500' />
              {t('incorrect')} {} - {learner.totalIncorrectAnswers} {t('question')}
            </span>
            <span className='flex items-center gap-1.5'>
              <div className='h-2 w-2 rounded-full bg-gray-600' />
              {t('skip')} {} - {learner.totalSkipAnswers} {t('question')}
            </span>
          </div>
          <div className='w-full'>
            {detailedQuestions.map((question, index) => {
              const triggerJSX = (
                <div className='flex w-full items-center justify-between pr-4'>
                  <div className='flex items-center gap-3'>
                    <HelpCircle className='h-5 w-5 text-gray-400' />
                    <span>Q{index + 1}</span>
                    <Badge
                      className={cn(
                        question.status === 'correct'
                          ? 'bg-green-100 text-green-800'
                          : question.status === 'incorrect'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {statusTranslate(question.status)}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-4 text-xs font-normal text-gray-600'>
                    <span className='flex items-center gap-1.5 rounded-md bg-gray-100 p-2 font-semibold'>
                      <Layers className='h-4 w-4' /> {tc(`questionType.${question.questionType.toLowerCase()}`)}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <Star className='h-4 w-4 text-yellow-500' /> {question.point} {t('point')}
                    </span>
                  </div>
                </div>
              )

              const bodyJSX = (
                <div className='space-y-4 pl-12 text-base'>
                  <p className='break-words'>{question.questionTitle}</p>

                  <div className='mt-4 rounded-r-md border-l-4 border-green-500 bg-green-50 p-4'>
                    <p className='text-xs font-semibold text-green-800'>{t('correctAnswer')}</p>
                    <p className='font-medium text-green-900'>
                      {question.learnerAnswer ?? question.answerStatistics?.[0]?.content}
                    </p>
                  </div>
                </div>
              )

              return <CustomAccordionItem key={question.questionId} triggerContent={triggerJSX} bodyContent={bodyJSX} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
