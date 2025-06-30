'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SCard } from '@/components/shared/card/SCard'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Sample course data - replace with your actual data
const sampleCourses = [
  {
    id: '1',
    title: 'Introduction to Mathematics',
    description: 'Learn the fundamentals of mathematics with interactive lessons and exercises.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Mathematics',
    ageRangeLabel: '6-8 years',
    duration: '4 weeks'
  },
  {
    id: '2',
    title: 'Basic Science Concepts',
    description: 'Explore the world of science through fun experiments and activities.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Science',
    ageRangeLabel: '9-11 years',
    duration: '6 weeks'
  },
  {
    id: '3',
    title: 'English Grammar Essentials',
    description: 'Master English grammar with practical examples and exercises.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'English',
    ageRangeLabel: '12-14 years',
    duration: '8 weeks'
  },
  {
    id: '4',
    title: 'World History Overview',
    description: 'Journey through time and discover major historical events.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'History',
    ageRangeLabel: '15-17 years',
    duration: '10 weeks'
  },
  {
    id: '5',
    title: 'Geography Adventures',
    description: 'Explore different countries and learn about their cultures.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Geography',
    ageRangeLabel: '9-11 years',
    duration: '5 weeks'
  },
  {
    id: '6',
    title: 'Art and Creativity',
    description: 'Express yourself through various art forms and techniques.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Art',
    ageRangeLabel: '6-8 years',
    duration: '6 weeks'
  },
  {
    id: '7',
    title: 'Music Theory Basics',
    description: 'Learn to read music and understand musical concepts.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Music',
    ageRangeLabel: '12-14 years',
    duration: '7 weeks'
  },
  {
    id: '8',
    title: 'Physical Education Fun',
    description: 'Stay active and healthy with engaging physical activities.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Physical Education',
    ageRangeLabel: '6-8 years',
    duration: '4 weeks'
  },
  {
    id: '9',
    title: 'Advanced Mathematics',
    description: 'Tackle complex mathematical problems and theories.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Mathematics',
    ageRangeLabel: '15-17 years',
    duration: '12 weeks'
  },
  {
    id: '10',
    title: 'Chemistry Fundamentals',
    description: 'Discover the building blocks of matter and chemical reactions.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'Science',
    ageRangeLabel: '15-17 years',
    duration: '8 weeks'
  },
  {
    id: '11',
    title: 'Creative Writing Workshop',
    description: 'Develop your writing skills through creative exercises.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'English',
    ageRangeLabel: '12-14 years',
    duration: '6 weeks'
  },
  {
    id: '12',
    title: 'Ancient Civilizations',
    description: 'Learn about ancient cultures and their contributions.',
    imageUrl: '/images/STEMlearning.jpg',
    categoryNames: 'History',
    ageRangeLabel: '12-14 years',
    duration: '9 weeks'
  }
]

interface CourseContentProps {
  courses?: typeof sampleCourses
}

export function CourseList({ courses = sampleCourses }: CourseContentProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 6
  
  // Calculate pagination
  const totalPages = Math.ceil(courses.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const endIndex = startIndex + coursesPerPage
  const currentCourses = courses.slice(startIndex, endIndex)
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <SCard
        title="Your Courses"
        description="Continue your learning journey with these courses"
        content={
          <div className="space-y-6">
            {/* Course Grid */}
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 place-items-center'>
              {currentCourses.map((resource) => (
                <Link href={`/resources/courses/${resource.id}`} key={resource.id}>
                  <CardLayout
                    size='lg'
                    imageSrc={resource.imageUrl}
                    infor={<Badge>{resource.categoryNames}</Badge>}
                  >
                    <div className='flex min-h-0 flex-1 flex-col'>
                      <h3 className='text-lg font-semibold'>{resource.title}</h3>
                      <p className='text-sm text-gray-600'>{resource.description}</p>
                      {/* footer */}
                      <div className='mt-auto flex items-center gap-2'>
                        <Badge className='bg-blue-100 text-blue-800'>{resource.ageRangeLabel}</Badge>
                        <Badge className='bg-green-100 text-green-800'>{resource.duration}</Badge>
                      </div>
                    </div>
                  </CardLayout>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'text-blue-600 bg-blue-50 border border-blue-300'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        }
      />
    </div>
  )
}