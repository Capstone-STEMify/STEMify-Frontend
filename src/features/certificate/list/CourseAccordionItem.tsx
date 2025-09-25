// app/certificate/components/CourseAccordionItem.tsx
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Card, CardContent } from "@/components/shadcn/card";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "../mockData";

interface CourseAccordionItemProps {
  course: Course;
  university: string;
  studentName: string;
  itemValue: string;
}

export const CourseAccordionItem = ({ 
  course, 
  university,
  studentName,
  itemValue 
}: CourseAccordionItemProps) => {
  return (
    <AccordionItem value={itemValue} className="border-b-0">
      <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md">
        <AccordionTrigger className="p-4 text-left hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <Image 
                src="/HomeFiles/window.png"
                alt="University Logo"
                width={64}
                height={64}
                className="hidden sm:block"
              />
              <div>
                <h4 className="font-bold text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-500">Course • {course.grade === 100 ? "100% complete" : `Grade: ${course.grade}%`}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 ml-4">
              <Link href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                Add to LinkedIn
              </Link>
              <Link href="#" className="text-sm font-semibold text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50">
                View certificate
              </Link>
              <MoreHorizontal className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className="border-t px-6 pt-6 bg-gray-50/50">
            <h3 className="text-2xl text-blue-700 mb-4">{course.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{university}</p>
            <p className="text-sm text-gray-600 mt-1">Taught by: {course.instructor}</p>
            
            <div className="mt-4 text-sm text-gray-800 space-y-1">
                <p>Completed by {studentName} by <span className="font-semibold">{course.completionDate}</span></p>
                <p>{course.studyDuration}</p>
                <p>Grade Achieved: <span className="font-semibold">{course.grade}%</span></p>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};