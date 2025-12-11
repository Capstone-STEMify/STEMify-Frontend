'use client'
import { Sparkles, FileText, UploadCloud, X, Loader2, Save } from 'lucide-react'
import { useCreateAssignmentAttemptMutation } from '@/features/assignment/api/studentAssignmentApi'
import { Assignment, AssignmentQuestion, AssignmentQuestionType } from '@/features/assignment/types/assignment.type'
import { toast } from 'sonner'
import { CreateAttemptPayload, QuestionAttemptPayload } from '@/features/assignment/types/assigmentlistdetail.type'
import { useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { useAppSelector } from '@/hooks/redux-hooks'
import BackButton from '@/components/shared/button/BackButton'
import SEmpty from '@/components/shared/empty/SEmpty'
import { fileToBase64, formatDate, formatDateV2 } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'
import { set, get, del } from 'idb-keyval'

const FileInput = ({ file, onFileChange }: { file: File | null; onFileChange: (file: File | null) => void }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (
      droppedFile &&
      (droppedFile.type === 'application/pdf' ||
        droppedFile.type === 'application/msword' ||
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    ) {
      onFileChange(droppedFile)
    } else {
      toast.error('Only .pdf, .doc, or .docx files are allowed.')
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileChange(selectedFile)
    }
  }

  if (file) {
    return (
      <div className='flex h-32 w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-4'>
        <div className='flex items-center gap-3'>
          <FileText className='h-8 w-8 flex-shrink-0 text-gray-500' />
          <div>
            <p className='font-medium text-gray-700'>{file.name}</p>
            <p className='text-sm text-gray-500'>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onFileChange(null)}
          className='text-red-500 hover:text-red-600'
        >
          <X className='h-5 w-5' />
        </Button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
      <p className='mt-2 text-sm text-gray-600'>
        <span className='font-semibold text-blue-600'>Nhấn vào để upload</span> hoặc kéo thả
      </p>
      <p className='text-xs text-gray-500'>PDF, DOC, hoặc DOCX</p>
      <input
        type='file'
        className='absolute h-full w-full opacity-0'
        onChange={handleFileChange}
        accept='.pdf,.doc,.docx, .mp4, .png, .jpg, .jpeg'
      />
    </div>
  )
}

export default function AssignmentSubmissionForm() {
  const t = useTranslations('assignment')
  const tc = useTranslations('common')
  const tt = useTranslations('toast.successMessage')

  const router = useRouter()
  const locale = useLocale()
  const { selectedAssignment, selectedStudentAssignment } = useAppSelector((state) => state.studentAssignmentSelected)

  console.log(selectedAssignment, selectedStudentAssignment)

  const [createAttempt, { isLoading: isSubmitting }] = useCreateAssignmentAttemptMutation()
  const [projectTitle, setProjectTitle] = useState('')
  const [answers, setAnswers] = useState<Record<number, { text?: string; file?: File | null }>>({})
  const [isDataRestored, setIsDataRestored] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const storageKey = selectedStudentAssignment ? `draft_submission_${selectedStudentAssignment.id}` : null

  useEffect(() => {
    const loadDraft = async () => {
      if (!storageKey) return
      try {
        const savedData = await get(storageKey)
        if (savedData) {
          setAnswers(savedData)
          toast.info(tt('restoreData'), { duration: 3000 })
        }
      } catch (error) {
        console.error('Failed to load draft:', error)
      } finally {
        setIsDataRestored(true)
      }
    }
    loadDraft()
  }, [storageKey])

  useEffect(() => {
    if (!isDataRestored || !storageKey || Object.keys(answers).length === 0) return

    const saveDraft = async () => {
      try {
        await set(storageKey, answers)
        setLastSaved(new Date())
      } catch (error) {
        console.error('Failed to save draft:', error)
      }
    }

    const timeoutId = setTimeout(saveDraft, 1000)

    return () => clearTimeout(timeoutId)
  }, [answers, storageKey, isDataRestored])

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], text: value }
    }))
  }
  const handleFileChange = (questionId: number, file: File | null) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], file: file }
    }))
  }

  const handleSubmit = async () => {
    if (!selectedAssignment || !selectedStudentAssignment) {
      toast.error(tt('submitAsmDataFail'))
      return
    }

    const questions = selectedAssignment.questions
    const questionAttempts: QuestionAttemptPayload[] = []

    for (const question of questions) {
      const answer = answers[question.id]
      const attempt: QuestionAttemptPayload = {
        assignmentQuestionId: question.id
      }

      if (question.type === AssignmentQuestionType.TEXT) {
        attempt.answerText = answer?.text || ''
      } else if (question.type === AssignmentQuestionType.FILE) {
        if (answer?.file) {
          try {
            const base64File = await fileToBase64(answer.file)
            attempt.answerFile = base64File
          } catch (error) {
            toast.error(tt('submitFileFail', { questionIndex: question.orderIndex }))
            return
          }
        }
      }
      questionAttempts.push(attempt)
    }

    const payload: CreateAttemptPayload = {
      studentAssignmentId: Number(selectedStudentAssignment.id),
      questionAttempts: questionAttempts
    }

    try {
      await createAttempt({ body: payload }).unwrap()

      if (storageKey) {
        await del(storageKey)
      }

      toast.success(tt('submitAsmSuccess'))
      router.back()
    } catch (error) {
      toast.error(tt('submitAsmFail'))
      console.error(error)
    }
  }

  if (!selectedAssignment || !selectedStudentAssignment) {
    return (
      <div>
        <SEmpty title={t('student.noAsm')} />
      </div>
    )
  }

  const questions = [...selectedAssignment.questions].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className='mx-auto max-w-5xl space-y-6 p-6'>
      <div>
        <div className='flex gap-4'>
          <BackButton />
          <h1 className='mb-4 text-3xl font-normal'>{selectedAssignment.title}</h1>
        </div>
        <div className='flex items-end justify-between'>
          <div className='text-sm text-gray-600'>
            <span className='font-semibold'>{t('student.doAsm.deadline')}</span>{' '}
            {formatDate(selectedStudentAssignment.dueDate, { showTime: true, locale: locale === 'vi' ? 'vi' : 'en' })}
          </div>

          {lastSaved && (
            <div className='flex items-center gap-1 text-xs text-green-600'>
              <Save className='h-3 w-3' />
              {t('student.doAsm.saveDraft', {
                time: formatDate(lastSaved.toISOString(), { showTime: true, locale: locale === 'vi' ? 'vi' : 'en' })
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex gap-6'>
          <button className='border-b-2 border-blue-600 px-1 pb-3 font-medium text-blue-600 transition-colors'>
            {t('student.doAsm.mySub')}
          </button>
        </div>
      </div>

      {/* Submission Form */}
      {true && (
        <div className='space-y-6'>
          {questions.map((question) => (
            <div key={question.id} className='space-y-4 rounded-lg border p-4 shadow-sm'>
              <div className='space-y-2'>
                <h3 className='text-base font-normal text-gray-900'>
                  {t('teacher.modal.question')} {question.orderIndex} ({question.points} {t('teacher.modal.point')})
                </h3>
                <p className='text-sm text-gray-700'>{question.content}</p>
              </div>

              {question.type === AssignmentQuestionType.TEXT ? (
                <Textarea
                  value={answers[question.id]?.text || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder={t('student.doAsm.placeholder')}
                  className='min-h-[200px]'
                  disabled={isSubmitting}
                />
              ) : (
                <FileInput
                  file={answers[question.id]?.file || null}
                  onFileChange={(file) => handleFileChange(question.id, file)}
                />
              )}
            </div>
          ))}

          {/* Submit Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button onClick={handleSubmit} className='bg-blue-600 text-white hover:bg-blue-700' disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              {tc('button.submit')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
