'use client'
import ResourceCard from '@/components/shared/card/ResourceCard'
import React from 'react'

export default function ExploreResourcesSection() {
  const resources = [
    {
      title: 'Text to image',
      description: 'Generate high-quality images using text with latest Image 4 Model.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format',
      category: 'Animals',
      age: '8-14+',
      duration: '6:00:00'
    },
    {
      title: 'Text to video',
      description: 'Generate video clips from a detailed description and high-quality images.',
      image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&h=300&fit=crop&auto=format',
      category: 'Biology',
      age: '8-14+',
      duration: '6:00:00'
    },
    {
      title: 'Boards (beta)',
      description: 'Generate images or upload your own and start remixing on a board.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&auto=format',
      category: 'Coding',
      age: '8-14+',
      duration: '6:00:00'
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
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>

        <div className='mt-12 text-center'>
          <button className='relative transform rounded-full bg-amber-400 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'>
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
