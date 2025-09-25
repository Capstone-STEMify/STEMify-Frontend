// app/certificate/components/CourseList.tsx
import Link from "next/link";
import { Course } from "../mockData";

interface CourseListProps {
    courses: Course[];
    university: string;
}

const CourseList = ({ courses, university }: CourseListProps) => {
    return (
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Certificates</h2>
            <p className="text-sm text-gray-600 mb-6">Earned after completing each course in the Specialization</p>

            <div className="space-y-6">
                {courses.map((course, index) => (
                    <div key={index} className="border-t pt-6">
                        <h3 className="text-lg font-bold text-blue-700">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{university}</p>
                        <p className="text-sm text-gray-600">Taught by: {course.instructor}</p>
                        
                        <div className="mt-3 text-sm text-gray-800 space-y-1">
                            <p>Completed by Nhân Thành Lê by <span className="font-semibold">{course.completionDate}</span></p>
                            <p>{course.studyDuration}</p>
                            <p>Grade Achieved: <span className="font-semibold">{course.grade}%</span></p>
                        </div>

                        <Link href="#" className="text-sm font-semibold text-blue-600 hover:underline mt-3 inline-block">
                            View this certificate
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CourseList;