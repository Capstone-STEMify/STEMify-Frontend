// app/accomplishments/components/LikedCoursesBanner.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import Link from 'next/link'

interface LikedCoursesBannerProps {
  courses: string[]
}

export const Banner = ({ courses }: LikedCoursesBannerProps) => {
  return (
    <Card className='bg-blue-600 text-white'>
      <CardHeader>
        <CardTitle>Liked these courses? Say thanks to your instructors!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2'>
          {courses.map((course, index) => (
            <Link href='#' key={index} className='hover:underline'>
              {course}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
