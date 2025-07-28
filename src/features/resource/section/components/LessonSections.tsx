'use client'
import { Section } from '@/features/resource/section/types/section.type'
import React, { useState } from 'react'

interface LessonSectionsProps {
  sections: Section[]
}

export default function LessonSections({ sections }: LessonSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([])

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
  }

  const isExpanded = (id: number) => expandedSections.includes(id)

  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className='rounded-lg border p-4 shadow-sm transition-all'>
      <div className='divide-y divide-gray-200'>
        {sortedSections.map((section) => (
          <div key={section.id} className='py-4'>
            <div className='flex cursor-pointer items-center justify-between' onClick={() => toggleSection(section.id)}>
              <h3 className='text-lg font-semibold'>{section.description}</h3>
              <span className='text-sm text-gray-500'>{isExpanded(section.id) ? '▲' : '▼'}</span>
            </div>

            {isExpanded(section.id) && (
              <div className='mt-3 flex gap-10 text-sm text-gray-700'>
                <p>
                  <strong className='mr-2'>Duration:</strong> {section.duration} mins
                </p>
                <p>
                  <strong className='mr-2'>Status:</strong> {section.status}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
