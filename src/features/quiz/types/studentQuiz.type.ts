import { SearchPaginatedRequestParams } from "@/types/baseModel";

export type QuizStatistics = {
  quizId: number;
  quizName: string;
  timeLimitMinutes: number;
  submissions: number;
  averageScore: number;
  passRate: number;
  totalQuestions: number;
  studentStatistics: StudentStatistic[];
  questionStatistics: QuestionStatistic[];
}

export type StudentStatistic = {
  studentId: string;
  studentName: string;
  imageUrl: string;
  totalScore: number;
  status: "Passed" | "Failed" | string;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  totalSkipAnswers: number;
  totalAnswers: number;
  questionResults: QuestionResult[];
}

export type QuestionResult = {
  questionId: number;
  questionTitle: string;
  questionType: "MultipleChoice" | "TrueFalse" | "ShortAnswer" | string;
  isCorrect: boolean;
  point: number;
  correctAnswer: string;
}

export type QuestionStatistic = {
  questionId: number;
  questionTitle: string;
  correctRate: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  questionType: "MultipleChoice" | "TrueFalse" | "ShortAnswer" | string;
  point: number;
  answerStatistics: AnswerStatistic[];
}

export type AnswerStatistic = {
  answerId: number;
  content: string;
  selectionCount: number;
}

export type QuizStatisticQueryParam = {
  classroomId: number
} & SearchPaginatedRequestParams
