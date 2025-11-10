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
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import {
  useCreateCurriculumEnrollmentMutation,
  useSearchCurriculumEnrollmentQuery
} from '@/features/enrollment/api/curriculumEnrollmentApi'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import { toast } from 'sonner'

export default function StudentClassroomDetail() {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { classroomId } = useParams()
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.userRole || UserRole.GUEST
  const router = useRouter()
  const locale = useLocale()

  const { data, isLoading } = useGetClassroomByIdQuery(Number(classroomId))
  const classroom = data?.data

  const { data: curriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    {
      curriculumId: classroom?.curriculum.id,
      studentId: auth?.user?.userId || '',
      classroomId: Number(classroomId),
      pageNumber: 1,
      pageSize: 20
    },
    { skip: !auth.user?.userId || !classroom?.curriculum.id || userRole !== UserRole.STUDENT }
  )
  const [createEnrollment, { data: createEnrollmentResponse }] = useCreateCurriculumEnrollmentMutation()

  const copyClassCode = () => {
    if (classroom?.classCode) {
      navigator.clipboard.writeText(classroom.classCode)
      // You can add a toast notification here
    }
  }
  const handleEnroll = () => {
    if (!auth.user?.userId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (classroom?.curriculum.id) {
      createEnrollment({
        curriculumId: classroom?.curriculum.id,
        studentId: auth?.user?.userId,
        status: EnrollmentStatus.IN_PROGRESS,
        classroomId: Number(classroomId)
      })
      toast.success(tt('successMessage.enroll'), {
        description: `${tt('successMessage.enrollDes', { title: createEnrollmentResponse?.data.curriculumTitle || '' })}`
      })
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
      <div className='container mx-auto px-6 py-8'>
        {/* Main Content Grid */}
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Left Column - Main Info */}
          <div className='space-y-6 md:col-span-2'>
            {/* Curriculum Card */}
            {classroom.curriculum && (
              <Card className='overflow-hidden border border-slate-200 py-4 shadow-sm'>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <BookOpen className='h-5 w-5 text-blue-600' />
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
                  {curriculumEnrollment?.data.items[0] ? (
                    <Button
                      className='mt-4'
                      onClick={() =>
                        router.push(
                          `/${locale}/classroom/${classroom.id}/course?curriculumId=${classroom.curriculum.id}`
                        )
                      }
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button className='mt-4' onClick={handleEnroll}>
                      {tc('button.enroll')}
                    </Button>
                  )}
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
                          <AvatarFallback className='bg-gradient-to-br from-purple-100 to-blue-500 text-white'>
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
                      <AvatarFallback className='bg-gradient-to-br from-amber-100 to-amber-500 font-semibold text-white'>
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
          </div>
        </div>
      </div>
    </div>
  )
}
