'use client'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { AssignmentList } from '@/features/assignment/components/table/AssignmentList'
import { useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'
import ClassroomCourseList from '@/features/classroom/components/detail/ClassroomCourseList'
import StudentClassroomDetail from '@/features/classroom/components/detail/StudentClassroomDetails'
import ClassroomOverview from '@/features/classroom/components/overview/ClassroomOverview'
import ClassroomSubHeader from '@/features/classroom/components/ui/ClassroomSubHeader'
import { useSearchCurriculumEnrollmentQuery } from '@/features/enrollment/api/curriculumEnrollmentApi'
import TeacherQuiz from '@/features/quiz/components/TeacherQuiz'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType } from '@/types/userRole'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

export type ClassroomNavItems = 'overview' | 'course' | 'quiz' | 'assignment'

export default function ClassroomDetailPage() {
  const { classroomId } = useParams()
  const auth = useAppSelector((state) => state.auth)
  const currentRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const [currentTab, setCurrentTab] = React.useState<ClassroomNavItems>('overview')

  const { data: classroomData, isLoading } = useGetClassroomByIdQuery(Number(classroomId))
  const { data: curriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    {
      curriculumId: classroomData?.data.curriculum.id,
      studentId: auth?.user?.userId || '',
      classroomId: Number(classroomId),
      pageNumber: 1,
      pageSize: 20
    },
    { skip: !auth.user?.userId || !classroomData?.data.curriculum.id || currentRole !== LicenseType.STUDENT }
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
        <StudentClassroomDetail
          curriculumEnrollment={curriculumEnrollment?.data.items[0]}
          setCurrentTab={setCurrentTab}
        />
      ) : null}
      {currentTab === 'course' ? (
        <div>
          <ClassroomCourseList
            curriculum={classroomData.data.curriculum}
            curriculumEnrollment={curriculumEnrollment?.data.items[0]}
            isStudentView={currentRole === LicenseType.STUDENT}
          />
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
    </div>
  )
}
