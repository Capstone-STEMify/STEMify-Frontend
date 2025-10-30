'use client'

import { useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'
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
  Edit
} from 'lucide-react'
import { format } from 'date-fns'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import Link from 'next/link'
import Image from 'next/image'
import { getStatusBadgeClass } from '@/utils/badgeColor'

export default function ClassroomDetail() {
  const { classroomId } = useParams()
  const { data, isLoading } = useGetClassroomByIdQuery(Number(classroomId))
  const classroom = data?.data

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
          <Link href='/classroom'>
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
        <Link href='/classroom'>
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
              <Button variant='outline' size='icon'>
                <Settings className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon'>
                <MoreVertical className='h-4 w-4' />
              </Button>
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
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <BookOpen className='h-5 w-5 text-purple-600' />
                    Curriculum
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
                        <Badge variant='secondary' className='border-0 bg-purple-100 text-purple-700'>
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
                      <Button className='mt-4 bg-purple-600 hover:bg-purple-700'>View Curriculum</Button>
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
                  <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {classroom.students && classroom.students.length > 0 ? (
                  <div className='space-y-3'>
                    {classroom.students.map((student, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50'
                      >
                        <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                          <AvatarImage src={student.imageUrl || student.ImageUrl} />
                          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 text-white'>
                            {student.name?.charAt(0).toUpperCase() || student.Name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <p className='font-medium text-slate-900'>
                            {student.name || student.Name || 'Unknown Student'}
                          </p>
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
                    <Button className='bg-blue-600 hover:bg-blue-700'>
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
                  <CardTitle className='text-base'>Teacher</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start gap-3'>
                    <Avatar className='h-12 w-12 border-2 border-white shadow-md'>
                      <AvatarImage src={classroom.teacher.ImageUrl} />
                      <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white'>
                        {classroom.teacher.Name.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <p className='mb-1 font-semibold text-slate-900'>{classroom.teacher.Name}</p>
                      <div className='flex items-center gap-1.5 text-sm text-slate-600'>
                        <Mail className='h-3.5 w-3.5' />
                        <p className='truncate'>{classroom.teacher.Email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Actions Card */}
            <Card className='border border-slate-200 py-4 shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <Button variant='outline' className='w-full justify-start' size='sm'>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit Classroom
                </Button>
                <Button variant='outline' className='w-full justify-start' size='sm'>
                  <UserPlus className='mr-2 h-4 w-4' />
                  Invite Students
                </Button>
                <Button
                  variant='outline'
                  className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700'
                  size='sm'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  Archive Classroom
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
