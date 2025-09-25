'use client'
import { Accordion } from "@/components/shadcn/accordion";
import { accomplishmentsData } from "../api/mockData"; 
import { SpecializationCard } from "./specialization/SpecializationCard"; 
import { CourseCard } from "./course/CourseCard"; 

export default function Accomplishment() {
  const { specializations, courses } = accomplishmentsData;

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        <section>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">My Specializations</h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {specializations.map((spec, index) => (
              <SpecializationCard 
                key={index}
                itemValue={`item-${index}`}
                specialization={spec}
              />
            ))}
          </Accordion>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">My Courses</h2>
          <div className="space-y-3">
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

