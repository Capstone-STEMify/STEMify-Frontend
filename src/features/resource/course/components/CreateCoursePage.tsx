'use client'

export interface CourseFormData {
  selectedCategories: string[]
  courseTitle: string
  courseDescription: string
  selectedAgeRanges: string[]
  selectedStandards: string[]
  takeAways: string[]
}

import { SCard } from '@/components/shared/card/SCard'
import React, { useState } from 'react'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import { CourseBasicInfo } from '@/features/resource/course/components/manage/create/CourseBasicInfo'
import { MultiSelectDropdown } from '@/components/shared/MultiSelectDropdown'
import { CoverImageUpload } from '@/features/resource/course/components/manage/create/CoverImageUpload'
import { SkillsLearned } from '@/features/resource/course/components/manage/create/SkillsLearned'
import { CourseActionButtons } from '@/features/resource/course/components/manage/create/CourseActionButtons'
import { CourseContent } from './manage/content/CourseContent' 

type TabType = 'basic-info' | 'course-content' | 'fee'

export default function CreateCourse() {
  const [activeTab, setActiveTab] = useState<TabType>('basic-info')
  const [formData, setFormData] = useState<CourseFormData>({
    selectedCategories: [],
    courseTitle: '',
    courseDescription: '',
    selectedAgeRanges: [],
    selectedStandards: [],
    takeAways: [
      'Clearly define the specific learning objectives at the start of the course.',
      'Create content that is interactive and engaging for better student retention.',
      'Include assessments and quizzes to measure student learning experience and progress.'
    ]
  })

  const categories = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Music', 'Physical Education']
  const ageRanges = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years']
  const standards = [
    'Common Core State Standards',
    'Next Generation Science Standards',
    'International Baccalaureate',
    'Cambridge International',
    'Advanced Placement (AP)',
    'SAT Subject Tests',
    'CEFR Language Standards',
    'National Curriculum Standards'
  ]

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category]
    }))
  }

  const handleAgeRangeToggle = (ageRange: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAgeRanges: prev.selectedAgeRanges.includes(ageRange)
        ? prev.selectedAgeRanges.filter((a) => a !== ageRange)
        : [...prev.selectedAgeRanges, ageRange]
    }))
  }

  const handleStandardToggle = (standard: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStandards: prev.selectedStandards.includes(standard)
        ? prev.selectedStandards.filter((s) => s !== standard)
        : [...prev.selectedStandards, standard]
    }))
  }

  const handleRemoveCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.filter((c) => c !== category)
    }))
  }

  const handleRemoveAgeRange = (ageRange: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAgeRanges: prev.selectedAgeRanges.filter((a) => a !== ageRange)
    }))
  }

  const handleRemoveStandard = (standard: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStandards: prev.selectedStandards.filter((s) => s !== standard)
    }))
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, courseTitle: title }))
  }

  const handleDescriptionChange = (description: string) => {
    setFormData((prev) => ({ ...prev, courseDescription: description }))
  }

  const handleUpdateTakeAways = (takeAways: string[]) => {
    setFormData((prev) => ({ ...prev, takeAways }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info':
        return (
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='space-y-6 lg:col-span-2'>
              <CourseBasicInfo
                courseTitle={formData.courseTitle}
                courseDescription={formData.courseDescription}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
              />

              <SCard
                title='Course Category'
                description='Select multiple course categories for this class'
                content={
                  <>
                    {categories.length > 0 && (
                      <div className='mb-4 flex flex-wrap gap-2'>
                        {categories.map((value) => (
                          <span
                            key={value}
                            className={`inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-500`}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                }
              />

              <SCard
                title='Age Ranges'
                description='Which age ranges is this course intended for?'
                content={
                  <>
                    {ageRanges.length > 0 && (
                      <div className='mb-4 flex flex-wrap gap-2'>
                        {ageRanges.map((value) => (
                          <span
                            key={value}
                            className={`inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-500`}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                }
              />

              <SCard
                title='Standards'
                description='Select the education standards this course aligns with'
                content={
                  <>
                    {standards.length > 0 && (
                      <div className='mb-4 flex flex-wrap gap-2'>
                        {standards.map((value) => (
                          <span
                            key={value}
                            className={`inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-500`}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                }
              />

              <SCard
                title='Grades'
                description='Select the education grades this course aligns with'
                content={
                  <div className='space-y-2'>
                    <div className='space-y-1 text-sm text-gray-600'>
                      <div>
                        <span className='font-medium'>United States:</span> K, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, UK
                      </div>
                      <div>
                        <span className='font-medium'>England:</span> Early Years, Year 1, Year 2, Year 3, Year 4, Year 5,
                        Year 6, Year 7, Year 8
                      </div>
                      <div>
                        <span className='font-medium'>UK - Scotland:</span> Early Learning and Childcare, S1, P1
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              <CoverImageUpload />
              <SkillsLearned takeAways={formData.takeAways} onUpdateTakeAways={handleUpdateTakeAways} />
              <CourseActionButtons />
            </div>
          </div>
        )
      
      case 'course-content':
        return <CourseContent />
      
      case 'fee':
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Fee content will be implemented here</p>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex space-x-6'>
              <button 
                onClick={() => setActiveTab('basic-info')}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === 'basic-info' 
                    ? 'border-b-2 border-amber-500 text-amber-400' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic Info
              </button>
              <button 
                onClick={() => setActiveTab('course-content')}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === 'course-content' 
                    ? 'border-b-2 border-amber-500 text-amber-400' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Course content
              </button>
              <button 
                onClick={() => setActiveTab('fee')}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === 'fee' 
                    ? 'border-b-2 border-amber-500 text-amber-400' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Fee
              </button>
            </div>
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  )
}