import LinkButton from '@/components/shared/button/LinkButton'
import React, { useEffect, useState } from 'react'

export default function TeachingSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('teaching-section')
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id='teaching-section' className='bg-white py-20'>
      <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
        <div
          className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className='mb-8 text-4xl font-bold text-gray-900 md:text-5xl'>
            Teaching with <span className='text-amber-400'>STEMify</span> has never been easier
          </h2>
          <p className='mx-auto mb-12 max-w-4xl text-xl text-gray-600'>
            Send and receive assignments, monitor student progress, and assign new activities—all in STEMify Classrooms.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <LinkButton
              href='/classroom/list'
              className='rounded-lg bg-blue-600 px-8 py-5 text-white transition-colors hover:bg-blue-700'
            >
              Go To Your Classroom →
            </LinkButton>
            <LinkButton
              href='/classroom/list'
              className='rounded-lg border border-blue-600 bg-white px-8 py-5 text-blue-600 transition-colors hover:bg-blue-50'
            >
              Join A Class
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
