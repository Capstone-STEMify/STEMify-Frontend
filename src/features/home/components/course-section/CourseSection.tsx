'use client'
import React from 'react'

export default function ExploreResourcesSection() {
  const resources = [
    {
      title: 'Text to image',
      description: 'Generate high-quality images using text with latest Image 4 Model.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format',
      color: 'cyan',
      buttonText: 'Text to image',
      size: 'large'
    },
    {
      title: 'Text to video',
      description: 'Generate video clips from a detailed description and high-quality images.',
      image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&h=300&fit=crop&auto=format',
      color: 'red',
      buttonText: 'New',
      size: 'large'
    },
    {
      title: 'Boards (beta)',
      description: 'Generate images or upload your own and start remixing on a board.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&auto=format',
      color: 'gray',
      buttonText: 'New',
      size: 'large'
    }
  ]

  return (
    <section className='relative overflow-hidden px-6 py-16'>
      <div className='absolute top-0 left-0 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20'></div>
      <div className='animate-slow-spin absolute right-0 bottom-0 h-60 w-60 rounded-full bg-gradient-to-tl from-purple-500 to-pink-500 opacity-15'></div>
      <div className='absolute top-1/2 left-1/4 h-8 w-8 animate-bounce rounded-full bg-yellow-400 opacity-40'></div>

      <div className='relative z-10'>
        <h2 className='relative mb-12 text-center text-3xl font-bold text-white'>
          Explore resources
          <div className='absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-400 to-purple-400'></div>
        </h2>

        <div className='mx-auto grid max-w-7xl gap-6 md:grid-cols-3'>
          {resources.map((resource, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 hover:transform hover:shadow-2xl'
            >
              <div
                className={`absolute -top-2 -right-2 h-6 w-6 bg-${resource.color}-400 rounded-full opacity-60 group-hover:animate-ping`}
              ></div>
              
              <div className='relative h-64 overflow-hidden'>
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110' 
                />
                
                <div className='absolute bottom-4 left-4'>
                  <span className='inline-block rounded-full bg-gray-300 bg-opacity-80 px-4 py-2 text-sm font-medium backdrop-blur-sm'>
                    {resource.buttonText}
                  </span>
                </div>
              </div>
              
              <div className='p-6'>
                <h3 className='mb-3 text-xl font-semibold'>{resource.title}</h3>
                <p className='leading-relaxed'>{resource.description}</p>
                
                <div className='mt-4 flex justify-end'>
                  <div className='rounded-full bg-gray-400 p-2 transition-colors duration-300 group-hover:bg-gray-300'>
                    <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <button className='relative transform rounded-full bg-amber-300 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-400 hover:shadow-xl'>
            Explore →
            <div className='absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-pink-400 opacity-60'></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
      `}</style>
    </section>
  )
}