// app/certificate/page.tsx
'use client'
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
        {/* <CertificateHeader
          studentName={certificateData?.data.userName ?? ''}
          completionDate={certificateData?.data.issuedDate ?? ''}
          // studyDuration={certificateData?.data. ?? ''}
          specializationName={certificateData?.data.courseTitle ?? ''}
          specializationUrl={certificateData?.data.certificateUrl ?? ''}
          // courses={certificateData?.data. ?? []}
        />

        <CertificateDetails
          specializationName={certificateData?.data.userName ?? ''}
          rating={certificateData?.data. ?? 0}
          ratingCount={certificateData?.data.ratingCount ?? 0}
          enrollmentCount={certificateData?.data.enrollmentCount ?? 0}
          learningOutcomes={certificateData?.data.learningOutcomes ?? []}
          skills={certificateData?.data.skills ?? []}
        />

        <CourseList
          courses={certificateData.courses}
          university={certificateData.university}
          studentName={certificateData.studentName}
        /> */}
      </div>
    </main>
  )
}

export default SpecificCertificatePage
