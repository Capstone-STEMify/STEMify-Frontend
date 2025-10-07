// app/certificate/page.tsx

import CertificateDetails from './CertificateDetails'
import CertificateHeader from './CertificateHeader'
import { useParams } from 'next/navigation'
import { use } from 'matter'
import { useGetCertificateByIdQuery } from '@/features/certificate/api/certificateApi'
import { skip } from 'node:test'
import CourseList from '@/features/certificate/components/detail/CourseList'

const SpecificCertificatePage = () => {
  const { certificateId } = useParams()
  const { data: certificateData } = useGetCertificateByIdQuery(Number(certificateId), { skip: !certificateId })

  return (
    <main className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl'>
        <CertificateHeader
          studentName={certificateData?.data.userName ?? ''}
          completionDate={certificateData?.data.issuedDate ?? ''}
          studyDuration={certificateData?.data.studyDuration ?? ''}
          specializationName={certificateData?.data.specialization.name ?? ''}
          specializationUrl={certificateData?.data.specialization.url ?? ''}
          courses={certificateData?.data.courses ?? []}
        />

        <CertificateDetails
          specializationName={certificateData.specialization.name}
          rating={certificateData.rating}
          ratingCount={certificateData.ratingCount}
          enrollmentCount={certificateData.enrollmentCount}
          learningOutcomes={certificateData.learningOutcomes}
          skills={certificateData.skills}
        />

        <CourseList
          courses={certificateData.courses}
          university={certificateData.university}
          studentName={certificateData.studentName}
        />
      </div>
    </main>
  )
}

export default SpecificCertificatePage
