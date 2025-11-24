'use client'

import * as React from 'react'
import { Download, MoreVertical, CheckCircle2, Circle, Clock, ChevronDown } from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn/accordion'

import { useGetClassroomByIdQuery, useGetClassroomStudentProgressQuery } from '@/features/classroom/api/classroomApi'
import { StudentProgressItem } from '@/features/classroom/types/classroom.type'

interface CourseType {
  id: number
  title: string
  code: string
}

interface StudentProgressStatisticProps {
  classroomId: number
  courses: CourseType[]
}

const COLUMN_WIDTH = 'w-[70px] min-w-[70px]'

export function StudentProgressStatistic({ classroomId, courses }: StudentProgressStatisticProps) {
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>('')

  const [currentLessonId, setCurrentLessonId] = React.useState<string>('')

  const { data: classroomRes } = useGetClassroomByIdQuery(classroomId, {
    skip: !classroomId
  })
  const curriculum = classroomRes?.data?.curriculum

  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(String(courses[0].id))
    }
  }, [courses, selectedCourseId])

  const { data: progressRes, isFetching } = useGetClassroomStudentProgressQuery(
    { classroomId, courseId: Number(selectedCourseId) },
    { skip: !classroomId || !selectedCourseId }
  )

  const progressData = progressRes?.data
  const lessons = progressData?.lessons || []
  const students = progressData?.StudentProgress || []

  React.useEffect(() => {
    if (lessons.length > 0) {
      const exists = lessons.find((l) => String(l.lessonId) === currentLessonId)
      if (!currentLessonId || !exists) {
        setCurrentLessonId(String(lessons[0].lessonId))
      }
    }
  }, [lessons, currentLessonId])

  const currentLesson = lessons.find((l) => String(l.lessonId) === currentLessonId)

  const renderSectionStatus = (student: StudentProgressItem, lessonId: number, sectionId: number) => {
    const lessonProg = student.lessonProgresses?.find((l) => l.lessonId === lessonId)
    if (!lessonProg) return <Circle className='mx-auto h-4 w-4 text-slate-200' />

    const sectionProg = lessonProg.sectionProgresses?.find((s) => s.sectionId === sectionId)
    if (!sectionProg) return <Circle className='mx-auto h-4 w-4 text-slate-200' />

    switch (sectionProg.status) {
      case 'Completed':
      case 'Passed':
        return <CheckCircle2 className='mx-auto h-4 w-4 text-green-500' />
      case 'InProgress':
        return <Clock className='mx-auto h-4 w-4 text-blue-500' />
      case 'Failed':
        return <Circle className='mx-auto h-4 w-4 border-red-400 text-red-400' />
      default:
        return <Circle className='mx-auto h-4 w-4 text-slate-300' />
    }
  }

  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm md:p-8 mt-8'>
      <header className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-semibold'>Students</h2>
          <div className='flex items-center gap-2 text-sm'>
            <span>Lessons in</span>

            <Select value={curriculum?.code || ''} disabled>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder={curriculum?.title || 'Curriculum'} />
              </SelectTrigger>
              <SelectContent>
                {curriculum && <SelectItem value={curriculum.code}>{curriculum.title}</SelectItem>}
              </SelectContent>
            </Select>

            <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={courses.length === 0}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select course' />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {course.title} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon'>
            <Download className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='icon'>
            <MoreVertical className='h-4 w-4' />
          </Button>
        </div>
      </header>

      {isFetching && !currentLesson ? (
        <div className='py-10 text-center text-slate-500'>Loading data...</div>
      ) : !currentLesson ? (
        <div className='rounded-lg border py-10 text-center text-slate-500'>No lessons found for this course.</div>
      ) : (
        <div className='overflow-hidden rounded-lg border bg-white'>
          <div className='overflow-x-auto'>
            <Table className='min-w-[900px]'>
              <TableHeader>
                <TableRow>
                  <TableHead
                    rowSpan={2}
                    className='bg-background sticky left-0 z-20 w-[250px] min-w-[250px] border-r align-top shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]'
                  >
                    <div className='flex flex-col gap-2 px-2 py-4'>
                      <label className='text-sm font-medium'>Sort by:</label>
                      <Select defaultValue='display-name'>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='display-name'>Display name</SelectItem>
                          <SelectItem value='first-name'>First name</SelectItem>
                          <SelectItem value='last-name'>Last name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>

                  <TableHead
                    colSpan={Math.max(currentLesson.sectionIds.length, 1)}
                    className='h-[88px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 align-middle'
                  >
                    <div className='flex h-full w-full items-center px-2'>
                      <Select value={currentLessonId} onValueChange={setCurrentLessonId}>
                        <SelectTrigger className='h-full w-full cursor-pointer justify-start gap-2 rounded-none border-none bg-transparent pl-4 text-lg font-semibold text-white shadow-none hover:text-white'>
                          <SelectValue placeholder='Select a lesson' />
                        </SelectTrigger>
                        <SelectContent>
                          {lessons.map((lesson) => (
                            <SelectItem key={lesson.lessonId} value={String(lesson.lessonId)}>
                              {lesson.lessonTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                </TableRow>

                <TableRow>
                  {currentLesson.sectionIds.map((sectionId) => (
                    <TableHead
                      key={sectionId}
                      className={`border-r bg-slate-50 p-2 text-center text-xs font-normal text-slate-600 ${COLUMN_WIDTH}`}
                    >
                      Sec {sectionId}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.studentId} className='group hover:bg-slate-50/50'>
                      <TableCell className='bg-background sticky left-0 z-10 border-r group-hover:bg-slate-50'>
                        <Accordion type='single' collapsible className='w-full'>
                          <AccordionItem value={student.studentId} className='border-b-0'>
                            <AccordionTrigger className='p-2 py-4 hover:no-underline'>
                              <div className='flex flex-col items-start text-left'>
                                <span className='font-medium text-slate-700'>{student.studentName}</span>
                                <span className='text-xs font-normal text-slate-400'>
                                  ID: {student.studentId.substring(0, 6)}...
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className='px-2 text-xs text-slate-500'>Details for {student.studentName}</div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>

                      {currentLesson.sectionIds.map((sectionId) => (
                        <TableCell
                          key={`${student.studentId}-${sectionId}`}
                          className={`h-[70px] border-r p-2 text-center ${COLUMN_WIDTH}`}
                        >
                          {renderSectionStatus(student, currentLesson.lessonId, sectionId)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={currentLesson.sectionIds.length + 1}
                      className='h-24 text-center text-slate-500'
                    >
                      No students enrolled in this class.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
