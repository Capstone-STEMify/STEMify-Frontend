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
// Main component - CreateCoursePage.tsx
import { CourseActionButtons } from '@/features/course/components/create-course/CourseActionButtons'
import { CourseBasicInfo } from '@/features/course/components/create-course/CourseBasicInfo'
import { CoverImageUpload } from '@/features/course/components/create-course/CoverImageUpload'
import { MultiSelectDropdown } from '@/components/shared/MultiSelectDropdown'
import { SkillsLearned } from '@/features/course/components/create-course/SkillsLearned'
import React, { useState } from 'react'
import SBreadcrumb from '@/components/shared/SBreadcrumb'

export default function CreateCoursePage() {
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

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6'>
          <nav className='mb-4 text-sm text-gray-600'>
            <SBreadcrumb />
          </nav>

          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex space-x-6'>
              <button className='border-b-2 border-amber-500 pb-2 font-medium text-amber-400'>Basic Info</button>
              <button className='pb-2 text-gray-500'>Course content</button>
              <button className='pb-2 text-gray-500'>Fee</button>
            </div>
          </div>
        </div>

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
                <MultiSelectDropdown
                  placeholder='Select categories (multiple selection allowed)'
                  options={categories}
                  selectedValues={formData.selectedCategories}
                  onToggle={handleCategoryToggle}
                  onRemove={handleRemoveCategory}
                  tagColor='sky'
                />
              }
            />

            <SCard
              title='Age Ranges'
              description='Which age ranges is this course intended for?'
              content={
                <MultiSelectDropdown
                  placeholder='Select age ranges'
                  options={ageRanges}
                  selectedValues={formData.selectedAgeRanges}
                  onToggle={handleAgeRangeToggle}
                  onRemove={handleRemoveAgeRange}
                  tagColor='green'
                />
              }
            />

            <SCard
              title='Standards'
              description='Select the education standards this course aligns with'
              content={
                <MultiSelectDropdown
                  placeholder='Select standards'
                  options={standards}
                  selectedValues={formData.selectedStandards}
                  onToggle={handleStandardToggle}
                  onRemove={handleRemoveStandard}
                  tagColor='blue'
                />
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
      </div>
    </div>
  )
}
