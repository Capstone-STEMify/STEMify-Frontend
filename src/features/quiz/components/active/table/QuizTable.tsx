// app/quiz-active/components/quiz-list.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { quizzes } from "@/features/quiz/api/data";
import { ChevronUp, Mic, FileText, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { Button } from "@/components/shadcn/button";
import { StatusBadge } from "../badge/StatusBadge";
import { ProgressCircle } from "../circle/AccuracyCircle";

export function QuizTable() {
  const getAccuracyColor = (accuracy: number | null): string => {
  if (accuracy === null) return "text-gray-400";
  if (accuracy >= 90) return "text-green-500";
  if (accuracy >= 70) return "text-orange-400";
  return "text-red-500";
};

  return (
    <div className="mt-4 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-50 bg-gray-50/50">
            <TableHead className="w-[80px]">
              <div className="flex items-center gap-3">
                <Checkbox />
              </div>
            </TableHead>
            <TableHead className="min-w-[250px]">
              <button className="flex items-center text-xs font-semibold text-gray-500 uppercase">
                Quiz name <ChevronUp className="ml-1 h-3 w-3" />
              </button>
            </TableHead>
            <TableHead className="w-[150px]">
              <button className="flex items-center text-xs font-semibold text-gray-500 uppercase">
                Status <ChevronUp className="ml-1 h-3 w-3" />
              </button>
            </TableHead>
            <TableHead className="w-[180px]">
               <button className="flex items-center text-xs font-semibold text-gray-500 uppercase">
                Learners <ChevronUp className="ml-1 h-3 w-3" />
              </button>
            </TableHead>
            <TableHead className="w-[120px] text-center">
               <button className="flex items-center text-xs font-semibold text-gray-500 uppercase mx-auto">
                Accuracy <ChevronUp className="ml-1 h-3 w-3" />
              </button>
            </TableHead>
            <TableHead className="w-[120px]">
               <button className="flex items-center text-xs font-semibold text-gray-500 uppercase">
                Assigned <ChevronUp className="ml-1 h-3 w-3" />
              </button>
            </TableHead>
            <TableHead className="w-[180px]">
               <button className="flex items-center text-xs font-semibold text-gray-500 uppercase">
                Assigned by <ChevronUp className="ml-1 h-3 w-3" />
              </button>
            </TableHead>
            <TableHead className="w-[80px] text-center text-xs font-semibold text-gray-500 uppercase">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Checkbox id={`quiz-${quiz.id}`} />
                  <div className="p-2 rounded-full bg-gray-100">
                    {quiz.type === "LIVE" ? <Mic className="h-4 w-4 text-gray-600" /> : <FileText className="h-4 w-4 text-gray-600" />}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <label htmlFor={`quiz-${quiz.id}`} className="text-gray-800 cursor-pointer">{quiz.name}</label>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="font-semibold mr-2">{quiz.type}</span>
                  {quiz.subtext && <span className="text-yellow-600">{quiz.subtext}</span>}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={quiz.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {quiz.learners.slice(0, 3).map((learner) => (
                      <Avatar key={learner.id} className="h-7 w-7 border-2 border-white">
                        {learner.avatarUrl ? <AvatarImage src={learner.avatarUrl} /> : <AvatarFallback>{learner.initials}</AvatarFallback>}
                      </Avatar>
                    ))}
                  </div>
                  {quiz.extraLearners > 0 && <span className="ml-2 text-gray-600 text-sm">+{quiz.extraLearners}</span>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <ProgressCircle 
      value={quiz.accuracy} 
      size={40}
      strokeWidth={4}
      className={getAccuracyColor(quiz.accuracy)}
    />
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{quiz.assignedDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={quiz.assignedBy.avatarUrl} />
                    <AvatarFallback>{quiz.assignedBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-800">{quiz.assignedBy.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Quiz</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}