'use client'
import { useEffect } from 'react'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
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
  resetQuizEditor
} from '@/features/resource/question/slice/quizEditorSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

const QuizEditor = () => {
  const { quizId } = useParams()
  const dispatch = useAppDispatch()

  // Get state from Redux
  const quiz = useAppSelector(selectQuiz)
  const selectedQuestionId = useAppSelector(selectSelectedQuestionId)

  // Fetch quiz data
  const { data: quizData } = useGetQuizByIdQuery(Number(quizId), { skip: !quizId })

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

  return (
    <div className='bg-background flex w-full'>
      <QuizEditorSidebar />

      <main className='flex-1 overflow-auto'>
        <div className='mx-auto max-w-4xl p-8'>
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold'>{quiz.title}</h1>
            {quiz.description && <p className='text-muted-foreground'>{quiz.description}</p>}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={quiz.questions.map((q) => Number(q.id))} strategy={verticalListSortingStrategy}>
              <div className='space-y-4'>
                {quiz.questions.map((question) => (
                  <QuestionCard key={question.id} question={question} isSelected={selectedQuestionId === question.id} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className='mt-4'>
            <Button
              onClick={handleAddQuestion}
              variant='outline'
              className='hover:border-primary hover:bg-primary/5 h-24 w-full border-2 border-dashed transition-all'
            >
              <Plus className='mr-2 h-5 w-5' />
              Add Question
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuizEditor
