'use client'
import CardLayout from '@/components/shared/card/CardLayout'
import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { Calendar, Users, BookOpen, MoreVertical, Clock } from 'lucide-react'
import { format } from 'date-fns'
import React from 'react'
import { getStatusBadgeClass } from '@/utils/badgeColor'

export default function ClassroomList() {
  const { data, isLoading } = useSearchClassroomsQuery({ status: ClassroomStatus.PENDING })
  const classrooms = data?.data.items || []

  if (isLoading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='h-96 animate-pulse rounded-xl bg-slate-100' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-slate-900'>Classrooms</h2>
          <p className='mt-1 text-slate-600'>
            {classrooms.length} {classrooms.length === 1 ? 'classroom' : 'classrooms'} found
          </p>
        </div>
        {/* <Button className='bg-blue-600 hover:bg-blue-700'>
          <span className='mr-2'>+</span>
          Create Classroom
        </Button> */}
      </div>

      {/* Classroom Grid */}
      {classrooms.length === 0 ? (
        <div className='flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50'>
          <BookOpen className='mb-4 h-16 w-16 text-slate-400' />
          <h3 className='mb-2 text-xl font-semibold text-slate-700'>No classrooms found</h3>
          <p className='mb-6 text-slate-500'>Get started by creating your first classroom</p>
          <Button className='bg-blue-600 hover:bg-blue-700'>Create Classroom</Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {classrooms.map((classroom) => (
            <CardLayout
              key={classroom.id}
              imageSrc={classroom.curriculum?.imageUrl || '/images/fallback.png'}
              alt={classroom.name}
              href={`/classroom/${classroom.id}/overview`}
              imageRatio='aspect-video'
              badge={<Badge className={`border ${getStatusBadgeClass(classroom.status)}`}>{classroom.status}</Badge>}
              action={
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full bg-white/90 hover:bg-white'
                  onClick={(e) => {
                    e.preventDefault()
                    // Handle menu action
                  }}
                >
                  <MoreVertical className='h-4 w-4 text-slate-600' />
                </Button>
              }
            >
              {/* Classroom Info */}
              <div className='space-y-3'>
                {/* Title & Grade on same line */}
                <div className='flex items-center justify-between gap-2'>
                  <h3 className='line-clamp-1 flex-1 text-lg font-bold text-slate-900'>{classroom.name}</h3>
                  <Badge variant='secondary' className='shrink-0 border-0 bg-slate-100 text-xs text-slate-700'>
                    {classroom.grade}
                  </Badge>
                </div>

                {/* Description */}
                {classroom.description && (
                  <p className='line-clamp-2 text-sm text-slate-600'>{classroom.description}</p>
                )}

                {/* Curriculum */}
                {classroom.curriculum && (
                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <BookOpen className='h-4 w-4 text-purple-600' />
                    <span className='line-clamp-1'>{classroom.curriculum.title}</span>
                  </div>
                )}

                {/* Date Range */}
                <div className='flex items-center gap-2 text-sm text-slate-600'>
                  <Calendar className='h-4 w-4 text-blue-600' />
                  <span>
                    {format(new Date(classroom.startDate), 'MMM dd')} -{' '}
                    {format(new Date(classroom.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>

                {/* Students */}
                <div className='flex items-center justify-between border-t border-slate-100 pt-2'>
                  {/* Student Avatars */}
                  <div className='flex items-center gap-1'>
                    {classroom.students && classroom.students.length > 0 ? (
                      <>
                        <div className='flex -space-x-2'>
                          {classroom.students.slice(0, 3).map((student, index) => (
                            <Avatar key={index} className='h-8 w-8 border-2 border-white shadow-sm'>
                              <AvatarImage src={student.imageUrl || student.ImageUrl} />
                              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 text-xs text-white'>
                                {student.name?.charAt(0).toUpperCase() || student.Name?.charAt(0).toUpperCase() || 'S'}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {classroom.students.length > 3 && (
                            <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-600 shadow-sm'>
                              +{classroom.students.length - 3}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className='flex items-center gap-1.5 text-slate-400'>
                        <Users className='h-4 w-4' />
                        <span className='text-sm'>No students</span>
                      </div>
                    )}
                  </div>

                  {/* Student Count */}
                  <div className='flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5'>
                    <Users className='h-4 w-4 text-slate-600' />
                    <span className='text-sm font-semibold text-slate-700'>{classroom.numberOfStudents}</span>
                  </div>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      )}
    </div>
  )
}
