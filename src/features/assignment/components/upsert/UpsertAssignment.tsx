'use client'

import React, { useEffect } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { Assignment, AssignmentQuestionType } from '@/features/assignment/types/assignment.type'
import { AssignmentSidebar } from '@/features/assignment/components/upsert/UpsertAssignmentSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
// import { useCreateAssignmentMutation, useGetAssignmentByIdQuery, useUpdateAssignmentMutation } from '@/features/assignment/api/assignmentApi'
// import { useModal } from '@/providers/ModalProvider'

type AssignmentFormData = {
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

const defaultAssignmentFormData: AssignmentFormData = {
  sectionId: 1,
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

type UpsertAssignmentProps = {
  assignmentId?: number
  sectionId?: number
  onSuccess?: () => void
}

export default function UpsertAssignment({ assignmentId, sectionId = 1, onSuccess }: UpsertAssignmentProps) {
  const isEditing = !!assignmentId
  // const { closeModal } = useModal()

  // ✅ Schema validation
  const assignmentSchema = z.object({
    sectionId: z.number(),
    title: z.string().min(1, 'Assignment title is required'),
    passingScore: z.number().min(0, 'Must be at least 0').max(100, 'Must be at most 100'),
    durationDays: z.number().min(1, 'Must be at least 1 day'),
    questions: z
      .array(
        z.object({
          type: z.nativeEnum(AssignmentQuestionType),
          orderIndex: z.number(),
          points: z.number().min(1, 'Points must be at least 1'),
          content: z.string().min(1, 'Question content is required'),
          rubricCriterion: z.array(
            z.object({
              criterionName: z.string().min(1, 'Criterion name is required'),
              maxPoints: z.number().min(1, 'Max points must be at least 1')
            })
          )
        })
      )
      .min(1, 'At least one question is required')
  })

  // const { data: assignmentData } = useGetAssignmentByIdQuery(assignmentId!, { skip: !isEditing })
  // const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation()
  // const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation()

  // Mock loading states for demo
  const isCreating = false
  const isUpdating = false

  const form = useAppForm({
    defaultValues: { ...defaultAssignmentFormData, sectionId },
    validators: { onChange: assignmentSchema as any },
    onSubmit: async ({ value }) => {
      try {
        // if (isEditing) {
        //   await updateAssignment({ id: assignmentId!, body: value }).unwrap()
        // } else {
        //   await createAssignment(value).unwrap()
        // }

        console.log('Assignment data:', JSON.stringify(value, null, 2))
        toast.success(`Assignment ${isEditing ? 'updated' : 'created'} successfully`)
        // closeModal()
        onSuccess?.()
      } catch (error) {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} assignment`)
      }
    }
  })

  // Load existing data for editing
  // useEffect(() => {
  //   if (isEditing && assignmentData?.data) {
  //     const a = assignmentData.data
  //     form.reset({
  //       sectionId: a.contentId,
  //       title: a.title,
  //       passingScore: a.passingScore,
  //       durationDays: a.durationDays,
  //       questions: a.questions.map((q) => ({
  //         type: q.type,
  //         orderIndex: q.orderIndex,
  //         points: q.points,
  //         content: q.content,
  //         rubricCriterion: q.rubricCriterion.map((r) => ({
  //           criterionName: r.criterionName,
  //           maxPoints: r.maxPoints
  //         }))
  //       }))
  //     })
  //   }
  // }, [assignmentData, isEditing, form])

  // Helper functions
  const addQuestion = () => {
    const currentQuestions = form.state.values.questions
    const newQuestion = {
      type: AssignmentQuestionType.TEXT,
      orderIndex: currentQuestions.length + 1,
      points: 50,
      content: '',
      rubricCriterion: []
    }
    form.setFieldValue('questions', [...currentQuestions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    const currentQuestions = form.state.values.questions
    if (currentQuestions.length === 1) {
      toast.error('At least one question is required')
      return
    }
    const updatedQuestions = currentQuestions.filter((_, i) => i !== index).map((q, i) => ({ ...q, orderIndex: i + 1 }))
    form.setFieldValue('questions', updatedQuestions)
  }

  const addRubricCriterion = (questionIndex: number) => {
    const currentQuestions = form.state.values.questions
    const updatedQuestions = currentQuestions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            rubricCriterion: [
              ...q.rubricCriterion,
              {
                criterionName: '',
                maxPoints: 1
              }
            ]
          }
        : q
    )
    form.setFieldValue('questions', updatedQuestions)
  }

  const removeRubricCriterion = (questionIndex: number, criterionIndex: number) => {
    const currentQuestions = form.state.values.questions
    const updatedQuestions = currentQuestions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            rubricCriterion: q.rubricCriterion.filter((_, ci) => ci !== criterionIndex)
          }
        : q
    )
    form.setFieldValue('questions', updatedQuestions)
  }

  const calculateTotalScore = () => {
    return form.state.values.questions.reduce((sum, q) => sum + q.points, 0)
  }

  const calculateTotalCriteria = () => {
    return form.state.values.questions.reduce((sum, q) => sum + q.rubricCriterion.length, 0)
  }

  const handleSaveDraft = () => {
    toast.info('Save as draft functionality coming soon')
  }

  const handlePreview = () => {
    toast.info('Preview functionality coming soon')
  }

  const totalScore = calculateTotalScore()
  const totalCriteria = calculateTotalCriteria()

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-6xl p-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Main Content - Left Side */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Header */}
            <div>
              <h1 className='text-3xl font-semibold'>{isEditing ? 'Edit Assignment' : 'Create Assignment'}</h1>
              <p className='mt-1 text-gray-600'>
                Create and configure your assignment with questions and rubric criteria
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className='space-y-6'
            >
              {/* Basic Information */}
              <Card>
                <CardHeader className='py-4'>
                  <CardTitle>Assignment Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 py-4'>
                  <form.AppField
                    name='title'
                    children={(field) => (
                      <field.TextField label='Assignment Title' placeholder='Enter assignment title' />
                    )}
                  />

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <form.AppField
                      name='passingScore'
                      children={(field) => (
                        <field.TextField
                          type='number'
                          label='Passing Score (%)'
                          placeholder='e.g. 80'
                          min={0}
                          max={100}
                        />
                      )}
                    />

                    <form.AppField
                      name='durationDays'
                      children={(field) => (
                        <field.TextField type='number' label='Duration (Days)' placeholder='e.g. 3' min={1} />
                      )}
                    />
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

                {form.state.values.questions.map((question, questionIndex) => (
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
                          disabled={form.state.values.questions.length === 1}
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
                          <form.AppField name={`questions[${questionIndex}].type`}>
                            {(field) => (
                              <Select
                                value={field.state.value}
                                onValueChange={(value: AssignmentQuestionType) => field.handleChange(value)}
                              >
                                <SelectTrigger id={`question-type-${questionIndex}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={AssignmentQuestionType.TEXT}>Text</SelectItem>
                                  <SelectItem value={AssignmentQuestionType.FILE}>File</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </form.AppField>
                        </div>

                        <form.AppField
                          name={`questions[${questionIndex}].points`}
                          children={(field) => <field.TextField type='number' label='Points' placeholder='e.g. 50' />}
                        />
                      </div>

                      {/* Question Content */}
                      <form.AppField
                        name={`questions[${questionIndex}].content`}
                        children={(field) => (
                          <field.TextAreaField
                            label='Question Content'
                            placeholder='Enter question content'
                            rows={4}
                            className='resize-none'
                          />
                        )}
                      />

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
                              <div className='md:col-span-2'>
                                <form.AppField
                                  name={`questions[${questionIndex}].rubricCriterion[${criterionIndex}].criterionName`}
                                  children={(field) => (
                                    <field.TextField label='Criterion Name' placeholder='e.g., Criteria 1' />
                                  )}
                                />
                              </div>
                              <div>
                                <form.AppField
                                  name={`questions[${questionIndex}].rubricCriterion[${criterionIndex}].maxPoints`}
                                  children={(field) => (
                                    <field.TextField type='number' label='Max Points' placeholder='e.g. 2' />
                                  )}
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
                <form.AppForm>
                  <form.SubmitButton loading={isCreating || isUpdating} className='cursor-pointer bg-blue-600'>
                    {isEditing ? 'Update' : 'Create'} Assignment
                  </form.SubmitButton>
                </form.AppForm>
              </div>
            </form>
          </div>

          {/* Sidebar - Right Side */}
          <div className='lg:col-span-1'>
            <AssignmentSidebar
              totalScore={totalScore}
              totalQuestions={form.state.values.questions.length}
              totalCriteria={totalCriteria}
              passingScore={form.state.values.passingScore}
              durationDays={form.state.values.durationDays}
              onSaveDraft={handleSaveDraft}
              onPreview={handlePreview}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
