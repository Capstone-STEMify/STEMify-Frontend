'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { Assignment, AssignmentQuestionType, CreateAssignmentDto } from '@/features/assignment/types/assignment.type'
import { AssignmentSidebar } from '@/features/assignment/components/upsert/UpsertAssignmentSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  useCreateAssignmentMutation,
  useGetAssignmentByIdQuery,
  useUpdateAssignmentMutation
} from '@/features/assignment/api/assignmentApi'
import { useParams } from 'next/navigation'

const defaultFormValues: CreateAssignmentDto = {
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
  onSuccess?: () => void
}

export default function UpsertAssignment({ onSuccess }: UpsertAssignmentProps) {
  const { sectionId, assignmentId } = useParams()
  const isEditing = !!assignmentId

  // ✅ Schema validation for entire form including questions
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

  const { data: assignmentData, isLoading } = useGetAssignmentByIdQuery(Number(assignmentId), { skip: !isEditing })
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation()
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation()

  // ✅ Prepare initial values based on whether editing or creating
  const getInitialValues = (): CreateAssignmentDto => {
    if (isEditing && assignmentData?.data) {
      const a = assignmentData.data
      return {
        sectionId: Number(sectionId),
        title: a.title,
        passingScore: a.passingScore,
        durationDays: a.durationDays,
        questions: a.questions.map((q) => ({
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
    }
    return { ...defaultFormValues, sectionId: Number(sectionId) }
  }

  // ✅ Wait for data to load before rendering form
  if (isEditing && isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
          <p className='mt-4 text-gray-600'>Loading assignment...</p>
        </div>
      </div>
    )
  }

  return (
    <AssignmentForm
      initialValues={getInitialValues()}
      isEditing={isEditing}
      assignmentId={Number(assignmentId)}
      sectionId={Number(sectionId)}
      onSuccess={onSuccess}
      assignmentSchema={assignmentSchema}
    />
  )
}

// ✅ Separate component to ensure form gets correct initial values
type AssignmentFormProps = {
  initialValues: CreateAssignmentDto
  isEditing: boolean
  assignmentId: number
  sectionId: number
  onSuccess?: () => void
  assignmentSchema: any
}

function AssignmentForm({
  initialValues,
  isEditing,
  assignmentId,
  sectionId,
  onSuccess,
  assignmentSchema
}: AssignmentFormProps) {
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation()
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation()

  const [questions, setQuestions] = useState(initialValues.questions)

  // ✅ Form with correct initial values
  const form = useAppForm({
    defaultValues: initialValues,
    // validators: { onChange: assignmentSchema as any },
    onSubmit: async ({ value }) => {
      try {
        const payload: CreateAssignmentDto = { ...value, sectionId }

        await createAssignment(payload).unwrap()

        // if (isEditing) {
        //   await updateAssignment({ id: assignmentId, body: payload }).unwrap()
        // } else {
        //   await createAssignment(payload).unwrap()
        // }

        toast.success(`Assignment ${isEditing ? 'updated' : 'created'} successfully`)
        onSuccess?.()
      } catch (error) {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} assignment`)
      }
    }
  })

  React.useEffect(() => {
    form.setFieldValue('questions', questions)
  }, [questions])

  // ✅ Helper functions using form state
  const addQuestion = () => {
    const newQuestion = {
      type: AssignmentQuestionType.TEXT,
      orderIndex: questions.length + 1,
      points: 50,
      content: '',
      rubricCriterion: []
    }
    setQuestions([...questions, newQuestion])
    console.log('Added question, new length:', questions.length + 1)
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error('At least one question is required')
      return
    }

    const filteredQuestions = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, orderIndex: i + 1 }))

    setQuestions(filteredQuestions)
    console.log('Removed question at index:', index, 'new length:', filteredQuestions.length)
  }

  const addRubricCriterion = (questionIndex: number) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          rubricCriterion: [
            ...q.rubricCriterion,
            {
              criterionName: '',
              maxPoints: 1
            }
          ]
        }
      }
      return q
    })

    setQuestions(updatedQuestions)
    console.log('Added criterion to question:', questionIndex)
  }

  const removeRubricCriterion = (questionIndex: number, criterionIndex: number) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          rubricCriterion: q.rubricCriterion.filter((_, ci) => ci !== criterionIndex)
        }
      }
      return q
    })

    setQuestions(updatedQuestions)
    console.log('Removed criterion:', criterionIndex, 'from question:', questionIndex)
  }

  const calculateTotalScore = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0)
  }

  const calculateTotalCriteria = () => {
    return questions.reduce((sum, q) => sum + q.rubricCriterion.length, 0)
  }

  // ✅ Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.orderIndex === active.id)
      const newIndex = questions.findIndex((q) => q.orderIndex === over.id)

      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex).map((q, i) => ({
        ...q,
        orderIndex: i + 1
      }))

      setQuestions(reorderedQuestions)
      toast.success('Questions reordered successfully')
    }
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-6xl p-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='space-y-6 lg:col-span-2'>
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
                  {questions.map((question, questionIndex) => (
                    <Card key={`question-${questionIndex}`}>
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
                            children={(field) => (
                              <field.TextField type='number' label='Points' placeholder='e.g. 50' min={1} />
                            )}
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
                                      <field.TextField type='number' label='Max Points' placeholder='e.g. 2' min={1} />
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

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <AssignmentSidebar
                questions={questions}
                totalScore={totalScore}
                totalQuestions={questions.length}
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
    </DndContext>
  )
}
