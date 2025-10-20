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
      <div className="overflow-x-auto relative">
        <Table className="min-w-[2000px]">
          <TableHeader>
            <TableRow className="bg-gray-200 hover:bg-gray-300">
              <TableHead className="
                sticky left-0 z-10 
                w-[350px] 
                bg-inherit
              ">
                Learner
              </TableHead>

              {questions.map((q) => (
                <TableHead key={q.id} className="text-center w-[100px]">
                  {q.title}
                  <Badge variant="secondary" className="ml-2 font-normal">{q.percentage}%</Badge>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((learner, index) => (
              <TableRow key={learner.id} className="group">

                <TableCell className="
                  sticky left-0 z-10 
                  bg-background 
                  group-hover:bg-muted/50
                ">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm text-gray-500 font-medium">{index + 1}</span>
                    
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={learner.avatar} />
                      <AvatarFallback>
                        {learner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {learner.name}
                        {learner.designation && <Badge variant="outline" className="font-normal">{learner.designation}</Badge>}
                      </p>
                      <span className="text-xs text-gray-500">{learner.role}</span>
                    </div>
                  </div>
                </TableCell>

                {learner.answers.map((answer) => {
                  const Icon = answerIcons[answer.status];
                  const color = answerColors[answer.status];
                  return (
                    <TableCell key={`${learner.id}-${answer.questionId}`} className="text-center">
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