// // app/certificate/components/CourseList.tsx
// import { Accordion } from '@/components/shadcn/accordion'
// import { CourseAccordionItem } from './CourseAccordionItem' // Import component mới
// import { Course } from '../mockData'

// interface CourseListProps {
//   courses: Course[]
//   university: string
//   studentName: string
// }

// const CourseList = ({ courses, university, studentName }: CourseListProps) => {
//   return (
//     <section className='mt-6 bg-transparent'>
//       <h2 className='mb-4 text-xl font-bold text-gray-900'>Course Certificates</h2>
//       <p className='mb-6 text-sm text-gray-600'>Earned after completing each course in the Specialization</p>

//       <Accordion type='single' collapsible className='w-full space-y-3'>
//         {courses.map((course, index) => (
//           <CourseAccordionItem
//             key={index}
//             itemValue={`item-${index}`}
//             course={course}
//             university={university}
//             studentName={studentName}
//           />
//         ))}
//       </Accordion>
//     </section>
//   )
// }

// export default CourseList

import React from 'react'

export default function CourseList() {
  return <div>CourseList</div>
}
