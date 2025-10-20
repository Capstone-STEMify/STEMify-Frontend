// app/quiz-analytic/components/question-card.tsx

import { Badge } from "@/components/shadcn/badge";
import { Progress } from "@/components/shadcn/progress";
import { Card, CardContent } from "@/components/shadcn/card";
import { GripVertical, Layers, Star, Clock } from "lucide-react";

const AnswerOption = ({ label, percentage, responses }: { label: string, percentage: number, responses: number }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm text-gray-500">{responses} resp. • {percentage}%</span>
    </div>
    <Progress value={percentage} className={percentage > 0 ? "h-2" : "h-2 bg-gray-200"} />
  </div>
);

export function QuestionCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Question 1 of 20</p>
            <div className="flex gap-2">
              <Badge variant="outline"><Layers className="h-3 w-3 mr-1.5" /> Multiple choice</Badge>
              <Badge variant="outline"><Clock className="h-3 w-3 mr-1.5" /> Avg. time 32s</Badge>
              <Badge variant="outline"><Star className="h-3 w-3 mr-1.5" /> 1 point</Badge>
            </div>
          </div>
          <GripVertical className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>
        
        <div className="my-6">
          <img src="/courses/course-5.png" alt="Question visual" className="w-48 h-auto rounded-md border" />
        </div>

        <p className="font-semibold text-base mb-6">What does UI stand for in the context of design?</p>

        <div className="space-y-4">
          <AnswerOption label="User Integration" percentage={0} responses={0} />
          <AnswerOption label="User Interface" percentage={70} responses={13} />
          <AnswerOption label="Universal Interaction" percentage={0} responses={0} />
          <AnswerOption label="User Involvement" percentage={0} responses={0} />
        </div>
      </CardContent>
    </Card>
  );
}