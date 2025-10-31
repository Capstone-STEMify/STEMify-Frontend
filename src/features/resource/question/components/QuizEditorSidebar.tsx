import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Separator } from '@/components/shadcn/separator'
import { Save, ChevronLeft, ChevronRight, FileEdit } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/utils/shadcn/utils'
import { useCreateQuizMutation, useUpdateQuizMutation } from '@/features/resource/quiz/api/quizApi'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/features/resource/question/api/questionApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  selectQuiz,
  selectSelectedQuestionId,
  selectIsDirty,
  updateQuizInfo,
  selectQuestion,
  markAsSaved
} from '@/features/resource/question/slice/quizEditorSlice'

export const QuizEditorSidebar = () => {
  const { quizId, sectionId, lessonId } = useParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Get state from Redux
  const quiz = useAppSelector(selectQuiz)
  const selectedQuestionId = useAppSelector(selectSelectedQuestionId)
  const isDirty = useAppSelector(selectIsDirty)

  const [collapsed, setCollapsed] = useState(false)
  const [isSavingQuiz, setIsSavingQuiz] = useState(false)
  const [isSavingQuestions, setIsSavingQuestions] = useState(false)

  const hasQuestionsInAPI = quiz.questions.some((q) => q.id < 1000000000000)

  const [createQuiz] = useCreateQuizMutation()
  const [updateQuiz] = useUpdateQuizMutation()
  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestion] = useUpdateQuestionMutation()

  const handleQuizInfoChange = (updates: Partial<typeof quiz>) => {
    dispatch(updateQuizInfo(updates))
  }

  const handleQuestionSelect = (id: number) => {
    dispatch(selectQuestion(id))
  }

  const handleSaveQuiz = async () => {
    setIsSavingQuiz(true)
    try {
      const quizPayload = {
        title: quiz.title,
        description: quiz.description,
        totalMarks: 100,
        passingMarks: quiz.passingMarks,
        durationDays: quiz.durationDays,
        timeLimitMinutes: quiz.timeLimitMinutes,
        sectionId: Number(sectionId)
      }

      if (quizId) {
        await updateQuiz({ id: Number(quizId), body: quizPayload }).unwrap()
      } else {
        const res = await createQuiz(quizPayload).unwrap()
        router.push(`/admin/lesson/${lessonId}/section/${sectionId}/quiz/${res.data.id}/question`)
      }

      dispatch(markAsSaved())
      toast.message('Quiz info saved successfully')
    } catch (error) {
      toast.error('Failed to save quiz info')
    } finally {
      setIsSavingQuiz(false)
    }
  }

  const handleSaveQuestions = async () => {
    setIsSavingQuestions(true)
    try {
      if (!quizId) {
        toast.error('Quiz ID is required')
        return
      }

      if (hasQuestionsInAPI) {
        // ✅ UPDATE MODE: Mix of existing and new questions
        const updateQuestionsPayload = quiz.questions.map((q) => {
          // Questions from API have small IDs (< 1000000000000)
          const isExistingQuestion = q.id < 1000000000000

          if (isExistingQuestion) {
            // Existing question: Include IDs
            return {
              id: q.id,
              questionType: q.questionType,
              content: q.content,
              orderIndex: q.orderIndex,
              answerExplanation: q.answerExplanation,
              points: q.points,
              answers: q.answers.map((a) => ({
                id: a.id,
                content: a.content,
                isCorrect: a.isCorrect
              }))
            }
          } else {
            // New question: Omit IDs (backend will generate)
            return {
              questionType: q.questionType,
              content: q.content,
              orderIndex: q.orderIndex,
              answerExplanation: q.answerExplanation,
              points: q.points,
              answers: q.answers.map((a) => ({
                content: a.content,
                isCorrect: a.isCorrect
              }))
            }
          }
        })

        await updateQuestion({
          quizId: Number(quizId),
          questions: updateQuestionsPayload
        }).unwrap()

        toast.message(`${quiz.questions.length} questions updated successfully`)
      } else {
        // ✅ CREATE MODE: All questions are new
        const createQuestionsPayload = quiz.questions.map((q) => ({
          questionType: q.questionType,
          content: q.content,
          orderIndex: q.orderIndex,
          answerExplanation: q.answerExplanation,
          points: q.points,
          answers: q.answers.map((a) => ({
            content: a.content,
            isCorrect: a.isCorrect
          }))
        }))

        await createQuestion({
          quizId: Number(quizId),
          questions: createQuestionsPayload
        }).unwrap()

        toast.message(`${quiz.questions.length} questions created successfully`)
      }

      dispatch(markAsSaved())
    } catch (error) {
      toast.error('Failed to save questions')
      console.error('Save questions error:', error)
    } finally {
      setIsSavingQuestions(false)
    }
  }

  if (collapsed) {
    return (
      <aside className='border-border bg-card flex w-14 flex-col items-center border-r py-4'>
        <Button variant='ghost' size='icon' onClick={() => setCollapsed(false)} className='mb-4'>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </aside>
    )
  }

  return (
    <aside className='border-border bg-card flex w-80 flex-col border-r'>
      <div className='border-border flex items-center justify-between border-b p-4'>
        <div className='flex items-center gap-2'>
          <h2 className='text-foreground font-semibold'>Quiz Settings</h2>
          {isDirty && <span className='text-xs text-orange-500'>● Unsaved</span>}
        </div>
        <Button variant='ghost' size='icon' onClick={() => setCollapsed(true)}>
          <ChevronLeft className='h-4 w-4' />
        </Button>
      </div>

      <ScrollArea className='flex-1'>
        <div className='space-y-6 p-4'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={quiz.title}
                onChange={(e) => handleQuizInfoChange({ title: e.target.value })}
                placeholder='Enter quiz title'
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={quiz.description}
                onChange={(e) => handleQuizInfoChange({ description: e.target.value })}
                placeholder='Enter quiz description'
                rows={3}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label htmlFor='totalMarks'>Total Marks</Label>
              <Input
                id='totalMarks'
                type='number'
                value={quiz.totalMarks}
                onChange={(e) => handleQuizInfoChange({ totalMarks: parseInt(e.target.value) || 100 })}
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='passingMarks'>Passing Marks</Label>
              <Input
                id='passingMarks'
                type='number'
                value={quiz.passingMarks}
                onChange={(e) => handleQuizInfoChange({ passingMarks: parseInt(e.target.value) || 50 })}
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='timeLimit'>Time Limit (min)</Label>
              <Input
                id='timeLimit'
                type='number'
                value={quiz.timeLimitMinutes}
                onChange={(e) => handleQuizInfoChange({ timeLimitMinutes: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='duration'>Duration (days)</Label>
              <Input
                id='duration'
                type='number'
                value={quiz.durationDays}
                onChange={(e) => handleQuizInfoChange({ durationDays: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className='mb-3 block'>Questions ({quiz.totalQuestions})</Label>
            <ScrollArea className='h-64'>
              <div className='space-y-2'>
                {quiz.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionSelect(Number(question.id))}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left transition-all',
                      selectedQuestionId === question.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    )}
                  >
                    <div className='text-sm font-medium'>Question {index + 1}</div>
                    <div className='text-muted-foreground mt-1 truncate text-xs'>
                      {question.content || 'Empty question'}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>

      <div className='border-border space-y-2 border-t p-4'>
        <Button onClick={handleSaveQuiz} className='w-full' disabled={isSavingQuiz}>
          <Save className='mr-2 h-4 w-4' />
          {isSavingQuiz ? 'Saving...' : 'Save Quiz Info'}
        </Button>
        <Button
          onClick={handleSaveQuestions}
          variant='secondary'
          className='w-full'
          disabled={isSavingQuestions || quiz.questions.length === 0}
        >
          <FileEdit className='mr-2 h-4 w-4' />
          {isSavingQuestions ? 'Saving...' : 'Save Questions'}
        </Button>
      </div>
    </aside>
  )
}
