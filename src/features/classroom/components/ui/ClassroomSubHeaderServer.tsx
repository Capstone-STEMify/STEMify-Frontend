'use client'
import { useEffect, useState } from 'react'
import ClassroomSubHeaderClient from './ClassroomSubHeaderClient'
import { Classroom } from '@/features/classroom/types/classroom.type'

interface ClassroomSubHeaderServerProps {
  classroomId: number
  locale: string
}

export default function ClassroomSubHeaderServer({ classroomId, locale }: ClassroomSubHeaderServerProps) {
  const [classroom, setClassroom] = useState<Classroom | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classrooms/${classroomId}`)
      const data = await res.json()
      setClassroom(data.data)
    }
    load()
  }, [classroomId])

  if (!classroom) return <div>Loading...</div>

  return (
    <ClassroomSubHeaderClient
      locale={locale}
      classroomId={classroomId}
      curriculumId={classroom.curriculum?.id}
      classroomName={classroom.name}
    />
  )
}
