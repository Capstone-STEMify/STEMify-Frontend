'use client'

import type React from 'react'
import { createContext, useContext, useState } from 'react'

export interface Answer {
  id: string
  text: string
  isCorrect: boolean
  image?: string
}

export interface Question {
  id: string
  number: number
  text: string
  type: 'multiple-choice' | 'single-choice' | 'true-false' | 'short-answer'
  answers: Answer[]
  image?: string
  estimationTime: number
  points: number
  randomizeOrder: boolean
  required: boolean
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
}

interface QuizBuilderContextType {
  quiz: Quiz
  currentQuestionId: string | null
  setCurrentQuestionId: (id: string) => void
  addQuestion: () => void
  deleteQuestion: (id: string) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  updateQuiz: (updates: Partial<Quiz>) => void
  addAnswer: (questionId: string, answer: Answer) => void
  deleteAnswer: (questionId: string, answerId: string) => void
  updateAnswer: (questionId: string, answerId: string, updates: Partial<Answer>) => void
}

const QuizBuilderContext = createContext<QuizBuilderContextType | undefined>(undefined)

export function QuizBuilderProvider({ children }: { children: React.ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz>({
    id: '1',
    title: 'UI Design Fundamentals & Best Practice',
    description: '',
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'What does UI stand for in the context of design?',
        type: 'multiple-choice',
        answers: [
          { id: 'a1', text: 'User Integration', isCorrect: false },
          { id: 'a2', text: 'User Interface', isCorrect: true },
          { id: 'a3', text: 'Universal Interaction', isCorrect: false },
          { id: 'a4', text: 'User Involvement', isCorrect: false }
        ],
        estimationTime: 2,
        points: 1,
        randomizeOrder: false,
        required: true
      }
    ]
  })

  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>('q1')

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      number: quiz.questions.length + 1,
      text: '',
      type: 'multiple-choice',
      answers: [],
      estimationTime: 2,
      points: 1,
      randomizeOrder: false,
      required: true
    }
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setCurrentQuestionId(newQuestion.id)
  }

  const deleteQuestion = (id: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id)
    }))
    if (currentQuestionId === id) {
      setCurrentQuestionId(quiz.questions[0]?.id || null)
    }
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    }))
  }

  const updateQuiz = (updates: Partial<Quiz>) => {
    setQuiz((prev) => ({ ...prev, ...updates }))
  }

  const addAnswer = (questionId: string, answer: Answer) => {
    updateQuestion(questionId, {
      answers: [...quiz.questions.find((q) => q.id === questionId)!.answers, answer]
    })
  }

  const deleteAnswer = (questionId: string, answerId: string) => {
    updateQuestion(questionId, {
      answers: quiz.questions.find((q) => q.id === questionId)!.answers.filter((a) => a.id !== answerId)
    })
  }

  const updateAnswer = (questionId: string, answerId: string, updates: Partial<Answer>) => {
    updateQuestion(questionId, {
      answers: quiz.questions
        .find((q) => q.id === questionId)!
        .answers.map((a) => (a.id === answerId ? { ...a, ...updates } : a))
    })
  }

  return (
    <QuizBuilderContext.Provider
      value={{
        quiz,
        currentQuestionId,
        setCurrentQuestionId,
        addQuestion,
        deleteQuestion,
        updateQuestion,
        updateQuiz,
        addAnswer,
        deleteAnswer,
        updateAnswer
      }}
    >
      {children}
    </QuizBuilderContext.Provider>
  )
}

export function useQuizBuilder() {
  const context = useContext(QuizBuilderContext)
  if (!context) {
    throw new Error('useQuizBuilder must be used within QuizBuilderProvider')
  }
  return context
}
