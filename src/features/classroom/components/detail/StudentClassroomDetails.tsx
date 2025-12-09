'use client'

import { useGetClassroomByIdQuery } from '@/features/classroom/api/classroomApi'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Users, BookOpen, Copy, MoreVertical, Mail, Camera, Video } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { CourseEnrollment, EnrollmentStatus } from '@/features/enrollment/types/enrollment.type'
import { toast } from 'sonner'
import { ClassroomNavItems } from 'app/[locale]/classroom/[classroomId]/page'
import { setCourseEnrollmentId } from '@/features/enrollment/slice/enrollmentSlice'
import { useCreateCourseEnrollmentMutation } from '@/features/enrollment/api/courseEnrollmentApi'

export type StudentClassroomDetailProps = {
  courseEnrollment?: CourseEnrollment
}
export default function StudentClassroomDetail({ courseEnrollment }: StudentClassroomDetailProps) {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tClassroom = useTranslations('classroom')
  const { classroomId } = useParams()
  const { selectedOrgUserId } = useAppSelector((state) => state.selectedOrganization)
  console.log('Selected Org User ID:', selectedOrgUserId)
  const router = useRouter()
  const locale = useLocale()
  const dispatch = useAppDispatch()

  const { data, isLoading } = useGetClassroomByIdQuery(Number(classroomId))
  const classroom = data?.data

  const [createEnrollment, { data: createEnrollmentResponse }] = useCreateCourseEnrollmentMutation()

  const copyClassCode = () => {
    if (classroom?.classCode) {
      navigator.clipboard.writeText(classroom.classCode)
      toast.success(tt('successMessage.copiedToClipboard'))
    }
  }
  const handleEnroll = () => {
    if (!selectedOrgUserId) {
      signIn('oidc', { callbackUrl: `/`, prompt: 'login' })
      return
    }
    if (classroom?.course.id) {
      createEnrollment({
        courseId: classroom?.course.id,
        studentId: selectedOrgUserId,
        status: EnrollmentStatus.IN_PROGRESS,
        classroomId: Number(classroomId)
      })
      toast.success(tt('successMessage.enroll'), {
        description: `${tt('successMessage.enrollDes', { title: createEnrollmentResponse?.data.courseTitle || '' })}`
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
          <h2 className='mb-2 text-2xl font-bold text-slate-900'>{tClassroom('detail.notFound')}</h2>
          <p className='mb-6 text-slate-600'>{tClassroom('detail.notFoundSubtext')}</p>
          <Link href='/classroom'>
            <Button>{tc('button.backToClassroomList')}</Button>
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
            {classroom.course && (
              <Card className='overflow-hidden border border-slate-200 py-4 shadow-sm'>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <BookOpen className='h-5 w-5 text-blue-600' />
                    {tClassroom('detail.course')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex gap-4'>
                    {classroom.course.imageUrl && (
                      <div className='relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100'>
                        <Image
                          src={classroom.course.imageUrl}
                          alt={classroom.course.title}
                          fill
                          className='object-cover'
                        />
                      </div>
                    )}
                    <div className='flex-1'>
                      <div className='mb-2 flex items-start justify-between gap-2'>
                        <h3 className='text-xl font-bold text-slate-900'>{classroom.course.title}</h3>
                        <Badge variant='secondary' className='border-0 bg-emerald-100 text-emerald-700'>
                          {classroom.course.code}
                        </Badge>
                      </div>
                      <p className='mb-3 line-clamp-3 text-sm text-slate-600'>{classroom.course.description}</p>
                      {courseEnrollment ? (
                        <Button
                          className='mt-4'
                          onClick={() => {
                            dispatch(setCourseEnrollmentId(courseEnrollment.id))
                            router.push(`/resource/course/${classroom.course.id}/learn`)
                          }}
                        >
                          {tc('button.continueLearning')}
                        </Button>
                      ) : (
                        <Button className='mt-4' onClick={handleEnroll}>
                          {tc('button.enroll')}
                        </Button>
                      )}
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
                    {tClassroom('detail.students.label')} ({classroom.numberOfStudents})
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
                          <AvatarImage src={student.imageUrl} />
                          <AvatarFallback className='bg-gradient-to-br from-purple-100 to-blue-500 text-white'>
                            {student.name?.charAt(0).toUpperCase() || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <p className='font-medium text-slate-900'>{student.name || 'Unknown Student'}</p>
                          {student.email && <p className='text-sm text-slate-500'>{student.email}</p>}
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
                    <h3 className='mb-1 font-semibold text-slate-700'>{tClassroom('detail.students.noStudent')}</h3>
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
                <CardTitle className='text-base'>{tClassroom('detail.classCode.label')}</CardTitle>
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
                </div>
              </CardContent>
            </Card>

            {/* Teacher Card */}
            {classroom.teacher && (
              <Card className='border border-slate-200 py-4 shadow-sm'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base'>{tClassroom('detail.teacher')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start gap-3'>
                    <Avatar className='h-12 w-12 border-2 border-white shadow-md'>
                      <AvatarImage src={classroom.teacher.imageUrl} />
                      <AvatarFallback className='bg-gradient-to-br from-amber-100 to-amber-500 font-semibold text-white'>
                        {classroom.teacher.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <p className='mb-1 font-semibold text-slate-900'>{classroom.teacher.name}</p>
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
            {/* <Card className='border border-slate-200 py-4 shadow-sm'>
              <CardContent className='p-4'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded bg-white'>
                        <Video className='h-5 w-5 text-green-600' />
                      </div>
                      <span className='font-semibold text-slate-900'>{tClassroom('detail.meet.label')}</span>
                    </div>
                  </div>

                  <Button className='w-full border-2 border-slate-300 bg-white text-blue-600 hover:bg-slate-50'>
                    {tClassroom('detail.meet.joinButton')}
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}
