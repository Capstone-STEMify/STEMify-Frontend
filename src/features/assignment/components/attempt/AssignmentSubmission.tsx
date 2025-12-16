'use client'
import { FileText, UploadCloud, X, Loader2, Save } from 'lucide-react'
import { useCreateAssignmentAttemptMutation } from '@/features/assignment/api/studentAssignmentApi'
import { AssignmentQuestionType } from '@/features/assignment/types/assignment.type'
import { toast } from 'sonner'
import { CreateAttemptPayload, QuestionAttemptPayload } from '@/features/assignment/types/assigmentlistdetail.type'
import { useState, useEffect } from 'react'
import { Button } from '@/components/shadcn/button'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/shadcn/textarea'
import { useAppSelector, useAppDispatch } from '@/hooks/redux-hooks'
import { setSelectedAssignment, setSelectedStudentAssignment } from '@/features/assignment/slice/studentAssignmentSlice'
import BackButton from '@/components/shared/button/BackButton'
import SEmpty from '@/components/shared/empty/SEmpty'
import { fileToBase64, formatDate } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'
import { set, get, del } from 'idb-keyval'

const FileInput = ({ file, onFileChange }: { file: File | null; onFileChange: (file: File | null) => void }) => {
  const t = useTranslations('assignment.student.doAsm')
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
      toast.error(t('fileError'))
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
        <span className='font-semibold text-blue-600'>{t('uploadClick')}</span> {t('uploadDrag')}
      </p>
      <p className='text-xs text-gray-500'>{t('uploadFormat')}</p>
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
  const tStudent = useTranslations('assignment.student.doAsm')
  const tc = useTranslations('common')
  const router = useRouter()
  const locale = useLocale()
  
  const dispatch = useAppDispatch()
  const { selectedAssignment, selectedStudentAssignment } = useAppSelector((state) => state.studentAssignmentSelected)

  const [createAttempt, { isLoading: isSubmitting }] = useCreateAssignmentAttemptMutation()
  const [answers, setAnswers] = useState<Record<number, { text?: string; file?: File | null }>>({})
  const [isRestoringSession, setIsRestoringSession] = useState(true)
  const [isDraftLoaded, setIsDraftLoaded] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const storageKey = selectedStudentAssignment ? `draft_submission_${selectedStudentAssignment.id}` : null

  useEffect(() => {
    if (!selectedAssignment || !selectedStudentAssignment) {
      try {
        const backupData = localStorage.getItem('assignment_session_backup')
        if (backupData) {
          const parsedData = JSON.parse(backupData)
          if (parsedData.assignment && parsedData.studentAssignment) {
            dispatch(setSelectedAssignment(parsedData.assignment))
            dispatch(setSelectedStudentAssignment(parsedData.studentAssignment))
          }
        }
      } catch (error) {
        console.error('Failed to restore assignment session:', error)
      }
    }
    const timer = setTimeout(() => setIsRestoringSession(false), 500)
    return () => clearTimeout(timer)
  }, [selectedAssignment, selectedStudentAssignment, dispatch])

  useEffect(() => {
    const loadDraft = async () => {
      if (!storageKey) return
      try {
        const savedData = await get(storageKey)
        if (savedData) {
          setAnswers(savedData)
          toast.info(tStudent('restoreSuccess'), { duration: 3000 })
        }
      } catch (error) {
        console.error('Failed to load draft:', error)
      } finally {
        setIsDraftLoaded(true)
      }
    }
    
    if (storageKey) {
        loadDraft()
    }
  }, [storageKey, tStudent])

  useEffect(() => {
    if (!isDraftLoaded || !storageKey || Object.keys(answers).length === 0) return

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
  }, [answers, storageKey, isDraftLoaded])


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
      toast.error(tStudent('invalidData'))
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
            toast.error(tStudent('uploadFail', { index: question.orderIndex }))
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
      localStorage.removeItem('assignment_session_backup')
      
      toast.success(tStudent('submitSuccess'))
      router.back()
    } catch (error) {
      toast.error(tStudent('submitFail'))
      console.error(error)
    }
  }

  if (isRestoringSession && (!selectedAssignment || !selectedStudentAssignment)) {
    return (
      <div className="flex h-64 w-full items-center justify-center flex-col gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-sm text-gray-500">{tStudent('restoring')}</span>
      </div>
    )
  }

  if (!selectedAssignment || !selectedStudentAssignment) {
    return (
      <div>
        <SEmpty title={tStudent('noAsmFound')} />
        <div className='mt-4 flex justify-center'>
            <BackButton />
        </div>
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
        <div className='flex justify-between items-end'>
            <div className='text-sm text-gray-600'>
              <span className='font-semibold'>{tStudent('deadline')}</span>{' '}
              {formatDate(selectedStudentAssignment.dueDate, { showTime: true, locale: locale === 'vi' ? 'vi' : 'en' })}
            </div>
            
            {lastSaved && (
                <div className='flex items-center text-xs text-green-600 gap-1 animate-pulse'>
                    <Save className="w-3 h-3" />
                     {tStudent('saveDraft', { time: formatDate(lastSaved.toISOString(), { showTime: true, locale: locale === 'vi' ? 'vi' : 'en' }) })}
                </div>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex gap-6'>
          <button className='border-b-2 border-blue-600 px-1 pb-3 font-medium text-blue-600 transition-colors'>
            {tStudent('mySub')}
          </button>
        </div>
      </div>

      {/* Submission Form */}
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
                  placeholder={tStudent('placeholder')}
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
    </div>
  )
}