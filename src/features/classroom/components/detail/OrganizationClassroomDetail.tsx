'use client'

import { useDeleteClassroomStudentsMutation, useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Separator } from '@/components/shadcn/separator'
import {
  Calendar,
  Users,
  BookOpen,
  Copy,
  Settings,
  UserPlus,
  MoreVertical,
  ArrowLeft,
  Clock,
  GraduationCap,
  Mail,
  Edit,
  Edit2,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import Link from 'next/link'
import Image from 'next/image'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useModal } from '@/providers/ModalProvider'
import { useState } from 'react'

export default function OrganizationClassroomDetail() {
  const { openModal } = useModal()
  const { classroomId } = useParams()
  const { data, isLoading } = useGetClassroomByIdQuery(Number(classroomId))
  const [removeClassroomStudents] = useDeleteClassroomStudentsMutation()
  const classroom = data?.data

  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const toggleSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  const isSelected = (studentId: string) => selectedStudents.includes(studentId)

  const copyClassCode = () => {
    if (classroom?.classCode) {
      navigator.clipboard.writeText(classroom.classCode)
      // You can add a toast notification here
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50/50'>
        <div className='container mx-auto px-6 py-8'>
          <div className='animate-pulse space-y-6'>
            <div className='h-12 w-1/3 rounded bg-slate-200' />
            <div className='h-64 rounded bg-slate-200' />
            <div className='grid gap-6 md:grid-cols-3'>
              <div className='h-96 rounded bg-slate-200' />
              <div className='h-96 rounded bg-slate-200' />
              <div className='h-96 rounded bg-slate-200' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50/50'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold text-slate-900'>Classroom not found</h2>
          <p className='mb-6 text-slate-600'>The classroom you're looking for doesn't exist.</p>
          <Link href='/organization/classroom'>
            <Button>Back to Classrooms</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50/50'>
      <div className='container mx-auto px-6 pb-8'>
        {/* Back Button */}
        <Link href='/organization/classroom'>
          <Button variant='ghost' className='mb-6 -ml-2'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Classrooms
          </Button>
        </Link>

        {/* Header Section */}
        <div className='mb-8'>
          <div className='mb-4 flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-3'>
                <h1 className='text-4xl font-bold text-slate-900'>{classroom.name}</h1>
                <Badge className={`border ${getStatusBadgeClass(classroom.status)}`}>{classroom.status}</Badge>
              </div>
              <div className='flex items-center gap-4 text-slate-600'>
                <div className='flex items-center gap-2'>
                  <GraduationCap className='h-4 w-4' />
                  <span className='text-sm font-medium'>{classroom.grade}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  <span className='text-sm font-medium'>{classroom.numberOfStudents} Students</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-sm'>
                    {format(new Date(classroom.startDate), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(classroom.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex gap-2'>
              {classroom.status === ClassroomStatus.PENDING && (
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => openModal('updateClassroomOrganization', { classroomId: classroom.id, mode: 'basic' })}
                >
                  <MoreVertical className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          {classroom.description && <p className='max-w-3xl text-slate-700'>{classroom.description}</p>}
        </div>

        {/* Main Content Grid */}
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Left Column - Main Info */}
          <div className='space-y-6 md:col-span-2'>
            {/* Curriculum Card */}
            {classroom.curriculum && (
              <Card className='overflow-hidden border border-slate-200 py-4 shadow-sm'>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center justify-between gap-2 text-lg'>
                    <div className='flex items-center gap-2 text-lg'>
                      <BookOpen className='h-5 w-5 text-purple-500' />
                      Curriculum
                    </div>
                    <button
                      onClick={() =>
                        openModal('updateClassroomOrganization', { classroomId: classroom.id, mode: 'curriculum' })
                      }
                    >
                      <Edit2 size={15} />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex gap-4'>
                    {classroom.curriculum.imageUrl && (
                      <div className='relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100'>
                        <Image
                          src={classroom.curriculum.imageUrl}
                          alt={classroom.curriculum.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <div className='flex-1'>
                      <div className='mb-2 flex items-start justify-between gap-2'>
                        <h3 className='text-xl font-bold text-slate-900'>{classroom.curriculum.title}</h3>
                        <Badge variant='secondary' className='border-0 bg-emerald-100 text-emerald-700'>
                          {classroom.curriculum.code}
                        </Badge>
                      </div>
                      <p className='mb-3 text-sm text-slate-600'>{classroom.curriculum.description}</p>
                      <div className='flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1.5 text-slate-600'>
                          <BookOpen className='h-4 w-4' />
                          <span>{classroom.curriculum.courseCount} Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Students Card */}
            <Card className='border border-slate-200 py-4 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <Users className='h-5 w-5 text-blue-600' />
                    Students ({classroom.numberOfStudents})
                  </CardTitle>

                  <div className='flex items-center gap-2'>
                    {selectedStudents.length > 0 && (
                      <span className='text-sm text-slate-500'>{selectedStudents.length} selected</span>
                    )}
                    {selectedStudents.length > 0 && (
                      <Button
                        size='sm'
                        variant={'destructive'}
                        disabled={selectedStudents.length === 0}
                        onClick={() =>
                          openModal('confirm', {
                            message: `Are you sure you want to remove ${selectedStudents.length} student(s)?`,
                            onConfirm: async () => {
                              // gọi API xóa ở đây, truyền selectedStudents
                              console.log('Deleting', selectedStudents)
                              await removeClassroomStudents({
                                classroomId: classroom.id,
                                studentIds: selectedStudents
                              })
                            }
                          })
                        }
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Remove
                      </Button>
                    )}

                    <Button size='sm' onClick={() => openModal('addPeople')}>
                      <UserPlus className='mr-2 h-4 w-4' />
                      Add Student
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {classroom.students && classroom.students.length > 0 ? (
                  <div className='space-y-3'>
                    {classroom.students.map((student, index) => (
                      <div
                        key={student.id}
                        onClick={() => toggleSelect(student.id)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${isSelected(student.id) ? 'border border-blue-300 bg-blue-50' : 'hover:bg-slate-50'} `}
                      >
                        <input
                          type='checkbox'
                          checked={isSelected(student.id)}
                          onChange={() => toggleSelect(student.id)}
                          className='h-4 w-4 accent-blue-600'
                        />

                        <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                          <AvatarImage src={student.imageUrl || student.ImageUrl} />
                          <AvatarFallback className='bg-gradient-to-br from-purple-100 to-blue-500 text-white'>
                            {student.name?.charAt(0).toUpperCase() || student.Name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex-1'>
                          <p className='font-medium text-slate-900'>{student.name || student.email || student.Email}</p>
                          {(student.email || student.Email) && (
                            <p className='text-sm text-slate-500'>{student.email || student.Email}</p>
                          )}
                        </div>

                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='h-4 w-4 text-slate-400' />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='py-12 text-center'>
                    <Users className='mx-auto mb-3 h-12 w-12 text-slate-300' />
                    <h3 className='mb-1 font-semibold text-slate-700'>No students yet</h3>
                    <p className='mb-4 text-sm text-slate-500'>Start building your class by adding students</p>
                    <Button>
                      <UserPlus className='mr-2 h-4 w-4' />
                      Add First Student
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Class Code Card */}
            <Card className='border border-slate-200 py-4 shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Class Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <div className='flex-1 rounded-lg bg-slate-100 px-4 py-3 text-center font-mono text-lg font-bold text-slate-900'>
                      {classroom.classCode}
                    </div>
                    <Button variant='outline' size='icon' onClick={copyClassCode} className='flex-shrink-0'>
                      <Copy className='h-4 w-4' />
                    </Button>
                  </div>
                  <p className='text-center text-xs text-slate-500'>Share this code with students to join the class</p>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Card */}
            {classroom.teacher && (
              <Card className='border border-slate-200 py-4 shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex justify-between text-base'>
                    Teacher{' '}
                    <button
                      onClick={() =>
                        openModal('updateClassroomOrganization', { classroomId: classroom.id, mode: 'teacher' })
                      }
                    >
                      <Edit2 size={15} />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start gap-3'>
                    <Avatar className='h-12 w-12 border-2 border-white shadow-md'>
                      <AvatarImage src={classroom.teacher.imageUrl} />
                      <AvatarFallback className='bg-gradient-to-br from-amber-100 to-amber-500 font-semibold text-white'>
                        {classroom.teacher.name.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <p className='mb-1 font-semibold text-slate-900'>
                        {classroom.teacher.name || classroom.teacher.email}
                      </p>
                      <div className='flex items-center gap-1.5 text-sm text-slate-600'>
                        <Mail className='h-3.5 w-3.5' />
                        <p className='truncate'>{classroom.teacher.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Google Meet Card */}
            <Card className='border border-slate-200 py-4 shadow-sm'>
              <CardContent className='p-4'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded bg-white'>
                        <svg viewBox='0 0 24 24' className='h-5 w-5'>
                          <path
                            fill='#00832d'
                            d='M17,13l3.7-3.7c0.7-0.7,1.9-0.2,1.9,0.7v7.9c0,0.9-1.2,1.5-1.9,0.7L17,15v4c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V5 c0-1.1,0.9-2,2-2h11c1.1,0,2,0.9,2,2v4l3.7-3.7c0.7-0.7,1.9-0.2,1.9,0.7v7.9C22.6,13.2,21.4,13.7,17,13z'
                          />
                        </svg>
                      </div>
                      <span className='font-semibold text-slate-900'>Meet</span>
                    </div>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <MoreVertical className='h-4 w-4 text-slate-600' />
                    </Button>
                  </div>

                  <Button className='w-full border-2 border-slate-300 bg-white text-blue-600 hover:bg-slate-50'>
                    Join
                  </Button>

                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                      <path d='M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z' />
                    </svg>
                    <span>Visible to students</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className='border border-slate-200 py-4 shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600'>Created</span>
                  <span className='text-sm font-medium text-slate-900'>
                    {format(new Date(classroom.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600'>Last Updated</span>
                  <span className='text-sm font-medium text-slate-900'>
                    {format(new Date(classroom.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600'>Duration</span>
                  <span className='text-sm font-medium text-slate-900'>
                    {Math.ceil(
                      (new Date(classroom.endDate).getTime() - new Date(classroom.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
