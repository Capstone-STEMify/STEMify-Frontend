import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Separator } from '@/components/shadcn/separator'
import { Save, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/utils/shadcn/utils'
import { useCreateQuizMutation, useUpdateQuizMutation } from '@/features/resource/quiz/api/quizApi'
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
import { useTranslations } from 'next-intl'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import BackButton from '@/components/shared/button/BackButton'

type QuizEditorSidebarProps = {
  onAddQuestion: () => void
}

export const QuizEditorSidebar = ({ onAddQuestion }: QuizEditorSidebarProps) => {
  const tq = useTranslations('quiz')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')

  const { quizId, sectionId, lessonId } = useParams()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const quiz = useAppSelector(selectQuiz)
  const selectedQuestionId = useAppSelector(selectSelectedQuestionId)

  const [collapsed, setCollapsed] = useState(false)
  const [isSavingQuiz, setIsSavingQuiz] = useState(false)

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation()
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation()

  const handleQuizInfoChange = (updates: Partial<typeof quiz>) => {
    dispatch(updateQuizInfo(updates))
  }

  const handleQuestionSelect = (id: number) => {
    dispatch(selectQuestion(id))
  }

  const handleSaveQuiz = async () => {
    setIsSavingQuiz(true)

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
      toast.success(tt('successMessage.update', { title: quiz.title }))
    } else {
      const res = await createQuiz(quizPayload).unwrap()
      toast.success(tt('successMessage.create', { title: quiz.title }))
      router.push(`/admin/lesson/${lessonId}/section/${sectionId}/quiz/${res.data.id}/question`)
    }

    dispatch(markAsSaved())

    setIsSavingQuiz(false)
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

  if (isCreating) {
    return (
      <div className='flex h-full w-80 shrink-0 flex-col overflow-hidden border-r'>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <aside className='border-border bg-card flex h-full w-80 shrink-0 flex-col overflow-hidden border-r'>
      {/* Toàn bộ nội dung được scroll */}
      <ScrollArea className='h-full'>
        <div className='flex min-h-full flex-col'>
          {/* Header */}
          <div className='border-border bg-card sticky top-0 z-10 flex items-center justify-between border-b p-4'>
            <div className='flex items-center gap-4'>
              <BackButton />
              <h2 className='text-foreground font-semibold'>{tq('upsert.settings')}</h2>
            </div>
            <Button variant='ghost' size='icon' onClick={() => setCollapsed(true)}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </div>

          {/* Body (scrollable nội dung thực tế) */}
          <div className='flex-1 space-y-6 p-4'>
            {/* Title + Description */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='title'>{tq('upsert.form.title')}</Label>
                <Input
                  id='title'
                  value={quiz.title}
                  onChange={(e) => handleQuizInfoChange({ title: e.target.value })}
                  placeholder={tq('upsert.form.title')}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='description'>{tq('upsert.form.description')}</Label>
                <Textarea
                  id='description'
                  value={quiz.description}
                  onChange={(e) => handleQuizInfoChange({ description: e.target.value })}
                  placeholder={tq('upsert.form.description')}
                  rows={3}
                />
              </div>
            </div>

            {/* Marks, Duration, etc */}
            <div className='grid grid-cols-2 gap-4'>
              {' '}
              <div className='space-y-1'>
                <Label htmlFor='totalMarks'>{tq('upsert.form.totalMarks')}</Label>
                <Input
                  id='totalMarks'
                  type='number'
                  value={quiz.totalMarks}
                  onChange={(e) => handleQuizInfoChange({ totalMarks: parseInt(e.target.value) || 100 })}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='passingMarks'>{tq('upsert.form.passingMarks')}</Label>
                <Input
                  id='passingMarks'
                  type='number'
                  value={quiz.passingMarks}
                  onChange={(e) => handleQuizInfoChange({ passingMarks: parseInt(e.target.value) || 50 })}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='timeLimitMinutes'>{tq('upsert.form.timeLimitMinutes')}</Label>
                <Input
                  id='timeLimit'
                  type='number'
                  value={quiz.timeLimitMinutes}
                  onChange={(e) => handleQuizInfoChange({ timeLimitMinutes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='durationDays'>{tq('upsert.form.durationDays')}</Label>
                <Input
                  id='duration'
                  type='number'
                  value={quiz.durationDays}
                  onChange={(e) => handleQuizInfoChange({ durationDays: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Save Quiz Info */}
            <div className='mt-6 border-t pt-4'>
              <Button onClick={handleSaveQuiz} className='w-full bg-blue-400' disabled={isSavingQuiz}>
                <Save className='mr-2 h-4 w-4' />
                {isSavingQuiz
                  ? tc('button.submitting')
                  : quizId
                    ? tq('upsert.form.updateQuizInfo')
                    : tq('upsert.create')}
              </Button>
            </div>
            <Separator />

            {/* Questions */}
            {quizId && (
              <div>
                <div className='mb-3 flex items-center justify-between'>
                  <Label>
                    {tq('upsert.form.question.question')} ({quiz.totalQuestions})
                  </Label>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={onAddQuestion}
                    disabled={!quizId}
                    className='h-8 px-2'
                    title={!quizId ? tc('button.save') : tc('button.addQuestion')}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                {quiz.questions.length > 0 && (
                  <div className='space-y-2'>
                    {quiz.questions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionSelect(Number(question.id))}
                        className={cn(
                          'w-full rounded-lg border p-3 text-left transition-all',
                          selectedQuestionId === question.id
                            ? 'border-primary bg-slate-50'
                            : 'border-border hover:border-primary/50 hover:bg-muted bg-slate-50'
                        )}
                      >
                        <div className='text-sm font-medium'>
                          {tq('upsert.form.question.question')} {index + 1}
                        </div>
                        <div className='text-muted-foreground mt-1 text-xs whitespace-pre-line'>
                          {question.content || 'Empty question'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
