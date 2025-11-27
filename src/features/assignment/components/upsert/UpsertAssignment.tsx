'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { useAppForm } from '@/components/shared/form/items'
import { AssignmentQuestionType, CreateAssignmentDto } from '@/features/assignment/types/assignment.type'
import { AssignmentSidebar } from '@/features/assignment/components/upsert/UpsertAssignmentSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { Plus, Sparkles, Trash2 } from 'lucide-react'
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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  useCreateAssignmentMutation,
  useGetAssignmentByIdQuery,
  useUpdateAssignmentMutation
} from '@/features/assignment/api/assignmentApi'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '@/components/shared/button/BackButton'
import { useStore } from '@tanstack/react-store'
import { useLocale, useTranslations } from 'next-intl'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { use } from 'matter'
import { useModal } from '@/providers/ModalProvider'

const defaultFormValues: CreateAssignmentDto = {
  sectionId: 1,
  title: '',
  passingScore: 80,
  cooldownHours: 1,
  durationDays: 3,
  questions: [
    {
      type: AssignmentQuestionType.TEXT,
      orderIndex: 1,
      points: 5,
      content: '',
      rubricCriterion: []
    }
  ]
}

type UpsertAssignmentProps = {
  onSuccess?: () => void
}

export default function UpsertAssignment({ onSuccess }: UpsertAssignmentProps) {
  const ta = useTranslations('assignment')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const { openModal } = useModal()

  const { lessonId, sectionId, assignmentId } = useParams()
  const isEditing = !!assignmentId
  const router = useRouter()
  const locale = useLocale()

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
        cooldownHours: a.cooldownHours,
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

  const form = useAppForm({
    defaultValues: getInitialValues(),
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          if (!assignmentData?.data?.contentId) {
            toast.error('Assignment content ID is missing')
            return
          }
          const updatePayload = {
            ...value,
            sectionId: Number(sectionId),
            contentId: assignmentData.data.contentId
          }
          toast.info('Update functionality coming soon')
          // await updateAssignment({ id: Number(assignmentId), body: updatePayload }).unwrap()
        } else {
          const payload: CreateAssignmentDto = { ...value, sectionId: Number(sectionId) }
          const res = await createAssignment(payload).unwrap()
          router.push(`/${locale}/admin/lesson/${lessonId}/section/${sectionId}/assignment/${res.data.id}`)
          toast.success(`Assignment created successfully`)
        }

        onSuccess?.()
      } catch (error) {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} assignment`)
      }
    }
  })

  const questions = useStore(form.store, (state) => state.values.questions)
  const passingScore = useStore(form.store, (state) => state.values.passingScore)
  const durationDays = useStore(form.store, (state) => state.values.durationDays)
  const cooldownHours = useStore(form.store, (state) => state.values.cooldownHours)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const totalScore = questions.reduce(
    (sum, q) => sum + q.rubricCriterion.reduce((acc, curr) => acc + (curr.maxPoints || 0), 0),
    0
  )

  const totalCriteria = questions.reduce((sum, q) => sum + q.rubricCriterion.length, 0)

  if (isEditing && isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <LoadingComponent />
      </div>
    )
  }

  // ✅ Helper functions using form state directly
  const addQuestion = () => {
    const currentQuestions = form.state.values.questions
    const newQuestion = {
      type: AssignmentQuestionType.TEXT,
      orderIndex: currentQuestions.length + 1,
      points: 5,
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

    const filteredQuestions = currentQuestions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, orderIndex: i + 1 }))

    form.setFieldValue('questions', filteredQuestions)
    console.log('Removed question at index:', index, 'new length:', filteredQuestions.length)
  }

  const addRubricCriterion = (questionIndex: number) => {
    const currentQuestions = form.state.values.questions
    const updatedQuestions = currentQuestions.map((q, i) => {
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

    form.setFieldValue('questions', updatedQuestions)
  }

  const removeRubricCriterion = (questionIndex: number, criterionIndex: number) => {
    const currentQuestions = form.state.values.questions
    const updatedQuestions = currentQuestions.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          rubricCriterion: q.rubricCriterion.filter((_, ci) => ci !== criterionIndex)
        }
      }
      return q
    })

    form.setFieldValue('questions', updatedQuestions)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const currentQuestions = form.state.values.questions
      const oldIndex = currentQuestions.findIndex((q) => q.orderIndex === active.id)
      const newIndex = currentQuestions.findIndex((q) => q.orderIndex === over.id)

      const reorderedQuestions = arrayMove(currentQuestions, oldIndex, newIndex).map((q, i) => ({
        ...q,
        orderIndex: i + 1
      }))

      form.setFieldValue('questions', reorderedQuestions)
      toast.success(tt('successMessage.reorder'))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-6xl p-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='space-y-6 lg:col-span-2'>
              <div>
                <div className='flex gap-4'>
                  <BackButton />
                  <div className='flex gap-5'>
                    <h1 className='font-semibold'>{isEditing ? ta('upsert.update') : ta('upsert.create')}</h1>
                    <button
                      className='text-blue-500 hover:cursor-pointer'
                      onClick={() => openModal('importAssignment')}
                    >
                      <Sparkles />
                    </button>
                  </div>
                </div>
                <p className='mt-1 text-gray-600'>
                  {isEditing ? ta('upsert.updateDescription') : ta('upsert.createDescription')}
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
                  <CardContent className='space-y-4 py-4'>
                    <form.AppField
                      name='title'
                      children={(field) => (
                        <field.TextField label={ta('upsert.title')} placeholder={ta('upsert.titlePlaceholder')} />
                      )}
                    />

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <form.AppField
                        name='passingScore'
                        children={(field) => (
                          <field.TextField
                            type='number'
                            label={ta('upsert.passingScore')}
                            placeholder='e.g. 80'
                            min={0}
                            max={100}
                          />
                        )}
                      />

                      <form.AppField
                        name='durationDays'
                        children={(field) => (
                          <field.TextField
                            type='number'
                            label={ta('upsert.durationDays')}
                            placeholder='e.g. 3'
                            min={1}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Questions */}
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-semibold'>{ta('upsert.question.question')}</h2>
                    <Button type='button' onClick={addQuestion} variant='outline' className='gap-2'>
                      <Plus className='h-4 w-4' />
                      {tc('button.addQuestion')}
                    </Button>
                  </div>
                  {questions.map((question, questionIndex) => (
                    <Card key={`question-${questionIndex}`}>
                      <CardHeader className='pt-4'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex flex-1 items-center gap-2'>
                            <CardTitle className='text-lg'>
                              {ta('upsert.question.question')} {question.orderIndex}
                            </CardTitle>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => removeQuestion(questionIndex)}
                            className='text-red-600 hover:bg-red-50 hover:text-red-700'
                            disabled={questions.length === 1}
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
                              {ta('upsert.question.questionType')} <span className='text-red-500'>*</span>
                            </Label>
                            <form.AppField name={`questions[${questionIndex}].type`}>
                              {(field) => (
                                <Select
                                  value={field.state.value ?? AssignmentQuestionType.TEXT}
                                  onValueChange={(value: AssignmentQuestionType) => field.handleChange(value)}
                                >
                                  <SelectTrigger id={`question-type-${questionIndex}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={AssignmentQuestionType.TEXT}>
                                      {ta('upsert.question.text')}
                                    </SelectItem>
                                    <SelectItem value={AssignmentQuestionType.FILE}>File</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </form.AppField>
                          </div>
                        </div>

                        {/* Question Content */}
                        <form.AppField
                          name={`questions[${questionIndex}].content`}
                          children={(field) => (
                            <field.TextAreaField
                              label={ta('upsert.question.content')}
                              placeholder={ta('upsert.question.contentPlaceholder')}
                              rows={4}
                              className='resize-none'
                            />
                          )}
                        />

                        {/* Rubric Criteria */}
                        <div className='space-y-3 border-t pt-4'>
                          <div className='flex items-center justify-between'>
                            <Label className='text-base font-semibold'>{ta('upsert.question.rubric.rubric')}</Label>
                            <Button
                              type='button'
                              onClick={() => addRubricCriterion(questionIndex)}
                              variant='outline'
                              size='sm'
                              className='gap-2'
                            >
                              <Plus className='h-3 w-3' />
                              {tc('button.addCriterion')}
                            </Button>
                          </div>

                          {question.rubricCriterion.length === 0 && (
                            <p className='text-sm text-gray-500 italic'>{ta('upsert.question.rubric.noData')}</p>
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
                                      <field.TextField
                                        label={ta('upsert.question.rubric.criterionName')}
                                        placeholder='e.g., Criteria 1'
                                      />
                                    )}
                                  />
                                </div>
                                <div>
                                  <form.AppField
                                    name={`questions[${questionIndex}].rubricCriterion[${criterionIndex}].maxPoints`}
                                    children={(field) => (
                                      <field.TextField
                                        type='number'
                                        label={ta('upsert.question.rubric.maxPoints')}
                                        placeholder='e.g. 2'
                                        min={1}
                                      />
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
                    {tc('button.cancel')}
                  </Button>
                  <form.AppForm>
                    <form.SubmitButton loading={isCreating || isUpdating} className='cursor-pointer bg-blue-600'>
                      {isEditing ? tc('button.update') : tc('button.create')}
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
                passingScore={passingScore}
                durationDays={durationDays}
              />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}
