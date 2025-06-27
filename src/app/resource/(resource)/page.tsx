'use client'

import React from 'react'
import { Card } from '@/components/shadcn/card'
import {
  BookOpen,
  FileText,
  Activity,
  Users,
  Play,
  Image,
  Triangle,
  Square,
  Circle,
  BarChart3,
  Network,
  Layers
} from 'lucide-react'
import { AbstractCard } from '@/components/shared/card/AbstractCard'

type InfoCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  layout?: 'dark' | 'light' | 'custom'
  children: React.ReactNode
  customBg?: string // dùng cho layout='custom'
}

const InfoCard = ({ title, description, icon, layout = 'dark', children }: InfoCardProps) => {
  const containerBg = layout === 'dark' ? 'bg-gray-900' : ''
  const shapeContainerClass = layout === 'light' ? '' : 'flex flex-wrap'

  return (
    <div className='w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg'>
      <div className={`relative h-52 w-full overflow-hidden ${containerBg}`}>
        <div className={`absolute inset-0 ${shapeContainerClass}`}>{children}</div>
      </div>
      <div className='p-5'>
        <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-900'>
          {icon}
          {title}
        </h2>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
    </div>
  )
}

// 🔹 Layout Shape Grids
const DarkShapeGrid = () => (
  <>
    {[
      { icon: <Triangle />, color: 'yellow' },
      { icon: <Circle />, color: 'blue' },
      { icon: <Square />, color: 'red' },
      { icon: <Network />, color: 'green' },
      { icon: <Layers />, color: 'purple' },
      { icon: <BarChart3 />, color: 'pink' }
    ].map(({ icon, color }, i) => (
      <div key={i} className={`flex h-1/2 w-1/3 items-center justify-center border-2 border-${color}-400`}>
        {React.cloneElement(icon, { className: `h-6 w-6 text-${color}-400` })}
      </div>
    ))}
  </>
)

// 🔹 Full Page
const LibraryPage = () => {
  const gridContent = (
    <>
      {/* Row 1 */}
      <div className='relative flex items-center justify-center border border-gray-700 bg-gray-900 p-4'>
        <svg className='absolute inset-0 h-full w-full' viewBox='0 0 100 100'>
          <line x1='10' y1='10' x2='90' y2='90' stroke='#fbbf24' strokeWidth='2' />
          <line x1='90' y1='10' x2='10' y2='90' stroke='#3b82f6' strokeWidth='2' />
          <polygon points='50,20 70,60 30,60' fill='none' stroke='#ef4444' strokeWidth='2' />
        </svg>
      </div>

      <div className='relative flex items-center justify-center border border-gray-700 bg-gray-900 p-4'>
        <div className='relative h-8 w-8 rounded-full bg-yellow-300'>
          <div className='absolute -top-2 left-1/2 h-2 w-4 -translate-x-1/2 transform rounded-t bg-gray-600'></div>
        </div>
      </div>

      <div className='relative flex items-center justify-center border border-gray-700 bg-gray-900 p-4'>
        <svg className='absolute inset-0 h-full w-full' viewBox='0 0 100 100'>
          <polygon points='50,10 90,50 50,90 10,50' fill='none' stroke='#10b981' strokeWidth='2' />
          <circle cx='50' cy='50' r='10' fill='#f59e0b' />
          <path d='M30,30 Q50,10 70,30' stroke='#8b5cf6' strokeWidth='2' fill='none' />
        </svg>
      </div>

      {/* Row 2 */}
      <div className='relative flex items-center justify-center border border-gray-700 bg-gray-900 p-4'>
        <svg className='absolute inset-0 h-full w-full' viewBox='0 0 100 100'>
          <rect x='20' y='20' width='60' height='60' fill='none' stroke='#ec4899' strokeWidth='2' />
          <line x1='20' y1='20' x2='80' y2='80' stroke='#06b6d4' strokeWidth='2' />
          <circle cx='30' cy='70' r='8' fill='#f97316' />
        </svg>
      </div>

      <div className='relative flex items-center justify-center border border-gray-700 bg-gray-900 p-4'>
        <div className='relative'>
          <div className='h-12 w-6 rounded-t-full bg-blue-400'></div>
          <div className='absolute top-6 left-1/2 h-0.5 w-8 origin-left -translate-x-1/2 rotate-45 transform bg-yellow-400'></div>
        </div>
      </div>

      <div className='relative flex items-center justify-center border border-gray-700 bg-gray-900 p-4'>
        <svg className='absolute inset-0 h-full w-full' viewBox='0 0 100 100'>
          <polygon points='20,80 50,20 80,80' fill='none' stroke='#22c55e' strokeWidth='2' />
          <line x1='10' y1='90' x2='90' y2='10' stroke='#f59e0b' strokeWidth='2' />
          <rect x='60' y='60' width='20' height='20' fill='#ef4444' />
        </svg>
      </div>
    </>
  )

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>Library</h1>
          <p className='max-w-2xl text-lg text-gray-600'>
            Curated courses, curriculum-aligned lessons, engaging activities, and support materials made by expert
            teachers.
          </p>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Courses */}

          <AbstractCard
            title='Courses'
            description='Collections of student resources curated by theme or curriculum. The resources have teacher and student perspectives.'
            icon={<BookOpen className='h-5 w-5 text-gray-700' />}
            gridContent={gridContent}
          />

          <AbstractCard
            title='Lessons'
            description='Collections of student resources curated by theme or curriculum. The resources have teacher and student perspectives.'
            icon={<BookOpen className='h-5 w-5 text-gray-700' />}
            gridContent={gridContent}
          />

          <AbstractCard
            title='Activities'
            description='Collections of student resources curated by theme or curriculum. The resources have teacher and student perspectives.'
            icon={<BookOpen className='h-5 w-5 text-gray-700' />}
            gridContent={gridContent}
          />

          <InfoCard
            title='Teacher Support'
            icon={<BookOpen className='h-5 w-5' />}
            description='Professional learning articles, webinars, and guides sharing best instructional practices.'
            layout='dark'
          >
            <DarkShapeGrid />
          </InfoCard>
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
