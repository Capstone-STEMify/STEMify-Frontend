import React from 'react'
import LessonTable from '../../lesson/components/table/LessonTable'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { Course } from '../types/course.type'
import { SCard } from '@/components/shared/card/SCard'
const course = {
  id: 1,
  title: 'City Building',
  imageUrl: 'https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fcou_city-building_cover.jpg&w=1920&q=75',
  slug: 'city-building',
  description:
    'City development involves creating an environment with an understanding of how urban spaces can shape residents’ lives. It requires careful planning and consideration of various elements. Designing a city involves envisioning areas for housing, transportation, parks, schools, hospitals, and other essential amenities and promoting sustainability, accessibility, and community engagement.',
  studentTasks:
    '1. Research how cities are structured and identify common urban elements (e.g., housing, transportation, green spaces).\n2. Design a city layout on paper or using a digital tool, planning zones for residential, commercial, and public services.\n3. Build a physical city model using straws or recycled materials, focusing on stability and space usage.\n4. Present the city model to the class and explain design decisions based on accessibility, sustainability, and community needs.\n5. Reflect on challenges faced during the building process and propose improvements for future development.',
  duration: 310,
  status: 'PUBLISHED',
  level: 'BEGINNER',
  createdByUserId: 'b7e2c7e2-8c1a-4e2e-9b2a-2e7c8e2a1b3c',
  ageRangeId: 1,
  createdDate: '2025-08-16T00:13:22.729325Z',
  lastModifiedDate: '2025-08-16T00:13:22.729325Z',
  ageRangeLabel: '4-7',
  topicNames: ['Storytelling', 'Coding', 'Urban Planning', 'Biology', 'Physics'],
  skillNames: ['Creativity', 'Teamwork', 'Coding', 'Engineering Design', 'Critical Thinking'],
  standardNames: ['Engineering Design', 'ISTE 1.1 Empowered Learner', 'Energy', 'Innovative Designer'],
  code: 'CB001',
  createdByUserName: ''
}

export default function CourseDetailPage() {
  const createdAt = course.createdDate ? new Date(course.createdDate).toLocaleString() : 'N/A'
  const updatedAt = course.lastModifiedDate ? new Date(course.lastModifiedDate).toLocaleString() : 'N/A'
  const createdBy = course.createdByUserName?.trim() || 'STEMify Staff'

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      {/* Left Column */}
      <div className='space-y-4 md:col-span-2'>
        <SCard
          title={course.title}
          titleClassName='text-3xl font-semibold'
          content={
            <div className='text-muted-foreground mt-2 flex flex-wrap gap-3 text-sm'>
              <span>Code: {course.code}</span>
              <span>Status: {course.status}</span>
              <span>Level: {course.level}</span>
              <span>Age Range: {course.ageRangeLabel}</span>
            </div>
          }
        />

        <SCard
          title='Description'
          titleClassName='text-2xl font-semibold'
          content={<div className='text-sm leading-relaxed whitespace-pre-wrap'>{course.description}</div>}
        />

        <SCard
          title='Student Tasks'
          content={<div className='text-sm leading-relaxed whitespace-pre-wrap'>{course.studentTasks}</div>}
        />

        <SCard
          title='Topics'
          content={
            <div className='mt-2 flex gap-2'>
              {course.topicNames.map((topic) => (
                <Badge key={topic} variant='secondary' className='text-sm'>
                  {topic}
                </Badge>
              ))}
            </div>
          }
        />

        <SCard
          title='Skills'
          content={
            <div className='mt-2 flex gap-2'>
              {course.skillNames.map((skill) => (
                <Badge key={skill} variant='outline' className='text-sm'>
                  {skill}
                </Badge>
              ))}
            </div>
          }
        />

        <SCard
          title='Standards'
          content={
            <div className='mt-2 flex gap-2'>
              {course.standardNames.map((standard) => (
                <Badge key={standard} variant='outline' className='text-sm'>
                  {standard}
                </Badge>
              ))}
            </div>
          }
        />
      </div>

      {/* Right Column */}
      <div className='space-y-4'>
        <div className='relative aspect-[4/3] w-full overflow-hidden rounded-4xl shadow-lg'>
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        <SCard
          title='Metadata'
          content={
            <div className='space-y-1 text-sm'>
              <div>
                <strong>Created at:</strong> {createdAt}
              </div>
              <div>
                <strong>Last Modified:</strong> {updatedAt}
              </div>
              <div>
                <strong>Created By:</strong> {createdBy}
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
