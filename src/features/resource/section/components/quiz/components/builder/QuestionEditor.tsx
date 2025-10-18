"use client"

import { Card } from "@/components/shadcn/card"
import { Input } from "@/components/shadcn/input"
import { Button } from "@/components/shadcn/button"
import { Badge } from "@/components/shadcn/badge"
import { Textarea } from "@/components/shadcn/textarea"
import { Search, Settings } from "lucide-react"
import { useState } from "react"
import { useQuizBuilder } from '@/features/resource/section/components/quiz/context/quiz-builder-context'
import QuestionTypeSelector from '@/features/resource/section/components/quiz/components/builder/QuestionTypeSelector'
import AnswerOptionsManager from '@/features/resource/section/components/quiz/components/builder/AnswerOptionsManager'
import QuizSettings from '@/features/resource/section/components/quiz/components/builder/QuizSettings'

export default function QuestionEditor() {
  const { quiz, currentQuestionId, updateQuiz, updateQuestion } = useQuizBuilder()
  const [showSettings, setShowSettings] = useState(false)

  const currentQuestion = quiz.questions.find((q) => q.id === currentQuestionId)

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No question selected</p>
      </div>
    )
  }

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "multiple-choice": "Multiple choice",
      "single-choice": "Single choice",
      "true-false": "True/False",
      "short-answer": "Short answer",
    }
    return labels[type] || type
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Quiz Title"
            value={quiz.title}
            onChange={(e) => updateQuiz({ title: e.target.value })}
            className="text-xl font-semibold"
          />
        </div>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10" />
      </div>

      {/* Question Card */}
      <Card className="p-6 space-y-6">
        {/* Question Type and Required */}
        <div className="flex items-center justify-between">
          <QuestionTypeSelector questionId={currentQuestion.id} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Required</span>
            <input
              type="checkbox"
              checked={currentQuestion.required}
              onChange={(e) => updateQuestion(currentQuestion.id, { required: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </div>
        </div>

        {/* Question Number and Text */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Question {currentQuestion.number}</Badge>
            <Badge variant="secondary">{getQuestionTypeLabel(currentQuestion.type)}</Badge>
          </div>
          <Textarea
            placeholder="Enter your question here..."
            value={currentQuestion.text}
            onChange={(e) => updateQuestion(currentQuestion.id, { text: e.target.value })}
            className="min-h-24"
          />
        </div>

        {/* Image Preview */}
        <div className="bg-blue-100 rounded-lg p-8 flex items-center justify-center min-h-48">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-blue-600 text-2xl">📷</span>
            </div>
            <p className="text-sm text-muted-foreground">Add image</p>
          </div>
        </div>

        {/* Answer Options */}
        <AnswerOptionsManager questionId={currentQuestion.id} />
      </Card>

      {/* Settings */}
      <QuizSettings questionId={currentQuestion.id} />
    </div>
  )
}
