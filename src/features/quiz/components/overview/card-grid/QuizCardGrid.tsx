// app/quiz-overview/components/quiz-card-grid.tsx

import { quizOverviews } from "@/features/quiz/api/data";
import { QuizCard } from "../card/QuizCard";



export function QuizCardGrid() {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizOverviews.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}