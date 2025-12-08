'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { FileEdit, Sparkles } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { QuizEditorSidebar } from '@/features/resource/question/components/QuizEditorSidebar'
import { QuestionCard } from '@/features/resource/question/components/QuestionCard'
import { useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import { useParams } from 'next/navigation'
import {
  setQuiz,
  addQuestion,
  reorderQuestions,
  selectQuiz,
  selectSelectedQuestionId,
  resetQuizEditor,
  markAsSaved
} from '@/features/resource/question/slice/quizEditorSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/features/resource/question/api/questionApi'
import { toast } from 'sonner'
import { QuestionType } from '@/features/resource/question/types/question.type'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'

const QuizEditor = () => {
  const tq = useTranslations('quiz')
  const { quizId } = useParams()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  // Get state from Redux
  const quiz = useAppSelector(selectQuiz)
  const selectedQuestionId = useAppSelector(selectSelectedQuestionId)

  const [isSavingQuestions, setIsSavingQuestions] = useState(false)
  const hasQuestionsInAPI = quiz.questions.some((q) => q.id < 1000000000000)

  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestion] = useUpdateQuestionMutation()

  // Fetch quiz data
  const { data: quizData, isLoading } = useGetQuizByIdQuery(Number(quizId), { skip: !quizId })

  // Initialize quiz data when fetched
  useEffect(() => {
    if (quizData?.data) {
      dispatch(setQuiz(quizData.data))
    }
  }, [quizData, dispatch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetQuizEditor())
    }
  }, [dispatch])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = quiz.questions.findIndex((q) => q.id === active.id)
      const newIndex = quiz.questions.findIndex((q) => q.id === over.id)

      dispatch(reorderQuestions({ oldIndex, newIndex }))
    }
  }

  const handleAddQuestion = () => {
    dispatch(addQuestion())
  }

  const normalizeQuestionType = (type: QuestionType) => {
    return type === QuestionType.SINGLE_CHOICE ? QuestionType.MULTIPLE_CHOICE : type
  }

  const handleSaveQuestions = async () => {
    setIsSavingQuestions(true)

    if (!quizId) {
      toast.error('Please save quiz info first')
      return
    }

    const formatQuestions = (questions: typeof quiz.questions, isUpdate: boolean) =>
      questions.map((q) => {
        const isExistingQuestion = isUpdate && q.id < 1000000000000

        return {
          ...(isExistingQuestion && { id: q.id }),
          questionType: normalizeQuestionType(q.questionType),
          content: q.content,
          orderIndex: q.orderIndex,
          answerExplanation: q.answerExplanation,
          points: q.points,
          answers: q.answers.map((a) => ({
            ...(isExistingQuestion && { id: a.id }),
            content: a.content,
            isCorrect: a.isCorrect
          }))
        }
      })

    if (hasQuestionsInAPI) {
      await updateQuestion({
        quizId: Number(quizId),
        questions: formatQuestions(quiz.questions, true)
      }).unwrap()

      toast.success(`Đã tạo bài kiểm tra thành công`)
    } else {
      await createQuestion({
        quizId: Number(quizId),
        questions: formatQuestions(quiz.questions, false)
      }).unwrap()

      toast.success(`Đã tạo bài kiểm tra thành công`)
    }

    dispatch(markAsSaved())

    setIsSavingQuestions(false)
  }

  return (
    <div className='bg-background flex h-[90vh] w-full overflow-hidden'>
      <QuizEditorSidebar onAddQuestion={handleAddQuestion} />

      <main className='flex flex-1 flex-col overflow-hidden'>
        {/* Header cố định */}
        <div className='border-border bg-background flex shrink-0 justify-between border-b px-8 py-4'>
          <div>
            <div className='flex gap-5'>
              <h2 className='text-foreground font-bold'>{quiz.title || 'Untitled Quiz'}</h2>
              <Button
                onClick={() => {
                  openModal('importQuiz')
                }}
              >
                {tq('import.button')}
              </Button>
            </div>
            {quiz.description && <p className='text-muted-foreground mt-1'>{quiz.description}</p>}
          </div>
          {/* Footer cố định */}
          {quizId && quiz.questions.length > 0 && (
            <Button onClick={handleSaveQuestions} disabled={isSavingQuestions} size='lg' className='bg-blue-400'>
              <FileEdit className='mr-2 h-4 w-4' />
              {isSavingQuestions ? 'Saving...' : tq('upsert.form.question.saveQuestions')}
            </Button>
          )}
        </div>

        {/* Nội dung scroll */}
        <div className='flex-1 overflow-y-auto'>
          <div className='mx-auto max-w-5xl p-8'>
            {/* danh sách câu hỏi */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={quiz.questions.map((q) => Number(q.id))} strategy={verticalListSortingStrategy}>
                <div className='space-y-4'>
                  {quiz.questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      isSelected={selectedQuestionId === question.id}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuizEditor
