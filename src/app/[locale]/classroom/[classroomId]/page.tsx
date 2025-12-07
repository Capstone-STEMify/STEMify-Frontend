'use client'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { AssignmentList } from '@/features/assignment/components/table/AssignmentList'
import { useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'
import StudentClassroomDetail from '@/features/classroom/components/detail/StudentClassroomDetails'
import StudentClassList from '@/features/classroom/components/list/StudentClassList'
import ClassroomOverview from '@/features/classroom/components/overview/ClassroomOverview'
import { ClassroomSchedule } from '@/features/classroom/components/schedule/ClassroomSchedule'
import ClassroomSubHeader from '@/features/classroom/components/ui/ClassroomSubHeader'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import TeacherQuiz from '@/features/quiz/components/TeacherQuiz'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType } from '@/types/userRole'
import { useParams } from 'next/navigation'
import React from 'react'

export type ClassroomNavItems = 'overview' | 'course' | 'quiz' | 'assignment' | 'student'

export default function ClassroomDetailPage() {
  const { classroomId } = useParams()
  const { selectedOrgUserId } = useAppSelector((state) => state.selectedOrganization)
  const currentRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const [currentTab, setCurrentTab] = React.useState<ClassroomNavItems>('overview')

  const { data: classroomData, isLoading } = useGetClassroomByIdQuery(Number(classroomId))
  const { data: courseEnrollment } = useSearchCourseEnrollmentQuery(
    {
      courseId: classroomData?.data.course.id,
      studentId: selectedOrgUserId!,
      classroomId: Number(classroomId),
      pageNumber: 1,
      pageSize: 20
    },
    { skip: !selectedOrgUserId || !classroomData?.data.course.id || currentRole !== LicenseType.STUDENT }
  )
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }
  if (!classroomData) {
    return <SEmpty title='Classroom not found' />
  }

  return (
    <div>
      <ClassroomSubHeader classroom={classroomData?.data} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'overview' && currentRole === LicenseType.TEACHER ? <ClassroomOverview /> : null}
      {currentTab === 'overview' && currentRole === LicenseType.STUDENT ? (
        <StudentClassroomDetail courseEnrollment={courseEnrollment?.data.items[0]} />
      ) : null}
      {currentTab === 'course' ? (
        <div>
          <ClassroomSchedule classroomId={Number(classroomId)} />
        </div>
      ) : null}
      {currentTab === 'quiz' ? (
        <div>
          <TeacherQuiz />
        </div>
      ) : null}
      {currentTab === 'assignment' ? (
        <div>
          <AssignmentList />
        </div>
      ) : null}
      {currentTab === 'student' ? (
        <div>
          <StudentClassList />
        </div>
      ) : null}
    </div>
  )
}
