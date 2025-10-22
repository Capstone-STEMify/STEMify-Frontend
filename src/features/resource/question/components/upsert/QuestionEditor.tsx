'use client'

import type React from 'react'

import { useState } from 'react'
import { Trash2, GripVertical } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { Card } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'

interface Answer {
  id: number
  text: string
}

interface Question {
  id: number
  title: string
  type: string
  required: boolean
  answers: Answer[]
  correctAnswer?: number
  correctAnswers?: number[]
}

interface QuestionEditorProps {
  question: Question
  onUpdateQuestion: (updates: any) => void
}

export default function QuestionEditor({ question, onUpdateQuestion }: QuestionEditorProps) {
  const [questionTitle, setQuestionTitle] = useState(question.title)
  const [answers, setAnswers] = useState(question.answers)
  const [draggedAnswer, setDraggedAnswer] = useState<number | null>(null)
  const [newAnswerText, setNewAnswerText] = useState('')

  const handleTitleChange = (newTitle: string) => {
    setQuestionTitle(newTitle)
    onUpdateQuestion({ title: newTitle })
  }

  const handleTypeChange = (newType: string) => {
    onUpdateQuestion({ type: newType })
  }

  const handleRequiredChange = (required: boolean) => {
    onUpdateQuestion({ required })
  }

  const handleAddAnswer = () => {
    if (newAnswerText.trim()) {
      const newAnswer = {
        id: Math.max(...answers.map((a) => a.id), 0) + 1,
        text: newAnswerText
      }
      const updatedAnswers = [...answers, newAnswer]
      setAnswers(updatedAnswers)
      onUpdateQuestion({ answers: updatedAnswers })
      setNewAnswerText('')
    }
  }

  const handleDeleteAnswer = (answerId: number) => {
    const updatedAnswers = answers.filter((a) => a.id !== answerId)
    setAnswers(updatedAnswers)
    onUpdateQuestion({ answers: updatedAnswers })
  }

  const handleReorderAnswers = (fromIndex: number, toIndex: number) => {
    const newAnswers = [...answers]
    const [movedAnswer] = newAnswers.splice(fromIndex, 1)
    newAnswers.splice(toIndex, 0, movedAnswer)
    setAnswers(newAnswers)
    onUpdateQuestion({ answers: newAnswers })
  }

  const handleDragStart = (index: number) => {
    setDraggedAnswer(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (toIndex: number) => {
    if (draggedAnswer !== null && draggedAnswer !== toIndex) {
      handleReorderAnswers(draggedAnswer, toIndex)
    }
    setDraggedAnswer(null)
  }

  const getTypeLabel = () => {
    switch (question.type) {
      case 'single-choice':
        return 'Single Choice'
      case 'multiple-choice':
        return 'Multiple Choice'
      case 'true-false':
        return 'True/False'
      default:
        return 'Multiple Choice'
    }
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6 pt-3'>
      {/* Header with Type Selector */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <select
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className='from-primary to-primary/80 text-primary-foreground focus:ring-primary/50 cursor-pointer rounded-lg border-0 bg-gradient-to-r px-4 py-2 text-sm font-semibold transition-all hover:shadow-lg focus:ring-2 focus:outline-none'
          >
            <option value='single-choice'>Single Choice</option>
            <option value='multiple-choice'>Multiple Choice</option>
            <option value='true-false'>True/False</option>
          </select>

          <div className='border-border ml-4 flex items-center gap-2 border-l pl-4'>
            <span className='text-foreground text-sm font-medium'>Required</span>
            <button
              onClick={() => handleRequiredChange(!question.required)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                question.required ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  question.required ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className='space-y-3 p-5'>
        {/* Question Title */}
        <div>
          <Label className='text-foreground mb-3 block text-sm font-semibold'>Question {question.id}</Label>
          <Input
            type='text'
            value={questionTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className='text-foreground bg-secondary border-border focus:ring-primary w-full rounded-lg border p-4 text-lg font-medium transition-all focus:ring-2 focus:outline-none'
            placeholder='Enter your question here...'
          />
        </div>

        {/* Answers Section */}
        <div className='space-y-4'>
          <label className='text-foreground block text-sm font-semibold'>
            Answers
            <span className='ml-1 text-red-500'>*</span>
          </label>

          {/* Answer Options */}
          <div className='space-y-3'>
            {answers.map((answer, index) => (
              <div
                key={answer.id}
                draggable={question.type !== 'true-false'}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`group bg-secondary hover:bg-secondary/80 flex items-center gap-3 rounded-lg p-4 transition-all ${
                  draggedAnswer === index ? 'bg-secondary/50 opacity-50' : ''
                } ${question.type === 'true-false' ? 'cursor-default' : 'cursor-move'}`}
              >
                {/* Drag Handle */}
                {question.type !== 'true-false' && (
                  <GripVertical className='text-muted-foreground h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
                )}

                {/* Radio/Checkbox */}
                {question.type === 'multiple-choice' ? (
                  <input type='checkbox' className='accent-primary h-5 w-5 cursor-pointer rounded' disabled />
                ) : (
                  <input type='radio' className='accent-primary h-5 w-5 cursor-pointer' disabled />
                )}

                {/* Answer Text */}
                <span className='text-foreground flex-1 font-medium'>{answer.text}</span>

                {/* Action Buttons */}
                {question.type !== 'true-false' && (
                  <div className='flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                    <button
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className='hover:bg-destructive/20 text-destructive rounded-lg p-2 transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Answer Button */}
          {question.type !== 'true-false' && (
            <div className='mt-4 flex gap-2'>
              <input
                type='text'
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAnswer()}
                placeholder='Add new answer...'
                className='bg-secondary border-border text-foreground placeholder-muted-foreground focus:ring-primary flex-1 rounded-lg border px-4 py-2 transition-all focus:ring-2 focus:outline-none'
              />
              <button
                onClick={handleAddAnswer}
                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-all hover:shadow-lg'
              >
                Add
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
