// app/certificate/page.tsx
'use client'
import CertificateDetails from './CertificateDetails'
import CertificateHeader from './CertificateHeader'
import { useParams } from 'next/navigation'
import { use } from 'matter'
import { useGetCertificateByIdQuery } from '@/features/certificate/api/certificateApi'
import { skip } from 'node:test'
import CourseList from '@/features/certificate/components/detail/CourseList'
import { useGetCurriculumByIdQuery } from '@/features/resource/curriculum/api/curriculumApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'

const SpecificCertificatePage = () => {
  const { certificateId } = useParams()
  const { data: certificateData, isLoading: isCertificateLoading } = useGetCertificateByIdQuery(Number(certificateId), {
    skip: !certificateId
  })
  const { data: curriculumData, isLoading: isCurriculumLoading } = useGetCurriculumByIdQuery(
    Number(certificateData?.data.curriculumId),
    {
      skip: !Number(certificateData?.data.curriculumId)
    }
  )
  if (isCertificateLoading || isCurriculumLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!certificateData) return <div>Certificate not found</div>

  return (
    <main className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl'>
        <CertificateHeader certificate={certificateData?.data} />

        <CertificateDetails
          specializationName={certificateData?.data.userName ?? ''}
          learningOutcomes={curriculumData?.data.learningOutcomes ?? []}
          skills={curriculumData?.data.skills ?? []}
          imageUrl={curriculumData?.data.imageUrl}
        />

        <CourseList
          courseEnrollments={certificateData?.data.courseEnrollments ?? []}
          studentName={certificateData?.data.userName ?? ''}
        />
      </div>
    </main>
  )
}

export default SpecificCertificatePage
