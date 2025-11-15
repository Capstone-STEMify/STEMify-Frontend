'use client'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { useParams, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { BookOpen, Clock, User, GraduationCap } from 'lucide-react'
import React from 'react'
import { getLevelBadgeClass } from '@/utils/badgeColor'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDuration } from '@/utils/index'
import { CourseTimeTable } from '@/features/resource/course/components/list/CourseTimeTable'
import { Course, CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'

export const sampleTimeTableData = [
  {
    weekNumber: 1,
    courses: [
      {
        id: 1,
        title: 'Safety in My Online Neighborhood',
        code: 'CS101',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        slug: 'safety-online-neighborhood',
        description: 'Learn about internet safety and digital citizenship basics for young learners.',
        studentTasks: 'Complete online safety quiz',
        duration: 45,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.BEGINNER,
        createdByUserId: 'user-1',
        createdByUserName: 'John Doe',
        ageRangeId: 1,
        createdDate: '2025-01-01',
        ageRangeLabel: '6-8 years',
        lessonIds: [1, 2, 3],
        topicNames: ['Internet Safety', 'Digital Citizenship'],
        skillNames: ['Communication'],
        standardNames: ['ISTE Standard 2'],
        price: 0
      },
      {
        id: 2,
        title: 'Learn to Drag and Drop',
        code: 'CS102',
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
        slug: 'drag-and-drop',
        description: 'Master basic mouse skills and drag-and-drop interactions.',
        studentTasks: 'Practice drag and drop exercises',
        duration: 30,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.BEGINNER,
        createdByUserId: 'user-1',
        createdByUserName: 'John Doe',
        ageRangeId: 1,
        createdDate: '2025-01-02',
        ageRangeLabel: '6-8 years',
        lessonIds: [4, 5],
        topicNames: ['Mouse Skills', 'UI Interaction'],
        skillNames: ['Motor Skills'],
        standardNames: [],
        price: 0
      },
      {
        id: 3,
        title: 'Happy Maps',
        code: 'CS103',
        slug: 'happy-maps',
        description: 'Introduction to sequencing and algorithms through map navigation.',
        studentTasks: 'Create simple path sequences',
        duration: 40,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.BEGINNER,
        createdByUserId: 'user-1',
        createdByUserName: 'John Doe',
        ageRangeId: 1,
        createdDate: '2025-01-03',
        ageRangeLabel: '6-8 years',
        lessonIds: [6, 7, 8],
        topicNames: ['Algorithms', 'Sequencing'],
        skillNames: ['Problem Solving', 'Logic'],
        standardNames: ['CSTA K-2'],
        price: 0
      },
      {
        id: 4,
        title: 'Sequencing with Scrat',
        code: 'CS104',
        imageUrl: 'https://images.unsplash.com/photo-1596496181848-3091d4878b24?w=400',
        slug: 'sequencing-scrat',
        description: 'Learn programming sequences with fun characters.',
        studentTasks: 'Complete sequencing challenges',
        duration: 35,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.BEGINNER,
        createdByUserId: 'user-1',
        createdByUserName: 'John Doe',
        ageRangeId: 1,
        createdDate: '2025-01-04',
        ageRangeLabel: '6-8 years',
        lessonIds: [9, 10],
        topicNames: ['Programming', 'Sequences'],
        skillNames: ['Computational Thinking'],
        standardNames: [],
        price: 0
      },
      {
        id: 5,
        title: 'Programming with Scratch',
        code: 'CS105',
        imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
        slug: 'programming-scratch',
        description: 'Introduction to block-based programming with Scratch.',
        studentTasks: 'Build first Scratch project',
        duration: 50,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.BEGINNER,
        createdByUserId: 'user-1',
        createdByUserName: 'John Doe',
        ageRangeId: 1,
        createdDate: '2025-01-05',
        ageRangeLabel: '6-8 years',
        lessonIds: [11, 12, 13],
        topicNames: ['Scratch', 'Block Programming'],
        skillNames: ['Coding', 'Creativity'],
        standardNames: ['CSTA K-2'],
        price: 0
      }
    ]
  },
  {
    weekNumber: 2,
    courses: [
      {
        id: 6,
        title: 'Programming with Rey and BB-8',
        code: 'CS201',
        imageUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400',
        slug: 'rey-bb8-programming',
        description: 'Star Wars themed programming adventures.',
        studentTasks: 'Complete coding missions',
        duration: 45,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.INTERMEDIATE,
        createdByUserId: 'user-2',
        createdByUserName: 'Jane Smith',
        ageRangeId: 2,
        createdDate: '2025-01-06',
        ageRangeLabel: '8-10 years',
        lessonIds: [14, 15, 16],
        topicNames: ['Programming', 'Logic'],
        skillNames: ['Problem Solving'],
        standardNames: [],
        price: 0
      },
      {
        id: 7,
        title: 'Happy Loops',
        code: 'CS202',
        slug: 'happy-loops',
        description: 'Understanding loops and repetition in programming.',
        studentTasks: 'Create programs with loops',
        duration: 40,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.INTERMEDIATE,
        createdByUserId: 'user-2',
        createdByUserName: 'Jane Smith',
        ageRangeId: 2,
        createdDate: '2025-01-07',
        ageRangeLabel: '8-10 years',
        lessonIds: [17, 18],
        topicNames: ['Loops', 'Iteration'],
        skillNames: ['Computational Thinking'],
        standardNames: ['CSTA K-2'],
        price: 0
      },
      {
        id: 8,
        title: 'Loops with Scratch',
        code: 'CS203',
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
        slug: 'loops-scratch',
        description: 'Advanced loop concepts in Scratch programming.',
        studentTasks: 'Build loop-based animations',
        duration: 45,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.INTERMEDIATE,
        createdByUserId: 'user-2',
        createdByUserName: 'Jane Smith',
        ageRangeId: 2,
        createdDate: '2025-01-08',
        ageRangeLabel: '8-10 years',
        lessonIds: [19, 20, 21],
        topicNames: ['Scratch', 'Loops'],
        skillNames: ['Coding'],
        standardNames: [],
        price: 0
      }
    ]
  },
  {
    weekNumber: 3,
    courses: [
      {
        id: 9,
        title: 'The Big Event Jr.',
        code: 'CS301',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400',
        slug: 'big-event-jr',
        description: 'Introduction to event-driven programming concepts.',
        studentTasks: 'Create interactive programs',
        duration: 50,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.INTERMEDIATE,
        createdByUserId: 'user-3',
        createdByUserName: 'Mike Johnson',
        ageRangeId: 2,
        createdDate: '2025-01-09',
        ageRangeLabel: '8-10 years',
        lessonIds: [22, 23, 24],
        topicNames: ['Events', 'User Interaction'],
        skillNames: ['Programming', 'Design'],
        standardNames: ['CSTA K-2'],
        price: 0
      },
      {
        id: 10,
        title: 'Mini-Project: On the Move with Play Lab',
        code: 'CS302',
        slug: 'playlab-project',
        description: 'Create an interactive animation project.',
        studentTasks: 'Complete final project',
        duration: 60,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.ADVANCED,
        createdByUserId: 'user-3',
        createdByUserName: 'Mike Johnson',
        ageRangeId: 2,
        createdDate: '2025-01-10',
        ageRangeLabel: '8-10 years',
        lessonIds: [25, 26],
        topicNames: ['Project', 'Animation'],
        skillNames: ['Creativity', 'Coding'],
        standardNames: [],
        price: 0
      },
      {
        id: 11,
        title: 'End of Course Project',
        code: 'CS303',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        slug: 'end-course-project',
        description: 'Final capstone project showcasing all learned skills.',
        studentTasks: 'Present final project',
        duration: 90,
        status: CourseStatus.PUBLISHED,
        level: CourseLevel.ADVANCED,
        createdByUserId: 'user-3',
        createdByUserName: 'Mike Johnson',
        ageRangeId: 2,
        createdDate: '2025-01-11',
        ageRangeLabel: '8-10 years',
        lessonIds: [27, 28, 29, 30],
        topicNames: ['Capstone', 'Portfolio'],
        skillNames: ['All Skills'],
        standardNames: ['CSTA K-2', 'ISTE Standard 6'],
        price: 0
      }
    ]
  }
]
export default function ClassroomCourseList() {
  const { classroomId } = useParams()
  const searchParams = useSearchParams()
  const curriculumId = searchParams.get('curriculumId')
  const { data, isLoading } = useGetCurriculumByIdQuery(Number(curriculumId))

  const courses = data?.data.courses || []
  const totalCount = data?.data.courseCount || 0

  if (isLoading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className='h-96 animate-pulse rounded-xl bg-slate-100' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-6 pb-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='my-6 flex items-center justify-between'>
          <div className='flex gap-6'>
            <h2 className='text-3xl font-bold text-slate-900'>Courses</h2>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className='flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50'>
          <BookOpen className='mb-4 h-16 w-16 text-slate-400' />
          <h3 className='mb-2 text-xl font-semibold text-slate-700'>No courses found</h3>
          <p className='mb-6 text-slate-500'>Start by adding courses to this curriculum</p>
          <Button className='bg-blue-600 hover:bg-blue-700'>Add Course</Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {courses.map((course) => (
            <CardLayout
              key={course.id}
              href={`/resource/course/${course.id}`}
              imageSrc={course.imageUrl}
              imageRatio='aspect-video'
              badge={
                <Badge className={getLevelBadgeClass(course.level.toUpperCase() as CourseLevel)}>{course.level}</Badge>
              }
              action={
                <Badge variant='secondary' className='flex items-center gap-1 py-0.5'>
                  <Clock className='h-3 w-3 text-blue-600' />
                  <span className='text-xs'>{formatDuration(course.duration)}</span>
                </Badge>
              }
              footer={<div className='flex w-full items-center gap-2 border-t border-slate-100 pt-2'></div>}
            >
              <div>
                <div className='flex flex-col justify-between space-y-2'>
                  <div className='flex justify-between'>
                    <h3 className='line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600'>
                      {course.title}
                    </h3>
                    <Badge variant='secondary' className='flex items-center py-0.5 font-mono text-xs'>
                      {course.code}
                    </Badge>
                  </div>
                  <div className='mb-1 flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4 text-amber-600' />
                    <p className='text-xs font-semibold text-slate-700'>{course.ageRangeLabel} years old</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <p className='line-clamp-3 text-sm text-slate-600'>{course.description}</p>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      )}

      <div className='mb-8'>
        <div className='my-6 flex items-center justify-between'>
          <div className='flex gap-6'>
            <h2 className='text-3xl font-bold text-slate-900'>Course Time Table</h2>
          </div>
        </div>
      </div>
      <CourseTimeTable weeks={sampleTimeTableData} />
    </div>
  )
}
