import React, { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Check, BookOpen, FileText } from 'lucide-react'

interface ToggleQuestionFn {
  (id: number): void
}

interface Question {
  id: number
  title: string
  options: string[]
  correctAnswer: string
  marks: number
  expanded: boolean
}

type ExpandedQuestions = Record<number, boolean>

type QuestionField = keyof Pick<Question, 'title' | 'correctAnswer' | 'marks'>

interface UpdateOptionFn {
  (questionId: number, optionIndex: number, value: string): void
}

export default function QuizComponent() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'What is Your First Reaction To the Product?',
      options: ['Somewhat Negative', 'Web Designer', 'UI Designer', 'Full Stack Developer'],
      correctAnswer: 'Somewhat Negative',
      marks: 2,
      expanded: true
    }
  ])

  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({ 1: true })

  const toggleQuestion: ToggleQuestionFn = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const addNewQuestion = () => {
    const newId = questions.length + 1
    setQuestions([
      ...questions,
      {
        id: newId,
        title: 'What is most important to work on KDP?',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 'Option 1',
        marks: 2,
        expanded: false
      }
    ])
  }

  const updateQuestion = (id: number, field: QuestionField, value: string | number) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption: UpdateOptionFn = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === optionIndex ? value : opt))
            }
          : q
      )
    )
  }

  return (
    <div className='space-y-4'>
      {questions.map((question, index) => (
        <div key={question.id} className='overflow-hidden rounded-lg border border-gray-200'>
          {/* Question Header */}
          <div
            className='flex cursor-pointer items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-gray-100'
            onClick={() => toggleQuestion(question.id)}
          >
            <div className='flex items-center gap-3'>
              <FileText className='h-5 w-5 text-gray-400' />
              <span className='font-medium text-gray-900'>
                Quiz {index + 1} : {question.title}
              </span>
            </div>
            {expandedQuestions[question.id] ? (
              <ChevronDown className='h-5 w-5 text-gray-400' />
            ) : (
              <ChevronRight className='h-5 w-5 text-gray-400' />
            )}
          </div>

          {/* Question Content */}
          {expandedQuestions[question.id] && (
            <div className='bg-white p-6'>
              <div className='mb-6'>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Question</label>
                <input
                  type='text'
                  value={question.title}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => updateQuestion(question.id, 'title', e.target.value)}
                />
              </div>

              <div className='mb-6'>
                <label className='mb-4 block text-sm font-medium text-gray-700'>Options</label>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className='flex items-center gap-3'>
                      <input
                        type='radio'
                        name={`question-${question.id}`}
                        className='h-4 w-4 text-blue-600'
                        defaultChecked={option === question.correctAnswer}
                        onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                      />
                      <input
                        type='text'
                        value={option}
                        className='flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>Right Answer</label>
                  <div className='flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2'>
                    <Check className='h-4 w-4 text-green-600' />
                    <span className='text-green-800'>{question.correctAnswer}</span>
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>Marks</label>
                  <div className='flex items-center gap-2'>
                    <Check className='h-4 w-4 text-blue-600' />
                    <input
                      type='number'
                      value={question.marks}
                      min='1'
                      max='10'
                      className='w-20 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      onChange={(e) => updateQuestion(question.id, 'marks', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Placeholder Questions */}
      {Array.from({ length: 3 }, (_, i) => (
        <div key={`placeholder-${i}`} className='overflow-hidden rounded-lg border border-gray-200'>
          <div className='flex items-center justify-between bg-gray-50 p-4'>
            <div className='flex items-center gap-3'>
              <FileText className='h-5 w-5 text-gray-400' />
              <span className='font-medium text-gray-600'>
                Quiz {questions.length + i + 1} : What is most important to work on KDP?
              </span>
            </div>
            <ChevronRight className='h-5 w-5 text-gray-400' />
          </div>
        </div>
      ))}

      <button
        onClick={addNewQuestion}
        className='flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600'
      >
        <Plus className='h-5 w-5' />
        Add New Question
      </button>
    </div>
  )
}
