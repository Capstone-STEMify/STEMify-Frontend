'use client'
import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useGetClassroomByIdQuery } from '../../api/classroomApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { DataTable } from '@/components/shared/data-table/data-table'
import { StudentClassItem, useStudentClassColumns } from './table/StudentClassColumn'
import StudentDetailModal from '../detail/StudentDetailModal'
import { useTranslations } from 'next-intl'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import { StudentProgressStatistic } from '@/features/dashboard/components/table/StudentProgressStatistic'

export default function StudentClassList() {
  const t = useTranslations('classroom.studentClassroom')
  const params = useParams()
  const classroomId = Number(params.classroomId)

  const { data: classroomRes, isLoading: isLoadingClassroom } = useGetClassroomByIdQuery(classroomId, {
    skip: !classroomId
  })

  const classroom = classroomRes?.data
  const courseId = classroom?.course?.id

  const { data: courseRes, isLoading: isLoadingCourse } = useGetCourseByIdQuery(courseId!, {
    skip: !courseId
  })

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: classroomData, isLoading } = useGetClassroomByIdQuery(classroomId)

  const handleViewDetail = (student: StudentClassItem) => {
    setSelectedStudentId(student.id)
    setIsModalOpen(true)
  }

  const handleRemoveStudent = (student: StudentClassItem) => {
    console.log('Remove:', student.id)
  }

  const columns = useStudentClassColumns({
    onViewDetail: handleViewDetail,
    onRemoveStudent: handleRemoveStudent
  })

  const studentData: StudentClassItem[] = useMemo(() => {
    return (classroomData?.data.students ?? []) as StudentClassItem[]
  }, [classroomData])

  const lessons = courseRes?.data?.lessons || []

  if (isLoading) return <LoadingComponent />

  return (
    <div className='mx-auto my-10 w-full max-w-7xl space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>{t('list.title')}</h2>
          <p className='text-muted-foreground mt-1 text-sm'>{t('list.description')}</p>
        </div>
        <div className='bg-secondary/50 rounded-md px-3 py-1 text-sm font-medium'>
          {t('list.number')} {studentData.length}
        </div>
      </div>

      <DataTable columns={columns} data={studentData} placeholder='Chưa có học sinh nào trong lớp này.' />

      <StudentProgressStatistic classroomId={classroomId} courses={lessons} />

      {selectedStudentId && (
        <StudentDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          studentId={selectedStudentId}
          classroomId={classroomId}
        />
      )}
    </div>
  )
}
