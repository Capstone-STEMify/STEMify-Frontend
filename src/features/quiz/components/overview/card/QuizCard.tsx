// app/quiz-overview/components/quiz-card.tsx

import { Card, CardContent, CardFooter } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { MoreHorizontal, BookOpen, Users, FileSignature } from "lucide-react";


import { cn } from "@/shadcn/utils";
import { QuizOverview } from "@/features/quiz/api/data";
import { ProgressCircle } from "../../active/circle/AccuracyCircle";

interface QuizCardProps {
  quiz: QuizOverview;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        <img src={quiz.imageUrl} alt={quiz.title} className="w-full h-32 object-cover" />
        <div className="absolute top-2 left-2 flex gap-2">
            <Badge className="bg-black/60 text-white backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1.5" />
                {quiz.enrolledCount} Enrolled
            </Badge>
            {quiz.status === "Draft" && (
                <Badge variant="secondary">
                    <FileSignature className="h-3 w-3 mr-1.5" />
                    Draft
                </Badge>
            )}
        </div>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-semibold text-base leading-tight mb-4 h-10">{quiz.title}</h3>
        <div className="flex justify-between items-center text-sm">
            <div className="flex flex-col items-center">
                <ProgressCircle value={quiz.accuracy} className="text-red-400" />
                <span className="text-xs text-gray-500 mt-1">Accuracy</span>
            </div>
             <div className="flex flex-col items-center">
                <ProgressCircle value={quiz.completionRate} className="text-green-500" />
                <span className="text-xs text-gray-500 mt-1">Completion Rate</span>
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline">{quiz.category}</Badge>
            <Badge variant="outline" className={cn(quiz.priority === "Urgent" ? "text-red-600 border-red-200 bg-red-50" : "text-gray-600")}>
                {quiz.priority}
            </Badge>
            <Avatar className="h-6 w-6 ml-auto">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>R</AvatarFallback>
            </Avatar>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50/70 py-2 px-4 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-4">
            <span>Edited {quiz.lastEdited}</span>
            <div className="flex items-center gap-1.5">
                <BookOpen className="h-3 w-3" />
                <span>{quiz.questionCount} Question</span>
            </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}