'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  goToNextQuestion,
  goToPreviousQuestion,
  resetQuiz,
  submitQuiz
} from '@/features/resource/quiz/slice/quiz-player-slice'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { useUpdateQuizAttemptMutation } from '@/features/resource/quiz/api/quizApi'
import { toast } from 'sonner'
import { setMode } from '@/features/resource/lesson/slice/lessonDetailSlice'
import { useGetStudentQuizByIdQuery } from '@/features/quiz/api/studentQuizApi'
import { triggerRefetchSectionProgress } from '@/features/student-progress/slice/studentProgressSlice'
import { useParams, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

type NavigationButtonsProps = {
  quiz: Quiz
}

export default function NavigationButtons({ quiz }: NavigationButtonsProps) {
  const { lessonId } = useParams()
  const router = useRouter()
  const locale = useLocale()

  const questions = quiz.questions
  const { currentQuestionIndex, userAnswers, quizAttemptId, studentQuizId } = useAppSelector(
    (state) => state.quizPlayer
  )
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile()
  const [submitQuizAttempt, { isLoading }] = useUpdateQuizAttemptMutation()

  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleSubmitQuiz = async () => {
    const questionAttempts = Object.entries(userAnswers).map(([questionId, answerIds]) => ({
      questionId: Number(questionId),
      answerIds: Array.isArray(answerIds) ? answerIds.map(Number) : [Number(answerIds)]
    }))

    const result = await submitQuizAttempt({
      quizAttemptId: quizAttemptId!,
      studentQuizId: studentQuizId!,
      questionAttempts
    }).unwrap()
    if (result) {
      dispatch(submitQuiz())
      dispatch(resetQuiz())
      toast.success('Nộp bài thành công!')
      router.push(`/${locale}/resource/lesson/${lessonId}`)
    }
  }

  return (
    <div className={`mt-8 flex items-center justify-between gap-4 ${isMobile ? 'flex-col' : ''}`}>
      {/* Previous Button */}
      <Button
        onClick={() => dispatch(goToPreviousQuestion())}
        disabled={isFirstQuestion || isLoading}
        variant='outline'
        size='lg'
        className={`group border-2 border-gray-300 bg-white font-semibold shadow-md transition-all hover:bg-sky-50 hover:shadow-lg disabled:opacity-30 ${
          isMobile ? 'w-full justify-center' : 'px-6'
        }`}
      >
        <ChevronLeft className='mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1' />
        <span className='hidden sm:inline'>Câu trước</span>
        <span className='sm:hidden'>Trước</span>
      </Button>

      {/* Progress Indicator */}
      <div className={`flex flex-col items-center gap-1 ${isMobile ? 'order-first w-full' : ''}`}>
        <span className='text-sm font-medium text-gray-500'>Câu hỏi</span>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold text-gray-600'>{currentQuestionIndex + 1}</span>
          <span className='text-gray-400'>/</span>
          <span className='text-lg font-semibold text-gray-600'>{questions.length}</span>
        </div>
      </div>

      {/* Next/Submit Button */}
      {isLastQuestion ? (
        <Button
          onClick={handleSubmitQuiz}
          disabled={isLoading}
          size='lg'
          className={` ${isMobile ? 'w-full justify-center' : 'px-8'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              Đang nộp bài...
            </>
          ) : (
            <>
              <Send className='mr-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              Nộp bài
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={() => dispatch(goToNextQuestion())}
          disabled={isLoading}
          size='lg'
          className={`bg-sky-100 text-blue-600 ${isMobile ? 'w-full justify-center' : 'px-6'}`}
        >
          <span className='hidden sm:inline'>Câu tiếp</span>
          <span className='sm:hidden'>Tiếp</span>
          <ChevronRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
        </Button>
      )}
    </div>
  )
}
