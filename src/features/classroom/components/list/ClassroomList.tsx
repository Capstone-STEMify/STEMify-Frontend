'use client'

import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent } from '@/components/shadcn/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Calendar, Users, BookOpen, Clock, GraduationCap } from 'lucide-react'
import { format } from 'date-fns'
import React from 'react'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import Link from 'next/link'

export default function ClassroomList() {
  const { data, isLoading } = useSearchClassroomsQuery({ status: ClassroomStatus.PENDING })
  const classrooms = data?.data.items || []

  if (isLoading) {
    return (
      <div>
        <h2 className='mb-6 text-2xl font-bold text-gray-900'>My Classrooms</h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-48 animate-pulse rounded-xl bg-gray-200' />
          ))}
        </div>
      </div>
    )
  }

  if (classrooms.length === 0) {
    return null
  }

  return (
    <div>
      {/* Header */}
      <div className='mb-6 flex items-center justify-start gap-3'>
        <h2 className='text-2xl font-bold text-gray-900'>My Classrooms</h2>
        <Badge className='bg-emerald-100 text-sm font-semibold text-emerald-700'>{classrooms.length}</Badge>
      </div>

      {/* Classroom Grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {classrooms.map((classroom) => (
          <Link key={classroom.id} href={`/classroom/${classroom.id}/overview`}>
            <Card className='group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg'>
              {/* Image Header */}
              <div className='relative h-32 w-full overflow-hidden bg-gradient-to-br from-sky-200 to-blue-500'>
                {classroom.curriculum?.imageUrl ? (
                  <img
                    src={classroom.curriculum.imageUrl}
                    alt={classroom.name}
                    className='h-full w-full object-cover transition-transform group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center'>
                    <GraduationCap className='h-12 w-12 text-white/60' />
                  </div>
                )}

                {/* Status Badge */}
                <div className='absolute top-3 right-3'>
                  <Badge className={`border-0 text-xs shadow-md ${getStatusBadgeClass(classroom.status)}`}>
                    {classroom.status}
                  </Badge>
                </div>
              </div>

              <CardContent className='p-4'>
                <div className='space-y-3'>
                  {/* Title & Grade */}
                  <div className='flex items-start justify-between gap-2'>
                    <h3 className='text-md line-clamp-2 flex-1 font-bold text-gray-900'>{classroom.name}</h3>
                    <Badge variant='secondary' className='shrink-0 bg-gray-100 text-xs font-medium'>
                      {classroom.grade}
                    </Badge>
                  </div>

                  {/* Curriculum */}
                  {classroom.curriculum && (
                    <div className='text-md flex items-center gap-2 text-gray-600'>
                      <BookOpen className='h-4 w-4 shrink-0 text-purple-500' />
                      <span className='text-md line-clamp-1'>{classroom.curriculum.title}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Clock className='h-3.5 w-3.5 shrink-0' />
                    <span>
                      {format(new Date(classroom.startDate), 'MMM dd')} -{' '}
                      {format(new Date(classroom.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {/* Students */}
                  <div className='flex items-center justify-between border-t border-gray-100 pt-3'>
                    {/* Student Avatars */}
                    {classroom.students && classroom.students.length > 0 ? (
                      <div className='flex -space-x-2'>
                        {classroom.students.slice(0, 3).map((student, index) => (
                          <Avatar key={index} className='h-7 w-7 border-2 border-white'>
                            <AvatarImage src={student.imageUrl || student.ImageUrl} />
                            <AvatarFallback className='bg-gradient-to-br from-blue-400 to-purple-400 text-xs text-white'>
                              {student.name?.charAt(0).toUpperCase() || student.Name?.charAt(0).toUpperCase() || 'S'}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {classroom.students.length > 3 && (
                          <div className='flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-semibold text-gray-600'>
                            +{classroom.students.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='flex items-center gap-1.5 text-gray-400'>
                        <Users className='h-3.5 w-3.5' />
                        <span className='text-sm'>No students</span>
                      </div>
                    )}

                    {/* Student Count */}
                    <div className='flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1'>
                      <Users className='h-3.5 w-3.5 text-blue-600' />
                      <span className='text-xs font-semibold text-blue-600'>{classroom.numberOfStudents}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
