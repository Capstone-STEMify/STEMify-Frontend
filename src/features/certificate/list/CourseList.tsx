// app/certificate/components/CourseList.tsx
import { Accordion } from "@/components/shadcn/accordion";
import { CourseAccordionItem } from "./CourseAccordionItem"; // Import component mới
import { Course } from "../mockData";

interface CourseListProps {
    courses: Course[];
    university: string;
    studentName: string;
}

const CourseList = ({ courses, university, studentName }: CourseListProps) => {
    return (
        <section className="bg-transparent mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Certificates</h2>
            <p className="text-sm text-gray-600 mb-6">Earned after completing each course in the Specialization</p>

            <Accordion type="single" collapsible className="w-full space-y-3">
                {courses.map((course, index) => (
                    <CourseAccordionItem 
                        key={index}
                        itemValue={`item-${index}`}
                        course={course}
                        university={university}
                        studentName={studentName}
                    />
                ))}
            </Accordion>
        </section>
    )
}

export default CourseList;