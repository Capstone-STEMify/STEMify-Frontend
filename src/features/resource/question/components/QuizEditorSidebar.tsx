import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Separator } from '@/components/shadcn/separator'
import { Save, ChevronLeft, ChevronRight, FileEdit } from 'lucide-react'
import { useState } from 'react'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { toast } from 'sonner'
import { cn } from '@/utils/shadcn/utils'
import { useCreateQuizMutation, useUpdateQuizMutation } from '@/features/resource/quiz/api/quizApi'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/features/resource/question/api/questionApi'

type QuizEditorSidebarProps = {
  quiz: Quiz
  selectedQuestionId: number | null
  onQuestionSelect: (id: number) => void
  onQuizUpdate: (quiz: Quiz) => void
}

export const QuizEditorSidebar = ({
  quiz,
  selectedQuestionId,
  onQuestionSelect,
  onQuizUpdate
}: QuizEditorSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [isSavingQuiz, setIsSavingQuiz] = useState(false)
  const [isSavingQuestions, setIsSavingQuestions] = useState(false)

  const [createQuiz] = useCreateQuizMutation()
  const [updateQuiz] = useUpdateQuizMutation()

  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestion] = useUpdateQuestionMutation()
  const handleSaveQuiz = async () => {
    setIsSavingQuiz(true)
    try {
      const quizPayload = {
        title: quiz.title,
        description: quiz.description,
        totalMarks: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        durationDays: quiz.durationDays,
        timeLimitMinutes: quiz.timeLimitMinutes
      }

      if (quiz.id) {
        await updateQuiz({ id: quiz.id, body: quizPayload }).unwrap()
      } else {
        await createQuiz(quizPayload).unwrap()
      }

      toast.message('Quiz info saved successfully')
    } catch (error) {
      toast('Failed to save quiz info')
    } finally {
      setIsSavingQuiz(false)
    }
  }

  const handleSaveQuestions = async () => {
    setIsSavingQuestions(true)
    try {
      const questionsPayload = quiz.questions.map((q) => ({
        id: q.id, // create thì comment id
        questionType: q.questionType,
        content: q.content,
        orderIndex: q.orderIndex,
        answerExplanation: q.answerExplanation,
        points: q.points,
        answers: q.answers.map((a) => ({
          id: a.id, // create thì comment id
          content: a.content,
          isCorrect: a.isCorrect
        }))
      }))

      // const res = await createQuestion({ quizId: quiz.id, questions: questionsPayload }).unwrap()
      const res = await updateQuestion({ quizId: quiz.id, questions: questionsPayload }).unwrap()

      toast.message(`${quiz.questions.length} questions saved successfully`)
    } catch (error) {
      toast.error('Failed to save questions')
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
        <h2 className='text-foreground font-semibold'>Quiz Settings</h2>
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
                onChange={(e) => onQuizUpdate({ ...quiz, title: e.target.value })}
                placeholder='Enter quiz title'
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={quiz.description}
                onChange={(e) => onQuizUpdate({ ...quiz, description: e.target.value })}
                placeholder='Enter quiz description'
                rows={3}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label htmlFor='totalMarks'>Total Marks</Label>
              <Input id='totalMarks' type='number' value={quiz.totalMarks} readOnly className='bg-muted' />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='passingMarks'>Passing Marks</Label>
              <Input
                id='passingMarks'
                type='number'
                value={quiz.passingMarks}
                onChange={(e) => onQuizUpdate({ ...quiz, passingMarks: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='timeLimit'>Time Limit (min)</Label>
              <Input
                id='timeLimit'
                type='number'
                value={quiz.timeLimitMinutes}
                onChange={(e) => onQuizUpdate({ ...quiz, timeLimitMinutes: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className='space-y-1'>
              <Label htmlFor='duration'>Duration (days)</Label>
              <Input
                id='duration'
                type='number'
                value={quiz.durationDays}
                onChange={(e) => onQuizUpdate({ ...quiz, durationDays: parseInt(e.target.value) || 0 })}
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
                    onClick={() => onQuestionSelect(question.id)}
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
