import { QuizHeader } from "./header/QuizHeader";
import { QuizTable } from "./table/QuizTable";
import { QuizToolbar } from "./tool-bar/QuizToolBar";


export default function QuizActive() {
  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <QuizHeader />
        <QuizToolbar />
        <QuizTable />
      </div>
    </div>
  );
}