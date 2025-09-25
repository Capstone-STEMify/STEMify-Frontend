// app/certificate/page.tsx

import CertificateDetails from '../details/CertificateDetails'
import CertificateHeader from '../header/CertificateHeader'
import CourseList from '../course-list/CourseList'
import { certificateData } from '../mockData'

const SpecificCertificatePage = () => {
  return (
    <main className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl'>
        <CertificateHeader
          studentName={certificateData.studentName}
          completionDate={certificateData.completionDate}
          studyDuration={certificateData.studyDuration}
          specializationName={certificateData.specialization.name}
          specializationUrl={certificateData.specialization.url}
          courses={certificateData.courses}
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
