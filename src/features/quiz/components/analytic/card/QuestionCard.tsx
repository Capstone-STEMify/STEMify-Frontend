// app/quiz-analytic/components/question-card.tsx

import { Card, CardContent } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";
import { HelpCircle, Layers, Star, Clock, Check, X } from "lucide-react";
import { ProgressCircle } from "../../active/circle/AccuracyCircle";

const StatisticsBox = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <h3 className="font-semibold text-base">Statistics</h3>
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-green-100 rounded-full">
        <Check className="h-4 w-4 text-green-600" />
      </div>
      <div>
        <span className="text-sm text-gray-500">Correct</span>
        <p className="font-semibold">20</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-red-100 rounded-full">
        <X className="h-4 w-4 text-red-600" />
      </div>
      <div>
        <span className="text-sm text-gray-500">Incorrect</span>
        <p className="font-semibold">0</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <ProgressCircle value={100} size={28} className="text-green-500" strokeWidth={3} showPercentageText={false}/>
      <div>
        <span className="text-sm text-gray-500">Accuracy</span>
        <p className="font-semibold">100%</p>
      </div>
    </div>
  </div>
);

const AnswerOption = ({ label, percentage, responses, isCorrect }: { label: string, percentage: number, responses: number, isCorrect?: boolean }) => (
  <div>
    <p className="text-sm font-medium mb-1.5">{label}</p>
    <Progress value={percentage} className={`h-2 ${isCorrect ? '[&>div]:bg-teal-500' : ''}`} />
    <div className="flex justify-between items-center mt-1.5">
      <span className="text-xs text-gray-500">{responses} resp.</span>
      <span className="text-xs text-gray-500">{percentage}%</span>
    </div>
  </div>
);

export function QuestionCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-semibold">
            <HelpCircle className="h-5 w-5 text-gray-400" />
            <span>Question 2 of 20</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" /> Multiple choice</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Avg. time 32s</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /> 1 point</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <p className="text-lg font-semibold">
              Which aspect of UI design involves choosing colors, typography, and creating icons for a digital interface?
            </p>
            <div className="space-y-4 pt-2">
              <AnswerOption label="Information Architecture" percentage={0} responses={0} />
              <AnswerOption label="Interaction Design" percentage={0} responses={0} />
              <AnswerOption label="Visual Design" percentage={100} responses={20} isCorrect />
              <AnswerOption label="User Research" percentage={0} responses={0} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <StatisticsBox />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}