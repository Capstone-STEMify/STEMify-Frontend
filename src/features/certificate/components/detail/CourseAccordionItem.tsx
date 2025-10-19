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
      <Card className='overflow-hidden shadow-sm transition-all hover:shadow-md'>
        <AccordionTrigger className='p-4 text-left hover:no-underline'>
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
                <p className='text-sm text-gray-500'>Course • Grade: 95%</p>
              </div>
            </div>
            <div className='ml-4 hidden items-center gap-4 md:flex'>
              <Link
                href='#'
                className='rounded-md border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50'
              >
                View certificate
              </Link>
              <MoreHorizontal className='h-5 w-5 cursor-pointer text-gray-500' />
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className='border-t bg-gray-50/50 px-6 pt-6'>
            <h3 className='mb-4 text-2xl text-blue-700'>{courseEnrollment.courseTitle}</h3>
            <p className='mt-2 text-sm text-gray-700'>Stemify</p>

            <div className='mt-2 space-y-1 text-sm text-gray-800'>
              <p>
                Completed by {studentName} by <span className='font-semibold'>{courseEnrollment.completedAt}</span>
              </p>
              <p>
                Grade Achieved: <span className='font-semibold'>95%</span>
              </p>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  )
}
