'use client'
import { Star } from 'lucide-react'
import Image from 'next/image'

export default function BenefitsSection() {
  const benefits = [
    'Master fundamental knowledge at school',
    'The ability to criticize knowledge increases',
    'Respond confidently when encountering difficult situations'
  ]

  return (
    <section className='relative overflow-hidden bg-white px-6 py-16'>
      <div className='absolute top-0 right-0 h-48 w-48 animate-pulse rounded-full bg-gradient-to-bl from-orange-200 to-yellow-200 opacity-20'></div>
      <div className='animate-float absolute bottom-0 left-0 h-32 w-32 rounded-full bg-gradient-to-tr from-blue-200 to-cyan-200 opacity-30'></div>
      <div className='absolute top-1/2 left-10 h-6 w-6 animate-ping rounded-full bg-yellow-400 opacity-50'></div>
      <div className='absolute top-1/4 right-1/4 h-4 w-4 animate-bounce rounded-full bg-orange-400 opacity-60'></div>

      <div className='relative z-10 mx-auto flex max-w-6xl items-center justify-between'>
        <div className='relative flex-1'>
          <div className='group relative'>
            <Image
              width={600}
              height={300}
              src='/HomeFiles/learning.png'
              alt='Students collaborating'
              className='transform rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute -top-4 -left-4 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-blue-300 to-purple-300 opacity-20 transition-opacity duration-300 group-hover:opacity-30'></div>
            <div className='absolute -right-4 -bottom-4 -z-20 h-full w-full rounded-lg bg-gradient-to-tl from-yellow-300 to-orange-300 opacity-15 transition-opacity duration-300 group-hover:opacity-25'></div>
          </div>
        </div>

        <div className='ml-12 flex-1'>
          <div className='mb-8'>
            <div className='mb-2 flex items-center space-x-2'>
              <div className='relative'>
                <Star className='h-5 w-5 fill-current text-yellow-400' />
                <div className='absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-orange-400'></div>
              </div>
              <span className='text-sm text-gray-600'>Growing and online</span>
            </div>

            <h2 className='relative mb-6 text-3xl font-bold text-gray-900'>
              What will your child get after studying at{' '}
              <span className='relative text-orange-500'>
                STEMify
                <div className='absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 opacity-60'></div>
              </span>
              ?
            </h2>

            <ul className='space-y-4'>
              {benefits.map((benefit, index) => (
                <li key={index} className='group flex items-start space-x-3'>
                  <div className='relative mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-110'>
                    <span className='text-sm text-white'>✓</span>
                    <div className='absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-blue-300 opacity-60 group-hover:animate-pulse'></div>
                  </div>
                  <span className='text-gray-700 transition-colors duration-300 group-hover:text-gray-900'>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
