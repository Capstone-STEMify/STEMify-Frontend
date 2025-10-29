'use client'

import { Answer, Question } from '@/features/resource/question/types/question.type'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'

export type QuizStatus = 'draft' | 'published' | 'archived'

// Mock Answers
export const mockAnswers: Answer[] = [
  { id: 1, content: 'User Integration', isCorrect: false },
  { id: 2, content: 'User Interface', isCorrect: true },
  { id: 3, content: 'Universal Interaction', isCorrect: false },
  { id: 4, content: 'User Involvement', isCorrect: false },
  { id: 5, content: 'useState', isCorrect: false },
  { id: 6, content: 'useEffect', isCorrect: false },
  { id: 7, content: 'function', isCorrect: true },
  { id: 8, content: 'render', isCorrect: false },
  { id: 9, content: 'useState', isCorrect: true },
  { id: 10, content: 'useContext', isCorrect: true },
  { id: 11, content: 'useRouter', isCorrect: false },
  { id: 12, content: 'useEffect', isCorrect: true },
  { id: 13, content: 'useState', isCorrect: true },
  { id: 14, content: 'True', isCorrect: false },
  { id: 15, content: 'False', isCorrect: true },
  { id: 16, content: 'this.state = {}', isCorrect: false },
  { id: 17, content: 'const [state] = useState()', isCorrect: true },
  { id: 18, content: 'state = {}', isCorrect: false },
  { id: 19, content: 'let state = {}', isCorrect: false }
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

