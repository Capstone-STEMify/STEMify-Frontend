'use client'
import FeedbackCard from '@/components/shared/card/FeedbackCard'
import React from 'react'

export default function TestimonialsSection() {
  return (
    <section className='relative overflow-hidden bg-yellow-50 px-6 py-10'>
      {/* <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-15 animate-float-delayed"></div> */}
      <div className='absolute top-1/4 left-1/4 h-4 w-4 animate-bounce rounded-full bg-yellow-400 opacity-50'></div>
      <div className='absolute right-1/3 bottom-1/4 h-5 w-5 animate-ping rounded-full bg-orange-400 opacity-40'></div>

      <div className='relative z-10'>
        <h2 className='relative text-center text-3xl font-bold'>
          What do students say about{' '}
          <span className='relative text-yellow-500'>
            STEMify
            <div className='absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-60'></div>
          </span>
          ?
        </h2>

        <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3'>
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
        </div>
      </div>
    </section>
  )
}
