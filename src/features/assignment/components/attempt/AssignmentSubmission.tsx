'use client'
import { Sparkles, FileText, UploadCloud, X, Loader2 } from 'lucide-react'
import { useGetAssignmentByIdQuery } from '@/features/assignment/api/assignmentApi'
import { useCreateAssignmentAttemptMutation } from '@/features/assignment/api/studentAssignmentApi'
import { Assignment, AssignmentQuestion, AssignmentQuestionType } from '@/features/assignment/types/assignment.type'
import { toast } from 'sonner'
import { CreateAttemptPayload, QuestionAttemptPayload } from '@/features/assignment/types/assigmentlistdetail.type'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { useAppSelector } from '@/hooks/redux-hooks'

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
        <span className='font-semibold text-blue-600'>Click to upload</span> or drag and drop
      </p>
      <p className='text-xs text-gray-500'>PDF, DOC, or DOCX</p>
      <input
        type='file'
        className='absolute h-full w-full opacity-0'
        onChange={handleFileChange}
        accept='.pdf,.doc,.docx'
      />
    </div>
  )
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export default function AssignmentSubmissionForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const user = useAppSelector((state) => state.auth?.user)

  const assignmentId = params.assignmentId as string
  const studentAssignmentId = searchParams.get('studentAssignmentId')

  const { data: assignmentData, isLoading: isLoadingAssignment } = useGetAssignmentByIdQuery(Number(assignmentId), {
    skip: !assignmentId
  })

  const [activeTab, setActiveTab] = useState<'instructions' | 'submission' | 'discussions'>('submission')

  const [createAttempt, { isLoading: isSubmitting }] = useCreateAssignmentAttemptMutation()

  const [projectTitle, setProjectTitle] = useState('')
  const [answers, setAnswers] = useState<Record<number, { text?: string; file?: File | null }>>({})

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
    if (!assignmentData?.data || !studentAssignmentId) {
      toast.error('Cannot submit assignment. Invalid data.')
      return
    }

    const { questions } = assignmentData.data
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
            toast.error(`Failed to upload file for Question ${question.orderIndex}.`)
            return
          }
        }
      }
      questionAttempts.push(attempt)
    }

    const payload: CreateAttemptPayload = {
      studentAssignmentId: Number(studentAssignmentId),
      questionAttempts: questionAttempts
    }

    try {
      await createAttempt({ body: payload }).unwrap()
      toast.success('Assignment submitted successfully!')
      router.back()
    } catch (error) {
      toast.error('Failed to submit assignment.')
      console.error(error)
    }
  }

  if (isLoadingAssignment) return <LoadingComponent />

  console.log(assignmentData?.data, studentAssignmentId)

  if (!assignmentData?.data || !studentAssignmentId) {
    return <div className='p-6 text-center text-red-500'>Error: Assignment data or Student ID is missing.</div>
  }

  const { data: assignment } = assignmentData
  const questions = [...assignment.questions].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className='mx-auto max-w-5xl space-y-6 p-6'>
      <div>
        <h1 className='mb-4 text-3xl font-normal'>{assignment.title}</h1>
        <div className='text-sm text-gray-600'>
          <span className='font-semibold'>Duration</span> {assignment.durationDays} days
        </div>
      </div>

      <Card className='border-blue-200 bg-blue-50'>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <Sparkles className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600' />
            <div className='flex-1'>
              <h3 className='mb-2 font-semibold text-gray-900'>AI Grading</h3>
              <p className='mb-2 text-sm text-gray-700'>
                After submitting your assignment and completing your required peer reviews, you'll receive an
                AI-generated grade based on the assignment rubrics. You'll then have the option to have your assignment
                reviewed by your peers instead.
              </p>
              <p className='text-xs text-gray-600'>
                Your data will be used in accordance with{' '}
                <a href='#' className='text-blue-600 hover:underline'>
                  Coursera's Privacy Notice
                </a>
                .
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex gap-6'>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'instructions'
                ? 'border-blue-600 font-medium text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'submission'
                ? 'border-blue-600 font-medium text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My submission
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'discussions'
                ? 'border-blue-600 font-medium text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Discussions
          </button>
        </div>
      </div>

      {/* Submission Form */}
      {true && (
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='project-title' className='text-base font-normal'>
              Project Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='project-title'
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder='fpt'
              className='max-w-2xl'
            />
          </div>

          {questions.map((question) => (
            <div key={question.id} className='space-y-4 rounded-lg border p-4 shadow-sm'>
              <div className='space-y-2'>
                <h3 className='text-base font-normal text-gray-900'>
                  Question {question.orderIndex} ({question.points} pts)
                </h3>
                <p className='text-sm text-gray-700'>{question.content}</p>
              </div>

              {question.type === AssignmentQuestionType.TEXT ? (
                <Textarea
                  value={answers[question.id]?.text || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder='Type your answer here...'
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
            <Button
              variant='outline'
              className='border-gray-300 text-gray-700 hover:bg-gray-50'
              disabled={isSubmitting}
            >
              Save as draft
            </Button>
            <Button onClick={handleSubmit} className='bg-blue-600 text-white hover:bg-blue-700' disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              Submit assignment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
