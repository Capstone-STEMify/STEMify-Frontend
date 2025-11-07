'use client'
import React, { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Assignment, AssignmentQuestionType } from '@/features/assignment/types/assignment.type'
import { AssignmentSidebar } from '@/features/assignment/components/upsert/UpsertAssignmentSidebar'

export type AssignmentFormData = {
  sectionId: number
  title: string
  passingScore: number
  durationDays: number
  questions: {
    type: AssignmentQuestionType
    orderIndex: number
    points: number
    content: string
    rubricCriterion: {
      criterionName: string
      maxPoints: number
    }[]
  }[]
}

type UpsertAssignmentProps = {
  initialData?: Assignment
}

export default function UpsertAssignment({ initialData }: UpsertAssignmentProps) {
  // const { sectionId } = useParams()
  const sectionId = 1 // Temporary hardcoded value for testing
  const [formData, setFormData] = useState<AssignmentFormData>(
    initialData
      ? {
          sectionId: Number(sectionId),
          title: initialData.title,
          passingScore: initialData.passingScore,
          durationDays: initialData.durationDays,
          questions: initialData.questions.map((q) => ({
            type: q.type,
            orderIndex: q.orderIndex,
            points: q.points,
            content: q.content,
            rubricCriterion: q.rubricCriterion.map((r) => ({
              criterionName: r.criterionName,
              maxPoints: r.maxPoints
            }))
          }))
        }
      : {
          sectionId,
          title: '',
          passingScore: 80,
          durationDays: 3,
          questions: [
            {
              type: AssignmentQuestionType.TEXT,
              orderIndex: 1,
              points: 50,
              content: '',
              rubricCriterion: []
            }
          ]
        }
  )

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }))
  }

  const handlePassingScoreChange = (value: string) => {
    const score = parseInt(value) || 0
    setFormData((prev) => ({ ...prev, passingScore: score }))
  }

  const handleDurationDaysChange = (value: string) => {
    const days = parseInt(value) || 0
    setFormData((prev) => ({ ...prev, durationDays: days }))
  }

  const addQuestion = () => {
    const newQuestion = {
      type: AssignmentQuestionType.TEXT,
      orderIndex: formData.questions.length + 1,
      points: 50,
      content: '',
      rubricCriterion: []
    }
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, orderIndex: i + 1 }))
    }))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    }))
  }

  const addRubricCriterion = (questionIndex: number) => {
    const newCriterion = {
      criterionName: '',
      maxPoints: 1
    }
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex ? { ...q, rubricCriterion: [...q.rubricCriterion, newCriterion] } : q
      )
    }))
  }

  const removeRubricCriterion = (questionIndex: number, criterionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              rubricCriterion: q.rubricCriterion.filter((_, ci) => ci !== criterionIndex)
            }
          : q
      )
    }))
  }

  const updateRubricCriterion = (questionIndex: number, criterionIndex: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              rubricCriterion: q.rubricCriterion.map((c, ci) => (ci === criterionIndex ? { ...c, [field]: value } : c))
            }
          : q
      )
    }))
  }

  const calculateTotalScore = () => {
    return formData.questions.reduce((sum, q) => sum + q.points, 0)
  }

  const calculateTotalCriteria = () => {
    return formData.questions.reduce((sum, q) => sum + q.rubricCriterion.length, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSaveDraft = () => {}

  const handlePreview = () => {}

  const totalScore = calculateTotalScore()
  const totalCriteria = calculateTotalCriteria()

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl p-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Main Content - Left Side */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Header */}
            <div>
              <h1 className='text-3xl font-semibold'>{initialData ? 'Edit Assignment' : 'Create Assignment'}</h1>
              <p className='mt-1 text-gray-600'>
                Create and configure your assignment with questions and rubric criteria
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Information */}
              <Card>
                <CardHeader className='py-4'>
                  <CardTitle>Assignment Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>
                      Assignment Title <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder='Enter assignment title'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='passingScore'>
                        Passing Score (%) <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='passingScore'
                        type='number'
                        min='0'
                        max='100'
                        value={formData.passingScore}
                        onChange={(e) => handlePassingScoreChange(e.target.value)}
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='durationDays'>
                        Duration (Days) <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='durationDays'
                        type='number'
                        min='1'
                        value={formData.durationDays}
                        onChange={(e) => handleDurationDaysChange(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-semibold'>Questions</h2>
                  <Button type='button' onClick={addQuestion} variant='outline' className='gap-2'>
                    <Plus className='h-4 w-4' />
                    Add Question
                  </Button>
                </div>

                {formData.questions.map((question, questionIndex) => (
                  <Card key={questionIndex} className='relative'>
                    <CardHeader className='py-4'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex flex-1 items-center gap-2'>
                          <GripVertical className='h-5 w-5 text-gray-400' />
                          <CardTitle className='text-lg'>Question {question.orderIndex}</CardTitle>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeQuestion(questionIndex)}
                          className='text-red-600 hover:bg-red-50 hover:text-red-700'
                          disabled={formData.questions.length === 1}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4 py-4'>
                      {/* Question Type and Points */}
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor={`question-type-${questionIndex}`}>
                            Question Type <span className='text-red-500'>*</span>
                          </Label>
                          <Select
                            value={question.type}
                            onValueChange={(value: AssignmentQuestionType) =>
                              updateQuestion(questionIndex, 'type', value)
                            }
                          >
                            <SelectTrigger id={`question-type-${questionIndex}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={AssignmentQuestionType.TEXT}>Text</SelectItem>
                              <SelectItem value={AssignmentQuestionType.FILE}>File</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor={`question-points-${questionIndex}`}>
                            Points <span className='text-red-500'>*</span>
                          </Label>
                          <Input
                            id={`question-points-${questionIndex}`}
                            type='number'
                            min='1'
                            value={question.points}
                            onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 0)}
                            required
                          />
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className='space-y-2'>
                        <Label htmlFor={`question-content-${questionIndex}`}>
                          Question Content <span className='text-red-500'>*</span>
                        </Label>
                        <Textarea
                          id={`question-content-${questionIndex}`}
                          value={question.content}
                          onChange={(e) => updateQuestion(questionIndex, 'content', e.target.value)}
                          placeholder='Enter question content'
                          rows={4}
                          required
                        />
                      </div>

                      {/* Rubric Criteria */}
                      <div className='space-y-3 border-t pt-4'>
                        <div className='flex items-center justify-between'>
                          <Label className='text-base font-semibold'>Rubric Criteria</Label>
                          <Button
                            type='button'
                            onClick={() => addRubricCriterion(questionIndex)}
                            variant='outline'
                            size='sm'
                            className='gap-2'
                          >
                            <Plus className='h-3 w-3' />
                            Add Criterion
                          </Button>
                        </div>

                        {question.rubricCriterion.length === 0 && (
                          <p className='text-sm text-gray-500 italic'>
                            No rubric criteria added yet. Click "Add Criterion" to get started.
                          </p>
                        )}

                        {question.rubricCriterion.map((criterion, criterionIndex) => (
                          <div
                            key={criterionIndex}
                            className='flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3'
                          >
                            <div className='grid flex-1 grid-cols-1 gap-3 md:grid-cols-3'>
                              <div className='space-y-1 md:col-span-2'>
                                <Label
                                  htmlFor={`criterion-name-${questionIndex}-${criterionIndex}`}
                                  className='text-xs'
                                >
                                  Criterion Name
                                </Label>
                                <Input
                                  id={`criterion-name-${questionIndex}-${criterionIndex}`}
                                  value={criterion.criterionName}
                                  onChange={(e) =>
                                    updateRubricCriterion(
                                      questionIndex,
                                      criterionIndex,
                                      'criterionName',
                                      e.target.value
                                    )
                                  }
                                  placeholder='e.g., Criteria 1'
                                  required
                                />
                              </div>
                              <div className='space-y-1'>
                                <Label
                                  htmlFor={`criterion-points-${questionIndex}-${criterionIndex}`}
                                  className='text-xs'
                                >
                                  Max Points
                                </Label>
                                <Input
                                  id={`criterion-points-${questionIndex}-${criterionIndex}`}
                                  type='number'
                                  min='1'
                                  value={criterion.maxPoints}
                                  onChange={(e) =>
                                    updateRubricCriterion(
                                      questionIndex,
                                      criterionIndex,
                                      'maxPoints',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => removeRubricCriterion(questionIndex, criterionIndex)}
                              className='mt-6 text-red-600 hover:bg-red-100 hover:text-red-700'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Form Actions */}
              <div className='flex justify-end gap-3 border-t pt-4'>
                <Button type='button' variant='outline' onClick={() => {}}>
                  Cancel
                </Button>
                <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
                  {initialData ? 'Update Assignment' : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar - Right Side */}
          <div className='lg:col-span-1'>
            <AssignmentSidebar
              totalScore={totalScore}
              totalQuestions={formData.questions.length}
              totalCriteria={totalCriteria}
              passingScore={formData.passingScore}
              durationDays={formData.durationDays}
              onSaveDraft={handleSaveDraft}
              onPreview={handlePreview}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
