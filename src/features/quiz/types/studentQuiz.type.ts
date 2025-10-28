export interface QuizStatistics {
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

export interface StudentStatistic {
  studentId: string;
  studentName: string;
  imageUrl: string;
  totalScore: number;
  status: "Passed" | "Failed" | string; 
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: number;
  isCorrect: boolean;
  score: number;
}

export interface QuestionStatistic {
  questionId: number;
  questionTitle: string;
  correctRate: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  questionType: "MultipleChoice" | "TrueFalse" | "ShortAnswer" | string;
}
