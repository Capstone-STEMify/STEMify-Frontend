'use client'

import { mockQuiz, QuestionTypeEnum } from '@/features/resource/quiz/context/mock-date'
import { useEffect } from 'react'

import type React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

export type QuestionType = QuestionTypeEnum

export interface Question {
  id: number
  quizId: number
  questionTypeId: number
  name: string
  fileUrl?: string
  description?: string
  answerExplanation?: string
  point: number
  orderIndex: number
  answers: Array<{
    id: number
    questionId: number
    content: string
    isCorrect: boolean
  }>
}

interface QuizContextType {
  questions: Question[]
  currentQuestionIndex: number
  timeRemaining: number
  setCurrentQuestionIndex: (index: number) => void
  setUserAnswer: (answer: string | number) => void
  goToNextQuestion: () => void
  goToPreviousQuestion: () => void
  submitQuiz: () => void
  isSubmitted: boolean
}

const QuizPlayerContext = createContext<QuizContextType | undefined>(undefined)

export const QuizPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions] = useState<Question[]>(mockQuiz.questions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(mockQuiz.duration * 60) // Convert minutes to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number>>({})

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          setIsSubmitted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const setUserAnswer = useCallback(
    (answer: string | number) => {
      setUserAnswers((prev) => ({
        ...prev,
        [questions[currentQuestionIndex].id]: answer
      }))
    },
    [currentQuestionIndex, questions]
  )

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }, [currentQuestionIndex, questions.length])

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex])

  const submitQuiz = useCallback(() => {
    setIsSubmitted(true)
  }, [])

  return (
    <QuizPlayerContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        timeRemaining,
        setCurrentQuestionIndex,
        setUserAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        submitQuiz,
        isSubmitted
      }}
    >
      {children}
    </QuizPlayerContext.Provider>
  )
}

export const useQuizPlayer = () => {
  const context = useContext(QuizPlayerContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}
