// app/quiz-active/components/quiz-list.tsx

import { Checkbox } from "@/components/shadcn/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { ChevronUp, Mic, FileText } from "lucide-react";
import { Quiz, quizzes } from "@/features/quiz/api/data";
import { StatusBadge } from "../badge/StatusBadge";
import { AccuracyCircle } from "../circle/AccuracyCircle";

const QuizRow = ({ quiz }: { quiz: Quiz }) => (
  <div className="grid grid-cols-12 gap-4 items-center border-b py-3 px-4 hover:bg-gray-50 text-sm">
    {/* Checkbox & Icon */}
    <div className="col-span-1 flex items-center gap-3">
      <Checkbox id={`quiz-${quiz.id}`} />
      <div className="p-2 rounded-full bg-gray-100">
        {quiz.type === "LIVE" ? <Mic className="h-4 w-4 text-gray-600" /> : <FileText className="h-4 w-4 text-gray-600" />}
      </div>
    </div>
    
    {/* Quiz Name */}
    <div className="col-span-3">
      <label htmlFor={`quiz-${quiz.id}`} className="font-medium text-gray-800 cursor-pointer">{quiz.name}</label>
      <div className="flex items-center text-xs text-gray-500">
        <span className="font-semibold mr-2">{quiz.type}</span>
        {quiz.subtext && <span className="text-yellow-600">{quiz.subtext}</span>}
      </div>
    </div>
    
    {/* Status */}
    <div className="col-span-2">
      <StatusBadge status={quiz.status} />
    </div>

    {/* Learners */}
    <div className="col-span-2 flex items-center">
      <div className="flex -space-x-2">
        {quiz.learners.slice(0, 3).map((learner) => (
          <Avatar key={learner.id} className="h-7 w-7 border-2 border-white">
            {learner.avatarUrl ? <AvatarImage src={learner.avatarUrl} /> : <AvatarFallback>{learner.initials}</AvatarFallback>}
          </Avatar>
        ))}
      </div>
      {quiz.extraLearners > 0 && <span className="ml-2 text-gray-600">+{quiz.extraLearners}</span>}
    </div>

    {/* Accuracy */}
    <div className="col-span-1 flex justify-center">
      <AccuracyCircle accuracy={quiz.accuracy} />
    </div>

    {/* Assigned */}
    <div className="col-span-1 text-gray-600">{quiz.assignedDate}</div>
    
    {/* Assigned By */}
    <div className="col-span-2 flex items-center gap-2">
       <Avatar className="h-7 w-7">
         <AvatarImage src={quiz.assignedBy.avatarUrl} />
         <AvatarFallback>{quiz.assignedBy.name.charAt(0)}</AvatarFallback>
       </Avatar>
       <span className="text-gray-800">{quiz.assignedBy.name}</span>
    </div>
  </div>
);

const QuizListHeader = () => {
    const headers = ["Quiz name", "Status", "Learners", "Accuracy", "Assigned", "Assigned by"];
    const colSpans = ["col-span-3", "col-span-2", "col-span-2", "col-span-1", "col-span-1", "col-span-2"];
    
    return (
        <div className="grid grid-cols-12 gap-4 items-center bg-gray-50 border-b py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
            <div className="col-span-1 flex items-center gap-3">
                <Checkbox />
            </div>
            {headers.map((header, index) => (
                 <div key={header} className={`${colSpans[index]} flex items-center`}>
                    {header} <ChevronUp className="ml-1 h-3 w-3" />
                 </div>
            ))}
        </div>
    );
};


export function QuizTable() {
  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <QuizListHeader />
          <div>
            {quizzes.map((quiz) => (
              <QuizRow key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}