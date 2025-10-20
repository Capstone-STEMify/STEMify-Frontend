// app/quiz-analytic/components/quiz-detail-header.tsx

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/shadcn/breadcrumb";
import { 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Edit2, 
  MoreHorizontal, 
  Share2, 
  BookOpen 
} from "lucide-react";
import { ProgressCircle } from "../../active/circle/AccuracyCircle";

export function QuizDetailHeader() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/quiz">Quiz</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>UI Design Fundamentals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-gray-600">
              <Clock className="h-3 w-3 mr-1.5" /> LIVE
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              <CheckCircle className="h-3 w-3 mr-1.5" /> Completed
            </Badge>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            UI Design Fundamentals & Best Practice
            <Edit2 className="h-5 w-5 text-gray-400 cursor-pointer" />
          </h1>
          <div className="flex items-center gap-2 mt-3 mb-4">
            <Badge>Fundamental</Badge>
            <Badge>Design</Badge>
            <Badge>Not Urgent</Badge>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Quiz
            </span>
            <span>•</span>
            <span>20 Question</span>
            <span>•</span>
            <span>Started date 28 Sep 2023</span>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ProgressCircle value={50} size={40} className="text-red-500" />
              <div>
                <span className="text-xs text-gray-500">Accuracy</span>
                <p className="font-semibold text-lg">50%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProgressCircle value={100} size={40} className="text-green-500" />
              <div>
                <span className="text-xs text-gray-500">Completed Course</span>
                <p className="font-semibold text-lg">100%</p>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Submissions</span>
              <p className="font-semibold text-lg">20</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Avg. Complete Time</span>
              <p className="font-semibold text-lg">04:20</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="/courses/course-1.png"
            alt="UI Design" 
            className="rounded-lg w-full md:w-64 h-48 object-cover"
          />
        </div>
      </div>
    </div>
  );
}