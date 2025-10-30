'use client'
import { useEffect, useState } from 'react'
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
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { QuizEditorSidebar } from '@/features/resource/question/components/QuizEditorSidebar'
import { QuestionCard } from '@/features/resource/question/components/QuestionCard'
import { useGetQuizByIdQuery } from '@/features/resource/quiz/api/quizApi'
import { useParams } from 'next/navigation'

const QuizEditor = () => {
  const { quizId } = useParams()

  const { data: quizData } = useGetQuizByIdQuery(Number(quizId))

  const [quiz, setQuiz] = useState<Quiz>({
    id: 1,
    title: 'Untitled Quiz',
    description: '',
    totalMarks: 0,
    passingMarks: 0,
    durationDays: 7,
    status: 'Draft',
    contentId: 0,
    timeLimitMinutes: 30,
    totalQuestions: 0,
    questions: []
  })

  useEffect(() => {
    if (quizData?.data) {
      setQuiz(quizData.data)
    }
  }, [quizData])

  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuiz((prev) => {
        const oldIndex = prev.questions.findIndex((q) => q.id === active.id)
        const newIndex = prev.questions.findIndex((q) => q.id === over.id)

        const reorderedQuestions = arrayMove(prev.questions, oldIndex, newIndex).map((q, index) => ({
          ...q,
          orderIndex: index + 1
        }))

        return {
          ...prev,
          questions: reorderedQuestions
        }
      })
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      questionType: QuestionType.SINGLE_CHOICE,
      content: '',
      orderIndex: quiz.questions.length + 1,
      answerExplanation: '',
      points: 1,
      answers: [
        { id: Date.now() + 1, content: '', isCorrect: false },
        { id: Date.now() + 2, content: '', isCorrect: false }
      ]
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      totalQuestions: prev.totalQuestions + 1,
      totalMarks: prev.totalMarks + 1
    }))

    setSelectedQuestionId(newQuestion.id)
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    }))
  }

  const deleteQuestion = (questionId: number) => {
    setQuiz((prev) => {
      const updatedQuestions = prev.questions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({ ...q, orderIndex: index + 1 }))

      return {
        ...prev,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
        totalMarks: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
      }
    })

    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null)
    }
  }

  const duplicateQuestion = (questionId: number) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) return

    const newQuestion: Question = {
      ...question,
      id: Date.now(),
      orderIndex: quiz.questions.length + 1,
      answers: question.answers.map((a) => ({ ...a, id: Date.now() + Math.random() }))
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      totalQuestions: prev.totalQuestions + 1,
      totalMarks: prev.totalMarks + newQuestion.points
    }))
  }

  return (
    <div className='bg-background flex w-full'>
      <QuizEditorSidebar
        quiz={quiz}
        selectedQuestionId={selectedQuestionId}
        onQuestionSelect={setSelectedQuestionId}
        onQuizUpdate={setQuiz}
      />

      <main className='flex-1 overflow-auto'>
        <div className='mx-auto max-w-4xl p-8'>
          <div className='mb-8'>
            <h1 className='text-foreground mb-2 text-3xl font-bold'>{quiz.title}</h1>
            {quiz.description && <p className='text-muted-foreground'>{quiz.description}</p>}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={quiz.questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
              <div className='space-y-4'>
                {quiz.questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isSelected={selectedQuestionId === question.id}
                    onSelect={() => setSelectedQuestionId(question.id)}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                    onDuplicate={duplicateQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className='mt-4'>
            <Button
              onClick={addQuestion}
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
