// app/certificate/components/CourseList.tsx
import { Accordion } from '@/components/shadcn/accordion'
import { CourseAccordionItem } from './CourseAccordionItem' // Import component mới
import { CourseEnrollment } from '@/features/enrollment/types/enrollment.type'

interface CourseListProps {
  courseEnrollments: CourseEnrollment[]
  studentName: string
}

const CourseList = ({ courseEnrollments, studentName }: CourseListProps) => {
  return (
    <section className='mt-6 bg-transparent'>
      <h2 className='mb-4 text-xl font-bold text-gray-900'>Course Certificates</h2>
      <p className='mb-6 text-sm text-gray-600'>Earned after completing each course in the Specialization</p>

      <Accordion type='single' collapsible className='w-full space-y-3'>
        {courseEnrollments.map((courseEnrollment, index) => (
          <CourseAccordionItem key={index} itemValue={`item-${index}`} courseEnrollment={courseEnrollment} studentName={studentName} />
        ))}
      </Accordion>
    </section>
  )
}

export default CourseList
