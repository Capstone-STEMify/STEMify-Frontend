import React, { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Label } from '@/components/shadcn/label'
import {
  Sparkles,
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Image,
  Code,
  Superscript,
  AlignLeft,
  AlignRight,
  Link2Off
} from 'lucide-react'

export type Assignment = {
  id: number
  contentId: number
  totalScore: number
  passingScore: number
  allowResubmission: string
  dueDate: string
}

export type AssignmentQuestion = {
  id: number
  assignmentId: number
  type: AssignmentQuestionType
  prompt: string
  orderIndex: number
  maxScore: number
}

export enum AssignmentQuestionType {
  TEXT = 'Text',
  FILE = 'File'
}

interface AssignmentSubmissionFormProps {
  assignment: Assignment
  questions: AssignmentQuestion[]
  title?: string
  onSubmit?: (data: SubmissionFormData) => void
}

export type SubmissionFormData = {
  projectTitle: string
  answers: {
    questionId: number
    answerText: string
    answerFile?: File
  }[]
}

export default function AssignmentSubmissionForm({
  assignment,
  questions,
  title = 'Graded Assignment: Project Scenario 2',
  onSubmit
}: AssignmentSubmissionFormProps) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'submission' | 'discussions'>('submission')
  const [projectTitle, setProjectTitle] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    })
  }

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = () => {
    const formData: SubmissionFormData = {
      projectTitle,
      answers: questions.map((q) => ({
        questionId: q.id,
        answerText: answers[q.id] || ''
      }))
    }
    onSubmit?.(formData)
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6 p-6'>
      {/* Header */}
      <div>
        <h1 className='mb-4 text-3xl font-normal'>{title}</h1>
        <div className='text-sm text-gray-600'>
          <span className='font-semibold'>Deadline</span> {formatDeadline(assignment.dueDate)}
        </div>
      </div>

      {/* AI Grading Notice */}
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
      {activeTab === 'submission' && (
        <div className='space-y-6'>
          {/* Project Title */}
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

          {/* Questions */}
          {questions.map((question, index) => (
            <div key={question.id} className='space-y-4'>
              <div className='space-y-2'>
                <h3 className='text-base font-normal text-gray-900'>{question.prompt}</h3>

                {/* Instructions/Steps if this is a multi-step question */}
                {question.orderIndex === 0 && (
                  <ul className='ml-6 space-y-3 text-sm text-gray-700'>
                    <li className='list-disc'>
                      Step 1: Start with analyzing the scenario and <strong>identifying characteristics</strong> of this
                      situation and <strong>specify logic</strong> behind the selection of characteristics. Example: You
                      may identify "User Needs Unknown" as a characteristic based on statement x, y and z in the
                      scenario.
                    </li>
                    <li className='list-disc'>
                      Step 2: Map the characteristics to <strong>selection of model</strong> and{' '}
                      <strong>provide your logic</strong> to make that conclusion. For e.g. you may say that since
                      scenario has x and y characteristic, model A and B would be potential candidate. Additionally,
                      since scenario has characteristic z, model A would be best option.
                    </li>
                  </ul>
                )}
              </div>

              {/* Text Editor Toolbar */}
              <div className='rounded-lg border border-gray-300'>
                <div className='flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 p-2'>
                  <button className='rounded p-2 hover:bg-gray-200' title='Bold'>
                    <Bold className='h-4 w-4' />
                  </button>
                  <button className='rounded p-2 hover:bg-gray-200' title='Italic'>
                    <Italic className='h-4 w-4' />
                  </button>
                  <button className='rounded p-2 hover:bg-gray-200' title='Strikethrough'>
                    <Strikethrough className='h-4 w-4' />
                  </button>

                  <div className='mx-1 h-6 w-px bg-gray-300' />

                  <button className='rounded p-2 hover:bg-gray-200' title='Insert link'>
                    <Link className='h-4 w-4' />
                  </button>
                  <button className='rounded p-2 hover:bg-gray-200' title='Remove link'>
                    <Link2Off className='h-4 w-4' />
                  </button>

                  <div className='mx-1 h-6 w-px bg-gray-300' />

                  <button className='rounded p-2 hover:bg-gray-200' title='Bullet list'>
                    <List className='h-4 w-4' />
                  </button>
                  <button className='rounded p-2 hover:bg-gray-200' title='Numbered list'>
                    <ListOrdered className='h-4 w-4' />
                  </button>

                  <div className='mx-1 h-6 w-px bg-gray-300' />

                  <button className='rounded p-2 hover:bg-gray-200' title='Insert image'>
                    <Image className='h-4 w-4' />
                  </button>

                  <div className='mx-1 h-6 w-px bg-gray-300' />

                  <button className='rounded p-2 hover:bg-gray-200' title='Code'>
                    <Code className='h-4 w-4' />
                  </button>
                  <button className='rounded p-2 hover:bg-gray-200' title='Superscript'>
                    <Superscript className='h-4 w-4' />
                  </button>

                  <div className='mx-1 h-6 w-px bg-gray-300' />

                  <button className='rounded p-2 hover:bg-gray-200' title='Align left'>
                    <AlignLeft className='h-4 w-4' />
                  </button>
                  <button className='rounded p-2 hover:bg-gray-200' title='Align right'>
                    <AlignRight className='h-4 w-4' />
                  </button>
                </div>

                {/* Text Area */}
                <Textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder='Based on incremental and iterative development, adaptability to changing requirements, Agile Methodology is the'
                  className='min-h-[200px] rounded-none rounded-b-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </div>
            </div>
          ))}

          {/* Submit Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button variant='outline' className='border-gray-300 text-gray-700 hover:bg-gray-50'>
              Save as draft
            </Button>
            <Button onClick={handleSubmit} className='bg-blue-600 text-white hover:bg-blue-700'>
              Submit assignment
            </Button>
          </div>
        </div>
      )}

      {/* Instructions Tab */}
      {activeTab === 'instructions' && (
        <div className='prose max-w-none'>
          <p>View assignment instructions here...</p>
        </div>
      )}

      {/* Discussions Tab */}
      {activeTab === 'discussions' && (
        <div className='prose max-w-none'>
          <p>View and participate in discussions here...</p>
        </div>
      )}
    </div>
  )
}

// Example usage with mock data
export function AssignmentSubmissionFormDemo() {
  const mockAssignment: Assignment = {
    id: 1,
    contentId: 1,
    totalScore: 100,
    passingScore: 80,
    allowResubmission: 'yes',
    dueDate: '2024-11-24T11:59:00+07:00'
  }

  const mockQuestions: AssignmentQuestion[] = [
    {
      id: 1,
      assignmentId: 1,
      type: AssignmentQuestionType.TEXT,
      prompt: 'What software development methodology would you suggest for this situation and why?',
      orderIndex: 0,
      maxScore: 100
    }
  ]

  const handleSubmit = (data: SubmissionFormData) => {
    console.log('Submission data:', data)
    // Handle submission logic here
  }

  return <AssignmentSubmissionForm assignment={mockAssignment} questions={mockQuestions} onSubmit={handleSubmit} />
}
