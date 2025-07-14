'use client'
import { useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'
import Image from 'next/image'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Users, Calendar, Hash, GraduationCap, User, Mail } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { getDaysRemaining } from '@/utils/index'

export default function ClassroomMember() {
  const { data, error } = useGetClassroomByIdQuery(2)

  if (error) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <p className='text-red-500'>Error loading classroom data</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    )
  }

  const classroom = data.data
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className='mx-10 space-y-8 p-6'>
      {/* Classroom Header */}
      <div className='space-y-6'>
        <div className='relative h-48 w-full overflow-hidden rounded-xl'>
          <Image src={classroom.coverImageUrl} alt={classroom.name} fill className='object-cover' />
          <div className='absolute inset-0 flex items-end bg-black/40'>
            <div className='p-6 text-white'>
              <h1 className='mb-2 text-3xl font-bold'>{classroom.name}</h1>
              <p className='text-lg opacity-90'>{classroom.description}</p>
            </div>
          </div>
        </div>

        {/* Classroom Info Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardContent className='flex items-center space-x-3 p-4'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <GraduationCap className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Grade</p>
                <p className='font-semibold'>{classroom.grade}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='flex items-center space-x-3 p-4'>
              <div className='rounded-lg bg-green-100 p-2'>
                <Users className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Students</p>
                <p className='font-semibold'>{classroom.numberOfStudents}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='flex items-center space-x-3 p-4'>
              <div className='rounded-lg bg-purple-100 p-2'>
                <Hash className='h-5 w-5 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Class Code</p>
                <p className='text-xs font-semibold'>{classroom.classCode}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='flex items-center space-x-3 p-4'>
              <div className='rounded-lg bg-orange-100 p-2'>
                <Calendar className='h-5 w-5 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Status</p>
                <Badge
                  className={`${classroom.status === 'Active' ? 'bg-emerald-500' : 'bg-red-600'} py-1 text-center text-xs`}
                >
                  {classroom.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Students Section */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Class Members</h2>
            <p className='text-gray-600'>
              {classroom.numberOfStudents} student{classroom.numberOfStudents !== 1 ? 's' : ''} enrolled
            </p>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
          <Table>
            <TableHeader className='bg-gray-50'>
              <TableRow className='h-12'>
                <TableHead className='w-20 pl-6'>#</TableHead>
                <TableHead className='w-40'>Avatar</TableHead>
                <TableHead className='w-1/3'>
                  <div className='flex items-center space-x-2'>
                    <User className='h-4 w-4' />
                    <span>Student Name</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex items-center space-x-2'>
                    <Mail className='h-4 w-4' />
                    <span>Email</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroom.students.map((student, index) => (
                <TableRow key={student.id} className='transition-colors hover:bg-gray-50'>
                  <TableCell className='pl-6 font-medium text-gray-500'>{String(index + 1).padStart(2, '0')}</TableCell>
                  <TableCell>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src={student.studentImageUrl} alt={student.studentName} className='object-cover' />
                      <AvatarFallback className='bg-blue-100 text-sm font-semibold text-blue-600'>
                        {getInitials(student.studentName)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className='font-semibold text-gray-900'>{student.studentName}</div>
                  </TableCell>
                  <TableCell>
                    <div className='text-gray-600'>{student.studentEmail}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {classroom.students.length === 0 && (
          <Card>
            <CardContent className='py-12 text-center'>
              <Users className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>No students enrolled</h3>
              <p className='text-gray-600'>Students will appear here once they join the classroom.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Course Duration */}
      <Card className='border-0 bg-gray-50'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Calendar className='h-5 w-5 text-gray-600' />
              <div>
                <p className='font-semibold text-gray-900'>Course Duration</p>
                <p className='text-sm text-gray-600'>
                  {new Date(classroom.startDate).toLocaleDateString()} -{' '}
                  {new Date(classroom.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant='outline' className='text-sm'>
              {getDaysRemaining(classroom.endDate)} days remaining
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
