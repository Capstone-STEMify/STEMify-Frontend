'use client'

import { Answer, Question, Quiz } from '@/features/resource/quiz/types/quiz.type'

// Mock data structures matching the ERD

export type QuestionTypeEnum = 'true-false' | 'multiple-choice' | 'single-choice' | 'short-answer'
export type QuizStatus = 'draft' | 'published' | 'archived'

export interface QuestionType {
  id: number
  name: QuestionTypeEnum
}

// export interface Answer {
//   id: number
//   questionId: number
//   content: string
//   isCorrect: boolean
// }

// export interface Question {
//   id: number
//   quizId: number
//   questionTypeId: number
//   name: string
//   fileUrl?: string
//   description?: string
//   answerExplanation?: string
//   point: number
//   orderIndex: number
//   answers: Answer[]
// }

// export interface Quiz {
//   id: number
//   sectionId?: number
//   title: string
//   description?: string
//   duration: number // in minutes
//   createdBy: string
//   createdAt: string
//   updatedAt: string
//   status: QuizStatus
//   passingScore: number
//   questions: Question[]
// }

// Mock Question Types
export const mockQuestionTypes: QuestionType[] = [
  { id: 1, name: 'true-false' },
  { id: 2, name: 'single-choice' },
  { id: 3, name: 'multiple-choice' },
  { id: 4, name: 'short-answer' }
]

// Mock Answers
export const mockAnswers: Answer[] = [
  { id: 1, questionId: 1, content: 'User Integration', isCorrect: false },
  { id: 2, questionId: 1, content: 'User Interface', isCorrect: true },
  { id: 3, questionId: 1, content: 'Universal Interaction', isCorrect: false },
  { id: 4, questionId: 1, content: 'User Involvement', isCorrect: false },
  { id: 5, questionId: 2, content: 'useState', isCorrect: false },
  { id: 6, questionId: 2, content: 'useEffect', isCorrect: false },
  { id: 7, questionId: 2, content: 'function', isCorrect: true },
  { id: 8, questionId: 2, content: 'render', isCorrect: false },
  { id: 9, questionId: 3, content: 'useState', isCorrect: true },
  { id: 10, questionId: 3, content: 'useContext', isCorrect: true },
  { id: 11, questionId: 3, content: 'useRouter', isCorrect: false },
  { id: 12, questionId: 3, content: 'useEffect', isCorrect: true },
  { id: 13, questionId: 4, content: 'useState', isCorrect: true },
  { id: 14, questionId: 5, content: 'True', isCorrect: false },
  { id: 15, questionId: 5, content: 'False', isCorrect: true },
  { id: 16, questionId: 6, content: 'this.state = {}', isCorrect: false },
  { id: 17, questionId: 6, content: 'const [state] = useState()', isCorrect: true },
  { id: 18, questionId: 6, content: 'state = {}', isCorrect: false },
  { id: 19, questionId: 6, content: 'let state = {}', isCorrect: false }
]

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: 1,
    quizId: 1,
    questionTypeId: 3, // multiple-choice
    name: 'What does UI stand for in the context of design?',
    description: 'Understanding UI terminology',
    answerExplanation:
      'UI stands for User Interface, which is the visual and interactive elements of a software application.',
    point: 1,
    orderIndex: 1,
    answers: mockAnswers.filter((a) => a.questionId === 1)
  },
  {
    id: 2,
    quizId: 1,
    questionTypeId: 2, // single-choice
    name: 'Hàm nào được sử dụng để tạo một component trong React?',
    description: 'React component creation',
    answerExplanation: "The 'function' keyword is used to create functional components in React.",
    point: 1,
    orderIndex: 2,
    answers: mockAnswers.filter((a) => a.questionId === 2)
  },
  {
    id: 3,
    quizId: 1,
    questionTypeId: 3, // multiple-choice
    name: 'Chọn tất cả các hooks của React (có thể chọn nhiều)',
    description: 'React hooks identification',
    answerExplanation: 'useState, useContext, and useEffect are all React hooks. useRouter is from Next.js.',
    point: 2,
    orderIndex: 3,
    answers: mockAnswers.filter((a) => a.questionId === 3)
  },
  {
    id: 4,
    quizId: 1,
    questionTypeId: 4, // short-answer
    name: 'Viết tên của hook được sử dụng để quản lý state trong React',
    description: 'State management hook',
    answerExplanation: 'useState is the primary hook for managing state in functional components.',
    point: 1,
    orderIndex: 4,
    answers: mockAnswers.filter((a) => a.questionId === 4)
  },
  {
    id: 5,
    quizId: 1,
    questionTypeId: 1, // true-false
    name: 'Props trong React có thể được thay đổi từ component con',
    description: 'Props immutability',
    answerExplanation: 'Props are immutable and cannot be changed from child components.',
    point: 1,
    orderIndex: 5,
    answers: mockAnswers.filter((a) => a.questionId === 5)
  },
  {
    id: 6,
    quizId: 1,
    questionTypeId: 2, // single-choice
    name: 'Cách nào là đúng để khai báo state trong functional component?',
    description: 'State declaration in functional components',
    answerExplanation: 'const [state] = useState() is the correct way to declare state in functional components.',
    point: 1,
    orderIndex: 6,
    answers: mockAnswers.filter((a) => a.questionId === 6)
  }
]

// Mock Quiz
export const mockQuiz: Quiz = {
  id: 1,
  contentId: 1,
  title: 'UI Design Fundamentals & Best Practice',
  description: 'Kiểm tra kiến thức của bạn',
  durationDays: 1,
  status: 'published',
  passingMarks: 70,
  timeLimitMinutes: 30,
  totalMarks: 7,
  totalQuestions: 10,
  questions: mockQuestions
}

// Mock multiple quizzes for listing
export const mockQuizzes: Quiz[] = [
  mockQuiz,
  {
    id: 2,
    contentId: 1,
    title: 'Advanced React Patterns',
    description: 'Test your knowledge of advanced React patterns',
    durationDays: 15,
    status: 'published',
    passingMarks: 75,
    timeLimitMinutes: 60,
    totalMarks: 100,
    totalQuestions: 10,
    questions: []
  },
  {
    id: 3,
    contentId: 2,
    title: 'TypeScript Basics',
    description: 'Learn TypeScript fundamentals',
    durationDays: 20,
    status: 'draft',
    passingMarks: 60,
    timeLimitMinutes: 45,
    totalMarks: 50,
    totalQuestions: 10,
    questions: []
  }
]
