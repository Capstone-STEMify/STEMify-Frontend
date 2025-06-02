'use client'
import React from 'react'

export default function TestimonialsSection() {
  return (
    <section className='relative overflow-hidden bg-yellow-50 px-6 py-16'>
      {/* <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-15 animate-float-delayed"></div> */}
      <div className='absolute top-1/4 left-1/4 h-4 w-4 animate-bounce rounded-full bg-yellow-400 opacity-50'></div>
      <div className='absolute right-1/3 bottom-1/4 h-5 w-5 animate-ping rounded-full bg-orange-400 opacity-40'></div>

      <div className='relative z-10'>
        <h2 className='relative mb-12 text-center text-3xl font-bold'>
          What do students say about{' '}
          <span className='relative text-yellow-500'>
            STEMify
            <div className='absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-60'></div>
          </span>
          ?
        </h2>

        <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3'>
          <div className='group relative rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:transform hover:shadow-xl'>
            <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-yellow-400 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60'></div>
            <div className='mb-4 flex items-center'>
              <img src='/HomeFiles/hcm.jpg' alt='Jessica Andrew' className='mr-3 h-12 w-12 rounded-full object-cover' />
              <div>
                <h4 className='font-semibold'>Jessica Andrew</h4>
                <p className='text-sm text-gray-600'>Student</p>
              </div>
            </div>
            <p className='text-sm text-gray-700'>
              "My child has improved a lot after learning with STEMify online. The road from 6th to 7th grade."
            </p>
          </div>

          <div className='group relative rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:transform hover:shadow-xl'>
            <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-400 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60'></div>
            <div className='mb-4 flex items-center'>
              <img
                src='/HomeFiles/hcm.jpg'
                alt='Gabrielle Robertson'
                className='mr-3 h-12 w-12 rounded-full object-cover'
              />
              <div>
                <h4 className='font-semibold'>Gabrielle Robertson</h4>
                <p className='text-sm text-gray-600'>Parent</p>
              </div>
            </div>
            <p className='text-sm text-gray-700'>
              "My child found how to write very good reports. English skills and writing skills have improved
              significantly."
            </p>
          </div>

          <div className='group relative rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:transform hover:shadow-xl'>
            <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-orange-400 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60'></div>
            <div className='mb-4 flex items-center'>
              <img src='/HomeFiles/hcm.jpg' alt='Dianne Russell' className='mr-3 h-12 w-12 rounded-full object-cover' />
              <div>
                <h4 className='font-semibold'>Dianne Russell</h4>
                <p className='text-sm text-gray-600'>Student</p>
              </div>
            </div>
            <p className='text-sm text-gray-700'>
              "My child has improved a lot after learning online. Thank you very much team."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
