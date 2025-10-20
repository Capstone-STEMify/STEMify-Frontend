// app/quiz-analytic/components/learner-overview-tab.tsx

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { AnswerGridTable } from "../table/AnswerTable";

export function LearnerOverviewTab() {
  return (
    <div className="space-y-6">
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTitle className="text-yellow-800">1 Question needs a review for thorough scoring!</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span className="text-yellow-700">Check the question that needs your review.</span>
          <Button variant="link" className="p-0 h-auto text-yellow-800 font-semibold">View Question</Button>
        </AlertDescription>
      </Alert>
      <AnswerGridTable />
    </div>
  );
}