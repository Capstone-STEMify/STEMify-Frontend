import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Quiz } from '@/features/resource/quiz/types/quiz.type'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'

interface QuizEditorState {
  quiz: Quiz
  selectedQuestionId: number | null
  isDirty: boolean // Track if there are unsaved changes
}

const initialState: QuizEditorState = {
  quiz: {
    id: 0,
    title: 'Bài trắc nghiệm mẫu',
    description: 'Mô tả bài trắc nghiệm',
    totalMarks: 100,
    passingMarks: 50,
    durationDays: 7,
    status: 'Draft',
    contentId: 0,
    timeLimitMinutes: 30,
    totalQuestions: 0,
    questions: []
  },
  selectedQuestionId: null,
  isDirty: false
}

export const quizEditorSlice = createSlice({
  name: 'quizEditor',
  initialState,
  reducers: {
    // Initialize quiz with data from API
    setQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quiz = action.payload
      state.isDirty = false
    },

    // Update quiz basic info
    updateQuizInfo: (state, action: PayloadAction<Partial<Quiz>>) => {
      state.quiz = { ...state.quiz, ...action.payload }
      state.isDirty = true
    },

    // Select a question
    selectQuestion: (state, action: PayloadAction<number | null>) => {
      state.selectedQuestionId = action.payload
    },

    // Add a new question
    addQuestion: (state) => {
      const newQuestion: Question = {
        id: Date.now(),
        questionType: QuestionType.SINGLE_CHOICE,
        content: '',
        orderIndex: state.quiz.questions.length + 1,
        answerExplanation: '',
        points: 1,
        answers: [
          { id: Date.now() + 1, content: '', isCorrect: false },
          { id: Date.now() + 2, content: '', isCorrect: false }
        ]
      }

      state.quiz.questions.push(newQuestion)
      state.quiz.totalQuestions += 1
      state.quiz.totalMarks += 1
      state.selectedQuestionId = newQuestion.id
      state.isDirty = true
    },

    // Update a question
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.quiz.questions.findIndex((q) => q.id === action.payload.id)
      if (index !== -1) {
        const oldPoints = state.quiz.questions[index].points
        state.quiz.questions[index] = action.payload

        // Update total marks if points changed
        state.quiz.totalMarks = state.quiz.totalMarks - oldPoints + action.payload.points
        state.isDirty = true
      }
    },

    // Delete a question
    deleteQuestion: (state, action: PayloadAction<number>) => {
      const question = state.quiz.questions.find((q) => q.id === action.payload)
      if (question) {
        state.quiz.questions = state.quiz.questions
          .filter((q) => q.id !== action.payload)
          .map((q, index) => ({ ...q, orderIndex: index + 1 }))

        state.quiz.totalQuestions = state.quiz.questions.length
        state.quiz.totalMarks = state.quiz.questions.reduce((sum, q) => sum + q.points, 0)

        if (state.selectedQuestionId === action.payload) {
          state.selectedQuestionId = null
        }
        state.isDirty = true
      }
    },

    // Duplicate a question
    duplicateQuestion: (state, action: PayloadAction<number>) => {
      const question = state.quiz.questions.find((q) => q.id === action.payload)
      if (question) {
        const newQuestion: Question = {
          ...question,
          id: Date.now(),
          orderIndex: state.quiz.questions.length + 1,
          answers: question.answers.map((a) => ({
            ...a,
            id: Date.now() + Math.random()
          }))
        }

        state.quiz.questions.push(newQuestion)
        state.quiz.totalQuestions += 1
        state.quiz.totalMarks += newQuestion.points
        state.isDirty = true
      }
    },

    // Reorder questions (for drag & drop)
    reorderQuestions: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload
      const [removed] = state.quiz.questions.splice(oldIndex, 1)
      state.quiz.questions.splice(newIndex, 0, removed)

      // Update order indices
      state.quiz.questions = state.quiz.questions.map((q, index) => ({
        ...q,
        orderIndex: index + 1
      }))
      state.isDirty = true
    },

    // Mark as saved (after successful API call)
    markAsSaved: (state) => {
      state.isDirty = false
    },

    // Reset to initial state
    resetQuizEditor: (state) => {
      return initialState
    }
  }
})

export const {
  setQuiz,
  updateQuizInfo,
  selectQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  reorderQuestions,
  markAsSaved,
  resetQuizEditor
} = quizEditorSlice.actions

export default quizEditorSlice.reducer

// Selectors
export const selectQuiz = (state: { quizEditor: QuizEditorState }) => state.quizEditor.quiz
export const selectSelectedQuestionId = (state: { quizEditor: QuizEditorState }) => state.quizEditor.selectedQuestionId
export const selectIsDirty = (state: { quizEditor: QuizEditorState }) => state.quizEditor.isDirty
export const selectSelectedQuestion = (state: { quizEditor: QuizEditorState }) => {
  if (!state.quizEditor.selectedQuestionId) return null
  return state.quizEditor.quiz.questions.find((q) => q.id === state.quizEditor.selectedQuestionId) || null
}
