// app/certificate/page.tsx
'use client'
import CertificateDetails from './CertificateDetails'
import CertificateHeader from './CertificateHeader'
import { useParams } from 'next/navigation'
import CourseList from '@/features/certificate/components/detail/CourseList'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchCurriculumEnrollmentQuery } from '@/features/enrollment/api/curriculumEnrollmentApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import SEmpty from '@/components/shared/empty/SEmpty'

const SpecificCertificatePage = () => {
  const { certificateId } = useParams()
  const curriculumEnrollParams = useAppSelector((state) => state.curriculumEnrollment)
  const user = useAppSelector((state) => state.auth.user)

  const { data: curriculumEnrollment, isLoading: isLoadingCurriculumEnrollment } = useSearchCurriculumEnrollmentQuery(
    { studentId: user?.userId, certificateId: Number(certificateId), ...curriculumEnrollParams },
    { skip: !user?.userId }
  )
  const { data: curriculumData } = useGetCurriculumByIdQuery(
    Number(curriculumEnrollment?.data.items[0]?.curriculumId),
    { skip: !curriculumEnrollment?.data.items[0]?.curriculumId }
  )

  if (isLoadingCurriculumEnrollment)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!curriculumEnrollment?.data.items[0])
    return (
      <div>
        <SEmpty title='Certificate not found' />
      </div>
    )

  return (
    <main className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl'>
        <CertificateHeader
          certificateUrl={curriculumEnrollment.data.items[0].certificateUrl ?? ''}
          userName={curriculumEnrollment.data.items[0].studentName ?? ''}
          issuedDate={curriculumEnrollment.data.items[0].issuedDate ?? ''}
          title={curriculumEnrollment.data.items[0].curriculumTitle}
          courseEnrollments={curriculumEnrollment.data.items[0].courseEnrollments}
        />

        <CertificateDetails
          specializationName={curriculumData?.data.title ?? ''}
          learningOutcomes={curriculumData?.data.learningOutcomes ?? []}
          skills={curriculumData?.data.skills ?? []}
          imageUrl={curriculumData?.data.imageUrl ?? ''}
        />

        <CourseList
          courseEnrollments={curriculumEnrollment.data.items[0].courseEnrollments ?? []}
          studentName={curriculumEnrollment.data.items[0].studentName ?? ''}
        />
      </div>
    </main>
  )
}

export default SpecificCertificatePage
