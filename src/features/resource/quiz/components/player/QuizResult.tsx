'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetQuiz } from '@/features/resource/quiz/slice/quiz-player-slice'
import { setMode } from '@/features/resource/lesson/slice/lessonDetailSlice'

type QuizResultProps = {
  quiz: Quiz
}

export default function QuizResult({ quiz }: QuizResultProps) {
  const dispatch = useAppDispatch()
  const { userAnswers } = useAppSelector((state) => state.quizPlayer)
  const questions = quiz.questions

  // ✅ Tính số câu đúng thật sự
  const correctAnswersCount = questions.filter((q) => {
    const chosen = userAnswers[q.id] ?? []
    const chosenArray = Array.isArray(chosen) ? chosen : [chosen]
    const correctIds = q.answers.filter((a) => a.isCorrect).map((a) => a.id)
    return chosenArray.length === correctIds.length && chosenArray.map(Number).every((id) => correctIds.includes(id))
  }).length

  const scorePercent = Math.round((correctAnswersCount / questions.length) * 100)

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='bg-primary/20 mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full'>
            <CheckCircle className='text-primary h-10 w-10' />
          </div>
          <h1 className='text-foreground mb-2 text-4xl font-bold'>Bài kiểm tra hoàn thành!</h1>
          <p className='text-foreground/60'>Cảm ơn bạn đã hoàn thành bài quiz</p>
        </div>

        {/* Score */}
        <Card className='mb-8 p-8 text-center'>
          <p className='text-foreground/60 mb-2'>Điểm của bạn</p>
          <div className='text-primary mb-2 text-6xl font-bold'>{scorePercent}%</div>
          <p className='text-foreground/60'>
            {correctAnswersCount} / {questions.length} câu đúng
          </p>
        </Card>

        {/* Results Summary */}
        <div className='mb-8 space-y-3'>
          {questions.map((question, index) => {
            const chosen = userAnswers[question.id] ?? []
            const chosenArray = Array.isArray(chosen) ? chosen : [chosen]
            const correctIds = question.answers.filter((a) => a.isCorrect).map((a) => a.id)
            const isCorrect =
              chosenArray.length === correctIds.length && chosenArray.map(Number).every((id) => correctIds.includes(id))

            return (
              <Card
                key={index}
                className={`flex items-start gap-4 p-4 ${
                  isCorrect ? 'border-green-400 bg-green-50' : 'border-destructive/30 bg-destructive/5'
                }`}
              >
                <div className='mt-1 flex-shrink-0'>
                  {isCorrect ? (
                    <CheckCircle className='h-5 w-5 text-green-500' />
                  ) : (
                    <XCircle className='text-destructive h-5 w-5' />
                  )}
                </div>
                <div className='flex-1'>
                  <p className='text-foreground mb-1 font-medium'>
                    Câu {index + 1}: {isCorrect ? 'Đúng' : 'Sai'}
                  </p>
                  <p className='text-foreground/70 mb-1 text-sm'>{question.content}</p>

                  {/* Hiển thị đáp án đúng */}
                  <ul className='text-foreground/80 text-sm'>
                    {question.answers
                      .filter((a) => a.isCorrect)
                      .map((a) => (
                        <li key={a.id} className='text-green-600'>
                          ✓ {a.content}
                        </li>
                      ))}
                  </ul>

                  {/* Hiển thị đáp án người dùng chọn */}
                  {!isCorrect && chosenArray.length > 0 && (
                    <div className='mt-1 text-sm text-red-600'>
                      Bạn chọn:{' '}
                      {question.answers
                        .filter((a) => chosenArray.includes(a.id))
                        .map((a) => a.content)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Action Button */}
        <div className='grid grid-cols-2 gap-2'>
          <Button className='w-full bg-sky-500 py-3 font-semibold' onClick={() => dispatch(setMode('normal'))}>
            Học phần tiếp theo
          </Button>
          <Button
            className='w-full bg-slate-200 py-3 font-semibold text-blue-600'
            onClick={() => dispatch(resetQuiz())}
          >
            Làm lại bài quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
