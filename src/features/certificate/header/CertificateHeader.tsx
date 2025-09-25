// app/certificate/components/CertificateHeader.tsx
import { CheckCircle, Download, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '../mockData';

interface CertificateHeaderProps {
  studentName: string;
  completionDate: string;
  studyDuration: string;
  specializationName: string;
  specializationUrl: string;
  courses: Course[];
}

const CertificateHeader = ({
  studentName,
  completionDate,
  studyDuration,
  specializationName,
  specializationUrl,
  courses,
}: CertificateHeaderProps) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side: Completion Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                 {/* Placeholder for avatar */}
              </div>
              <CheckCircle className="absolute -bottom-1 -right-1 h-7 w-7 text-white bg-blue-600 rounded-full border-2 border-white" />
            </div>
            <div className="pt-1">
              <p className="text-lg text-gray-700">Completed by <span className="font-bold text-gray-900">{studentName}</span></p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{completionDate}</h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3 ml-20">{studyDuration}</p>

          <p className="mt-6 text-base text-gray-700">
            {studentName}'s account is verified. Coursera certifies their successful completion of University of California, Irvine{' '}
            <Link href={specializationUrl} className="text-blue-600 hover:underline font-semibold">
              {specializationName}
            </Link> Specialization.
          </p>

          {/* === ADDED SECTION: Course Certificates Completed === */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800">Course Certificates Completed</h3>
            <div className="mt-2 text-gray-700 space-y-1">
              {courses.map((course) => (
                <p key={course.title}>{course.title}</p>
              ))}
            </div>
          </div>
           {/* === END ADDED SECTION === */}
        </div>

        {/* Right Side: Certificate Image & Actions */}
        {/* CHANGED: Increased the width container for a larger image */}
        <div className="flex flex-col items-center lg:items-end w-full lg:w-auto lg:max-w-md">
          <div className="w-full border rounded-md p-2 bg-gray-50 shadow-sm">
            {/* CHANGED: Increased image dimensions */}
            <Image
              src="/certificate-placeholder.png"
              alt="Certificate Thumbnail"
              width={500} // Increased width
              height={350} // Increased height
              className="rounded"
            />
          </div>
          <div className="flex gap-4 mt-4 w-full">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors">
              <Share2 size={18} />
              Share Certificate
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 font-semibold py-2.5 px-4 rounded-md hover:bg-blue-50 transition-colors">
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateHeader;