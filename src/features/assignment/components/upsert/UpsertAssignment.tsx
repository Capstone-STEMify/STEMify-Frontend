// app/assignments/[id]/page.tsx (hoặc pages/assignments/[id].tsx)
'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Textarea } from '@/components/shadcn/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { Assignment, AssignmentQuestion, AssignmentQuestionType } from '@/features/assignment/types/assignment.type'

export default function UpsertAssignmentPage() {
  const [assignment, setAssignment] = useState<Partial<Assignment>>({
    contentId: 0,
    totalScore: 0,
    passingScore: 0,
    allowResubmission: 'false',
    dueDate: ''
  })

  const [questions, setQuestions] = useState<Partial<AssignmentQuestion>[]>([])
  const [activeTab, setActiveTab] = useState<'info' | 'questions'>('info')

  const handleAssignmentChange = (field: keyof Assignment, value: any) => {
    setAssignment((prev) => ({ ...prev, [field]: value }))
  }

  const addQuestion = () => {
    const newQuestion: Partial<AssignmentQuestion> = {
      id: Date.now(),
      type: AssignmentQuestionType.TEXT,
      prompt: '',
      orderIndex: questions.length,
      maxScore: 0
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof AssignmentQuestion, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const deleteQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index)
    // Reorder
    updated.forEach((q, i) => (q.orderIndex = i))
    setQuestions(updated)
  }

  const calculateTotalScore = () => {
    return questions.reduce((sum, q) => sum + (q.maxScore || 0), 0)
  }

  const handleSave = () => {
    const finalAssignment = {
      ...assignment,
      totalScore: calculateTotalScore()
    }
    console.log('Saving assignment:', finalAssignment)
    console.log('Questions:', questions)
    // TODO: API call to save
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside className='w-64 border-r border-gray-200 bg-white p-6'>
        <h2 className='mb-6 text-xl font-bold'>Assignment Setup</h2>

        <nav className='space-y-2'>
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
              activeTab === 'info' ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Basic Information
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
              activeTab === 'questions' ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Questions ({questions.length})
          </button>
        </nav>

        <div className='mt-8 border-t border-gray-200 pt-6'>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Score:</span>
              <span className='font-semibold'>{calculateTotalScore()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Passing Score:</span>
              <span className='font-semibold'>{assignment.passingScore || 0}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Questions:</span>
              <span className='font-semibold'>{questions.length}</span>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className='mt-6 w-full' size='lg'>
          <Save className='mr-2 h-4 w-4' />
          Save Assignment
        </Button>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        <div className='mx-auto max-w-4xl p-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>
              {assignment.id ? 'Edit Assignment' : 'Create Assignment'}
            </h1>
            <p className='mt-2 text-gray-600'>
              {activeTab === 'info' ? 'Set up basic assignment information' : 'Add and configure assignment questions'}
            </p>
          </div>

          {/* Basic Information Tab */}
          {activeTab === 'info' && (
            <Card className='py-4'>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='contentId'>Content ID</Label>
                    <Input
                      id='contentId'
                      type='number'
                      value={assignment.contentId || ''}
                      onChange={(e) => handleAssignmentChange('contentId', Number(e.target.value))}
                      placeholder='Enter content ID'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='dueDate'>Due Date</Label>
                    <Input
                      id='dueDate'
                      type='datetime-local'
                      value={assignment.dueDate || ''}
                      onChange={(e) => handleAssignmentChange('dueDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='totalScore'>Total Score</Label>
                    <Input
                      id='totalScore'
                      type='number'
                      value={calculateTotalScore()}
                      disabled
                      className='bg-gray-50'
                    />
                    <p className='text-xs text-gray-500'>Auto-calculated from questions</p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='passingScore'>Passing Score</Label>
                    <Input
                      id='passingScore'
                      type='number'
                      value={assignment.passingScore || ''}
                      onChange={(e) => handleAssignmentChange('passingScore', Number(e.target.value))}
                      placeholder='Enter passing score'
                    />
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='allowResubmission'
                    checked={assignment.allowResubmission === 'true'}
                    onCheckedChange={(checked) =>
                      handleAssignmentChange('allowResubmission', checked ? 'true' : 'false')
                    }
                  />
                  <Label htmlFor='allowResubmission' className='cursor-pointer'>
                    Allow students to resubmit their work
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className='space-y-4'>
              {questions.map((question, index) => (
                <Card key={question.id || index}>
                  <CardContent className='pt-6'>
                    <div className='flex items-start gap-4'>
                      <div className='mt-2 cursor-move'>
                        <GripVertical className='h-5 w-5 text-gray-400' />
                      </div>

                      <div className='flex-1 space-y-4'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-semibold text-gray-700'>Question {index + 1}</span>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => deleteQuestion(index)}
                            className='text-red-600 hover:bg-red-50 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label>Question Type</Label>
                            <Select
                              value={question.type}
                              onValueChange={(value) => updateQuestion(index, 'type', value as AssignmentQuestionType)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={AssignmentQuestionType.TEXT}>Text Response</SelectItem>
                                <SelectItem value={AssignmentQuestionType.FILE}>File Upload</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <Label>Max Score</Label>
                            <Input
                              type='number'
                              value={question.maxScore || ''}
                              onChange={(e) => updateQuestion(index, 'maxScore', Number(e.target.value))}
                              placeholder='0'
                            />
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label>Question Prompt</Label>
                          <Textarea
                            value={question.prompt || ''}
                            onChange={(e) => updateQuestion(index, 'prompt', e.target.value)}
                            placeholder='Enter your question here...'
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addQuestion} variant='outline' className='h-20 w-full border-2 border-dashed'>
                <Plus className='mr-2 h-5 w-5' />
                Add New Question
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
