// app/certificate/components/CourseAccordionItem.tsx
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'
import { Card, CardContent } from '@/components/shadcn/card'
import { CourseEnrollment } from '@/features/enrollment/types/enrollment.type'
import { CheckCircle2, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CourseAccordionItemProps {
  courseEnrollment: CourseEnrollment
  studentName: string
  itemValue: string
}

export const CourseAccordionItem = ({ courseEnrollment, studentName, itemValue }: CourseAccordionItemProps) => {
  return (
    <AccordionItem value={itemValue} className='border-b-0'>
      <Card className='overflow-hidden p-4 shadow-sm transition-all hover:shadow-md'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <CheckCircle2 className='h-6 w-6 flex-shrink-0 text-green-600' />
            <Image
              src={courseEnrollment.coverImageUrl ?? ''}
              alt='Course Logo'
              width={64}
              height={64}
              className='hidden sm:block'
            />
            <div>
              <h4 className='font-bold text-gray-900'>{courseEnrollment.courseTitle}</h4>
              <p className='text-sm text-gray-500'>Course • Grade Achieved: {courseEnrollment.finalScore ?? 0}%</p>
              <p className='text-sm text-gray-500'>
                Completed by <span>{studentName}</span> on{' '}
                <span>{new Date(courseEnrollment.completedAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
          <div className='ml-4 hidden items-center gap-4 md:flex'>
            <Link
              href='#'
              className='rounded-md border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50'
            >
              View certificate
            </Link>
          </div>
        </div>
      </Card>
    </AccordionItem>
  )
}
