import { QuizCardGrid } from "./card-grid/QuizCardGrid";
import { QuizOverviewToolbar } from "./tool-bar/OverviewToolBar";


export default function QuizOverview() {
  const QuizHeader = () => (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Quiz</h1>
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <QuizOverviewToolbar />
        <QuizCardGrid />
      </div>
    </div>
  );
}