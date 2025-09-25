// app/accomplishments/components/CourseCard.tsx
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { FileText } from "lucide-react";
import { Course } from "../../api/mockData";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-3 rounded-md mt-1">
            <FileText className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.university}</p>
            <p className="text-sm text-gray-600 mt-1">Grade Achieved: <span className="font-semibold">{course.grade}%</span></p>
          </div>
        </div>
        <Button className="ml-4 flex-shrink-0 bg-blue-500">Add to LinkedIn</Button>
      </CardContent>
    </Card>
  );
};