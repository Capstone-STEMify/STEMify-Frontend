'use client'
import React, { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Image')

  return (
    <section className='relative flex h-screen items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 h-full w-full'>
        <video
          autoPlay
          loop
          muted
          playsInline
          className='h-full w-full object-cover'
        >
          <source src="/HomeFiles/section_background.mp4" type="video/mp4" />
          {/* Fallback gradient if video fails to load */}
          <div className='absolute inset-0 animate-pulse bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400'></div>
        </video>
        
        <div className='absolute inset-0 z-10'></div>

        <div className='absolute bottom-0 left-0 right-0 h-80 z-20 bg-gradient-to-t from-white via-white/70 to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 h-60 z-25 bg-gradient-to-t from-white via-white/50 to-transparent'></div>
        <div className='absolute bottom-0 left-0 right-0 h-40 z-30 bg-gradient-to-t from-white via-white/30 to-transparent'></div>
      </div>

      {/* Content */}
      <div className='relative z-40 mx-auto max-w-4xl px-6 text-center'>
        <p className='mb-4 text-lg font-medium text-white/90 drop-shadow-lg'>
          Turn STEM into a game - Inspire passion, creativity
        </p>

        <h1 className='mb-12 text-6xl leading-tight font-bold text-white md:text-7xl drop-shadow-2xl'>
          The students light bulbs is coming on
          <p className='animate-pulse bg-gradient-to-r from-orange-400 via-orange-300 to-orange-200 bg-clip-text text-transparent drop-shadow-lg'>
            STEMify
          </p>
        </h1>

        <div className='mx-auto max-w-3xl rounded-2xl bg-white/95 p-2 shadow-2xl backdrop-blur-sm border border-white/20'>
          <div className='flex items-center'>
            <div className='flex items-center space-x-2 border-r border-gray-200 px-4 py-3'>
              <Sparkles className='h-5 w-5 text-amber-400' />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='cursor-pointer border-none bg-transparent font-medium text-gray-700 outline-none'
              >
                <option value='Image'>Course</option>
                <option value='Video'>Lesson</option>
                <option value='Audio'>Activity</option>
              </select>
            </div>

            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Describe the image you want to generate'
              className='flex-1 border-none bg-transparent px-6 py-3 text-lg text-gray-700 placeholder-gray-500 outline-none'
            />

            <button className='flex transform items-center space-x-2 rounded-xl bg-amber-400 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-xl'>
              <Search className='h-5 w-5' />
              <span>Explore</span>
            </button>
          </div>
        </div>

        <div className='absolute -top-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl animate-float'></div>
        <div className='absolute -bottom-10 -right-20 h-32 w-32 rounded-full bg-gradient-to-r from-pink-400/20 to-yellow-400/20 blur-3xl animate-float-delayed'></div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-3deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}