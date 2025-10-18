// app/certificate/components/CertificateDetails.tsx
import { Check } from 'lucide-react'
import Image from 'next/image'

interface CertificateDetailsProps {
  specializationName: string
  learningOutcomes: string[]
  skills: string[]
  imageUrl?: string
}

const CertificateDetails = ({ specializationName, learningOutcomes, skills, imageUrl }: CertificateDetailsProps) => {
  return (
    <section className='mt-6 rounded-lg bg-white p-6 shadow-md md:p-8'>
      <div className='flex items-start gap-4'>
        {/* Replace with actual university logo */}
        <Image src={imageUrl ?? '/HomeFiles/learning.png'} alt='UCI Logo' width={60} height={60} />
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>{specializationName}</h2>
          <div className='mt-1 flex items-center gap-2 text-sm text-gray-600'></div>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-8 border-t pt-6 md:grid-cols-2'>
        {/* WHAT YOU WILL LEARN */}
        <div>
          <h3 className='mb-3 font-bold text-gray-800'>WHAT YOU WILL LEARN</h3>
          <ul className='space-y-2'>
            {learningOutcomes.map((outcome, index) => (
              <li key={index} className='flex items-start gap-3'>
                <Check className='mt-1 h-5 w-5 flex-shrink-0 text-green-600' />
                <span className='text-gray-700'>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* SKILLS YOU WILL GAIN */}
        <div>
          <h3 className='mb-3 font-bold text-gray-800'>SKILLS YOU WILL GAIN</h3>
          <div className='flex flex-wrap gap-2'>
            {skills.map((skill, index) => (
              <span key={index} className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800'>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CertificateDetails
