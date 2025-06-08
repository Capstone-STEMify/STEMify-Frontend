'use client'
import React, { useState } from 'react'
import { Star, Image, Video, Volume2, BookCheck } from 'lucide-react'
import { Button } from '@/components/shadcn/button'

type TabItem = {
  id: string
  name: string
  icon: React.ReactNode
}

const tabs: TabItem[] = [
  {
    id: 'course',
    name: 'Courses',
    icon: <Star className='h-4 w-4' />
  },
  {
    id: 'activity',
    name: 'Activities',
    icon: <Image className='h-4 w-4' />
  },
  {
    id: 'video',
    name: 'Videos',
    icon: <Video className='h-4 w-4' />
  },
  {
    id: 'lesson',
    name: 'Lessons',
    icon: <Volume2 className='h-4 w-4' />
  },
  {
    id: 'blog',
    name: 'Blogs',
    icon: <BookCheck className='h-4 w-4' />
  }
]

type NavigationTabsProps = {
  defaultActiveTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export default function NavigationTabs({
  defaultActiveTab = 'course',
  onTabChange,
  className = ''
}: NavigationTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <nav className={`mx-auto w-fit ${className}`}>
      <ul className='flex items-center rounded-2xl bg-gray-100/90 shadow-sm backdrop-blur-sm'>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <li key={tab.id}>
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
              >
                <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {tab.icon}
                </span>

                <span className='font-medium whitespace-nowrap'>{tab.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
