// app/quiz-analytic/components/answer-grid-table.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { learners, questions, answerIcons, answerColors } from "../data";
import { Badge } from "@/components/shadcn/badge";
import { cn } from "@/shadcn/utils";

export function AnswerGridTable() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[300px]">Learner</TableHead>
              {questions.map((q) => (
                <TableHead key={q.id} className="text-center">
                  {q.title}
                  <Badge variant="secondary" className="ml-2">{q.percentage}%</Badge>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((learner) => (
              <TableRow key={learner.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={learner.avatar} />
                      <AvatarFallback>{learner.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{learner.name}</p>
                      <span className="text-xs text-gray-500">{learner.role}</span>
                    </div>
                  </div>
                </TableCell>
                {learner.answers.map((answer) => {
                  const Icon = answerIcons[answer.status];
                  const color = answerColors[answer.status];
                  return (
                    <TableCell key={answer.questionId} className="text-center">
                      <Icon className={cn("h-5 w-5 mx-auto", color)} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}