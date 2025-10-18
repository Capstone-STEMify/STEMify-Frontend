'use client'

import { mockQuiz } from '@/features/resource/quiz/context/mock-date'
import type React from 'react'
import { createContext, useContext, useState } from 'react'

interface Answer {
  id: number
  questionId: number
  content: string
  isCorrect: boolean
}

interface Question {
  id: number
  quizId: number
  questionTypeId: number
  name: string
  fileUrl?: string
  description?: string
  answerExplanation?: string
  point: number
  orderIndex: number
  answers: Answer[]
}

interface Quiz {
  id: number
  sectionId?: number
  title: string
  description?: string
  duration: number
  createdBy: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'archived'
  passingScore: number
  questions: Question[]
}

interface QuizBuilderContextType {
  quiz: Quiz
  currentQuestionId: number | null
  setCurrentQuestionId: (id: number) => void
  addQuestion: () => void
  deleteQuestion: (id: number) => void
  updateQuestion: (id: number, updates: Partial<Question>) => void
  updateQuiz: (updates: Partial<Quiz>) => void
  addAnswer: (questionId: number, answer: Answer) => void
  deleteAnswer: (questionId: number, answerId: number) => void
  updateAnswer: (questionId: number, answerId: number, updates: Partial<Answer>) => void
}

const QuizBuilderContext = createContext<QuizBuilderContextType | undefined>(undefined)

export function QuizBuilderProvider({ children }: { children: React.ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz>(mockQuiz)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(mockQuiz.questions[0]?.id || null)

  const addQuestion = () => {
    const newId = Math.max(...quiz.questions.map((q) => q.id), 0) + 1
    const newQuestion: Question = {
      id: newId,
      quizId: quiz.id,
      questionTypeId: 2, // single-choice by default
      name: '',
      point: 1,
      orderIndex: quiz.questions.length + 1,
      answers: []
    }
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setCurrentQuestionId(newId)
  }

  const deleteQuestion = (id: number) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id)
    }))
    if (currentQuestionId === id) {
      setCurrentQuestionId(quiz.questions[0]?.id || null)
    }
  }

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    }))
  }

  const updateQuiz = (updates: Partial<Quiz>) => {
    setQuiz((prev) => ({ ...prev, ...updates }))
  }

  const addAnswer = (questionId: number, answer: Answer) => {
    updateQuestion(questionId, {
      answers: [...quiz.questions.find((q) => q.id === questionId)!.answers, answer]
    })
  }

  const deleteAnswer = (questionId: number, answerId: number) => {
    updateQuestion(questionId, {
      answers: quiz.questions.find((q) => q.id === questionId)!.answers.filter((a) => a.id !== answerId)
    })
  }

  const updateAnswer = (questionId: number, answerId: number, updates: Partial<Answer>) => {
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
