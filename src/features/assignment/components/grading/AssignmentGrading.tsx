'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Label } from '@/components/shadcn/label'
import { CheckCircle2, Share2 } from 'lucide-react'

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

export enum AssignmentSubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded'
}

export type AssignmentSubmission = {
  id: number
  assignmentId: number
  studentId: number
  gradedBy: number
  submittedAt: string
  totalScore: number
  feedback: string
  attemptNumber: number
  status: AssignmentSubmissionStatus
  isPass: boolean
  answers: SubmissionAnswer[]
}

export type SubmissionAnswer = {
  id: number
  submissionId: number
  assignmentQuestionId: number
  answerText: string
  answerFileUrl: string
  feedback: string
  score: number
}

export type RubricCriteria = {
  id: number
  criteria: string
  levels: RubricLevel[]
  earnedScore: number
}

export type RubricLevel = {
  points: number
  description: string
  feedback?: string
}

interface AssignmentGradingPageProps {
  assignment: Assignment
  submission: AssignmentSubmission
  questions: AssignmentQuestion[]
  rubrics: RubricCriteria[]
  projectTitle: string
  title?: string
}

export default function AssignmentGradingPage({
  assignment,
  submission,
  questions,
  rubrics,
  projectTitle,
  title = 'Graded Assignment: Project Scenario 2'
}: AssignmentGradingPageProps) {
  const [activeTab, setActiveTab] = useState<'instructions' | 'submission' | 'discussions'>('submission')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const totalEarned = submission.totalScore
  const totalPossible = assignment.totalScore

  return (
    <div className='mx-auto max-w-5xl space-y-6 p-6'>
      {/* Header */}
      <h1 className='text-4xl font-normal'>{title}</h1>

      {/* Success Message */}
      <Card className='border-l-4 border-l-green-500 bg-green-50'>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <CheckCircle2 className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-600' />
            <div>
              <h3 className='mb-1 font-semibold text-gray-900'>You passed!</h3>
              <p className='text-sm text-gray-700'>
                Congratulations! You earned {totalEarned} / {totalPossible} points. Review the feedback below and
                continue the course when you are ready.
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
                ? 'border-gray-900 font-medium text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'submission'
                ? 'border-gray-900 font-medium text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My submission
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`border-b-2 px-1 pb-3 transition-colors ${
              activeTab === 'discussions'
                ? 'border-gray-900 font-medium text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Discussions
          </button>
        </div>
      </div>

      {/* Submission Content */}
      {activeTab === 'submission' && (
        <div className='space-y-6'>
          {/* Peer Review Notice */}
          <Card className='border-blue-200 bg-blue-50'>
            <CardContent className='p-4'>
              <p className='text-sm text-gray-700'>
                Your fellow learners have submitted their reviews anonymously. All names are still visible to course
                instructors.
              </p>
            </CardContent>
          </Card>

          {/* Project Title and Metadata */}
          <div>
            <h2 className='mb-2 text-3xl font-normal'>{projectTitle}</h2>
            <div className='flex items-center gap-4 text-sm text-gray-600'>
              <span>Submitted on {formatDate(submission.submittedAt)}</span>
              <button className='flex items-center gap-1 text-blue-600 hover:underline'>
                <Share2 className='h-4 w-4' />
                Shareable Link
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Left Column - Prompt */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>PROMPT</h3>

              {questions.map((question) => {
                const answer = submission.answers.find((a) => a.assignmentQuestionId === question.id)

                return (
                  <div key={question.id} className='space-y-4'>
                    <p className='text-gray-900'>{question.prompt}</p>

                    {/* Instructions */}
                    <ul className='ml-6 space-y-3 text-sm text-gray-700'>
                      <li className='list-disc'>
                        Step 1: Start with analyzing the scenario and <strong>identifying characteristics</strong> of
                        this situation and <strong>specify logic</strong> behind the selection of characteristics.
                        Example: You may identify "User Needs Unknown" as a characteristic based on statement x, y and z
                        in the scenario.
                      </li>
                      <li className='list-disc'>
                        Step 2: Map the characteristics to <strong>selection of model</strong> and{' '}
                        <strong>provide your logic</strong> to make that conclusion. For e.g. you may say that since
                        scenario has x and y characteristic, model A and B would be potential candidate. Additionally,
                        since scenario has characteristic z, model A would be best option.
                      </li>
                    </ul>

                    {/* Student Answer */}
                    {answer && (
                      <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                        <h4 className='mb-2 text-sm font-medium text-gray-700'>Your Answer:</h4>
                        <p className='text-sm whitespace-pre-wrap text-gray-900'>{answer.answerText}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right Column - Rubric */}
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold'>RUBRIC</h3>

              {rubrics.map((rubric, index) => (
                <div key={rubric.id} className='space-y-4 border-b border-gray-200 pb-6 last:border-b-0'>
                  <p className='text-sm text-gray-900'>{rubric.criteria}</p>

                  <RadioGroup value={rubric.earnedScore.toString()} disabled>
                    {rubric.levels.map((level) => {
                      const isSelected = level.points === rubric.earnedScore

                      return (
                        <div
                          key={level.points}
                          className={`flex items-start gap-3 rounded-lg border p-3 ${
                            isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <RadioGroupItem
                            value={level.points.toString()}
                            id={`rubric-${rubric.id}-${level.points}`}
                            className='mt-1'
                          />
                          <div className='flex-1'>
                            <Label
                              htmlFor={`rubric-${rubric.id}-${level.points}`}
                              className={`cursor-pointer text-sm ${isSelected ? 'font-medium' : ''}`}
                            >
                              <span className='font-semibold'>{level.points} points</span>
                              <br />
                              {level.description}
                            </Label>
                            {isSelected && level.feedback && (
                              <p className='mt-2 text-xs text-gray-600 italic'>{level.feedback}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              ))}
            </div>
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
export function AssignmentGradingPageDemo() {
  const mockAssignment: Assignment = {
    id: 1,
    contentId: 1,
    totalScore: 19,
    passingScore: 15,
    allowResubmission: 'yes',
    dueDate: '2024-11-24T11:59:00+07:00'
  }

  const mockSubmission: AssignmentSubmission = {
    id: 1,
    assignmentId: 1,
    studentId: 1,
    gradedBy: 1,
    submittedAt: '2024-01-19T00:00:00Z',
    totalScore: 19,
    feedback: '',
    attemptNumber: 1,
    status: AssignmentSubmissionStatus.GRADED,
    isPass: true,
    answers: [
      {
        id: 1,
        submissionId: 1,
        assignmentQuestionId: 1,
        answerText:
          'Based on incremental and iterative development, adaptability to changing requirements, Agile Methodology is the best approach for this situation...',
        answerFileUrl: '',
        feedback: '',
        score: 19
      }
    ]
  }

  const mockQuestions: AssignmentQuestion[] = [
    {
      id: 1,
      assignmentId: 1,
      type: AssignmentQuestionType.TEXT,
      prompt: 'What software development methodology would you suggest for this situation and why?',
      orderIndex: 0,
      maxScore: 19
    }
  ]

  const mockRubrics: RubricCriteria[] = [
    {
      id: 1,
      criteria:
        'Did the learner identify "Vague Requirements" (or something similar) as one of the characteristics and specified the correct logic?',
      earnedScore: 1,
      levels: [
        {
          points: 0,
          description: "Didn't identify this characteristic"
        },
        {
          points: 1,
          description:
            'Identified the characteristics but logic / reference statement to support this characteristic were incorrect. The correct logic / reference statement to support this characteristic is "Also, college leadership wants the website to showcase how the college is evolving to meet student needs."',
          feedback:
            'Identified the characteristics but logic / reference statement to support this characteristic were incorrect.'
        }
      ]
    },
    {
      id: 2,
      criteria:
        'Did the learner identify "User Involvement" as one of the characteristics and specified the correct logic?',
      earnedScore: 2,
      levels: [
        {
          points: 0,
          description: "Didn't identify this characteristic"
        },
        {
          points: 1,
          description:
            'Identified the characteristics but logic / reference statement to support this characteristic were incorrect.'
        },
        {
          points: 2,
          description:
            'Identified the characteristics and provided correct logic / reference statement to support this characteristic.',
          feedback: 'Great job identifying this characteristic with proper supporting logic!'
        }
      ]
    }
  ]

  return (
    <AssignmentGradingPage
      assignment={mockAssignment}
      submission={mockSubmission}
      questions={mockQuestions}
      rubrics={mockRubrics}
      projectTitle='fpt'
    />
  )
}
