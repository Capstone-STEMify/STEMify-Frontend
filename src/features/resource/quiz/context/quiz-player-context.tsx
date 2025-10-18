'use client'

import { useEffect } from 'react'

import type React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'

export type QuestionType = 'true-false' | 'multiple-choice' | 'single-choice' | 'short-answer'

export interface Question {
  id: number
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer?: string | number
  userAnswer?: string | number
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
  const [questions] = useState<Question[]>([
    {
      id: 1,
      type: 'true-false',
      question: 'React là một thư viện JavaScript để xây dựng giao diện người dùng',
      correctAnswer: 'true'
    },
    {
      id: 2,
      type: 'single-choice',
      question: 'Hàm nào được sử dụng để tạo một component trong React?',
      options: ['useState', 'useEffect', 'function', 'render'],
      correctAnswer: 2
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'Chọn tất cả các hooks của React (có thể chọn nhiều)',
      options: ['useState', 'useContext', 'useRouter', 'useEffect'],
      correctAnswer: 0
    },
    {
      id: 4,
      type: 'short-answer',
      question: 'Viết tên của hook được sử dụng để quản lý state trong React',
      correctAnswer: 'useState'
    },
    {
      id: 5,
      type: 'true-false',
      question: 'Props trong React có thể được thay đổi từ component con',
      correctAnswer: 'false'
    },
    {
      id: 6,
      type: 'single-choice',
      question: 'Cách nào là đúng để khai báo state trong functional component?',
      options: ['this.state = {}', 'const [state] = useState()', 'state = {}', 'let state = {}'],
      correctAnswer: 1
    }
  ])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes
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
