'use client'
import ClassroomSubHeaderClient from './ClassroomSubHeaderClient'
import { useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'

interface ClassroomSubHeaderServerProps {
  classroomId: number
  locale: string
}

export default function ClassroomSubHeaderServer({ classroomId, locale }: ClassroomSubHeaderServerProps) {
  const { data: classroomData, isLoading } = useGetClassroomByIdQuery(classroomId)

  if (isLoading || !classroomData?.data) return

  return (
    <ClassroomSubHeaderClient
      locale={locale}
      classroom={classroomData?.data}
      curriculumId={classroomData?.data?.curriculum?.id}
    />
  )
}
