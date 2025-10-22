'use client'

import { useState } from 'react'
import QuestionSidebar from '@/features/resource/question/components/upsert/QuestionSidebar'
import QuestionEditor from '@/features/resource/question/components/upsert/QuestionEditor'

export default function UpsertQuestion() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'What does UI stand for...',
      type: 'single-choice',
      required: true,
      answers: [
        { id: 1, text: 'User Interface' },
        { id: 2, text: 'User Integration' },
        { id: 3, text: 'Unified Input' },
        { id: 4, text: 'Universal Icon' }
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      title: 'Which aspect of UI de...',
      type: 'multiple-choice',
      required: false,
      answers: [
        { id: 1, text: 'Color scheme' },
        { id: 2, text: 'Typography' },
        { id: 3, text: 'Layout' },
        { id: 4, text: 'Animation' }
      ],
      correctAnswers: [1, 2]
    },
    {
      id: 3,
      title: 'How to export a pictu...',
      type: 'true-false',
      required: false,
      answers: [
        { id: 1, text: 'True' },
        { id: 2, text: 'False' }
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      title: 'Which term refers to t...',
      type: 'single-choice',
      required: false,
      answers: [
        { id: 1, text: 'Option A' },
        { id: 2, text: 'Option B' },
        { id: 3, text: 'Option C' }
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      title: 'Why is maintaining co...',
      type: 'multiple-choice',
      required: false,
      answers: [
        { id: 1, text: 'Consistency' },
        { id: 2, text: 'Clarity' },
        { id: 3, text: 'Accessibility' }
      ],
      correctAnswers: [1, 3]
    }
  ])

  const [selectedQuestion, setSelectedQuestion] = useState(1)
  const [draggedQuestion, setDraggedQuestion] = useState<number | null>(null)

  const currentQuestion = questions.find((q) => q.id === selectedQuestion)

  const updateQuestion = (questionId: number, updates: any) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)))
  }

  const reorderQuestions = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    setQuestions(newQuestions)
  }

  return (
    <div className='flex'>
      <QuestionSidebar
        questions={questions}
        selectedQuestion={selectedQuestion}
        onSelectQuestion={setSelectedQuestion}
        onReorderQuestions={reorderQuestions}
        draggedQuestion={draggedQuestion}
        onDraggedQuestion={setDraggedQuestion}
      />
      <main className='flex flex-1 flex-col overflow-hidden'>
        <div className='flex-1 overflow-auto'>
          {currentQuestion && (
            <QuestionEditor
              question={currentQuestion}
              onUpdateQuestion={(updates) => updateQuestion(currentQuestion.id, updates)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
