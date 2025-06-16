'use client'
import React, { useState } from 'react'
import { ChevronDown, Upload, X, Plus, Edit3, Save, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreateCoursePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([])
  const [selectedStandards, setSelectedStandards] = useState<string[]>([])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showAgeRangeDropdown, setShowAgeRangeDropdown] = useState(false)
  const [showStandardsDropdown, setShowStandardsDropdown] = useState(false)
  const [takeAways, setTakeAways] = useState<string[]>([
    'Clearly define the specific learning objectives at the start of the course.',
    'Create content that is interactive and engaging for better student retention.',
    'Include assessments and quizzes to measure student learning experience and progress.'
  ])
  const [newTakeAway, setNewTakeAway] = useState('')
  const [isEditingTakeAways, setIsEditingTakeAways] = useState(false)
  const [editingTakeAways, setEditingTakeAways] = useState<string[]>([])

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

  const handleStandardToggle = (standard: string) => {
    setSelectedStandards((prev) => (prev.includes(standard) ? prev.filter((s) => s !== standard) : [...prev, standard]))
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleAgeRangeToggle = (ageRange: string) => {
    setSelectedAgeRanges((prev) => (prev.includes(ageRange) ? prev.filter((a) => a !== ageRange) : [...prev, ageRange]))
  }

  const removeStandard = (standard: string) => {
    setSelectedStandards((prev) => prev.filter((s) => s !== standard))
  }

  const removeCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category))
  }

  const removeAgeRange = (ageRange: string) => {
    setSelectedAgeRanges((prev) => prev.filter((a) => a !== ageRange))
  }

  const handleEditTakeAways = () => {
    setIsEditingTakeAways(true)
    setEditingTakeAways([...takeAways])
    setNewTakeAway('')
  }

  const handleAddTakeAway = () => {
    if (newTakeAway.trim()) {
      setEditingTakeAways((prev) => [...prev, newTakeAway.trim()])
      setNewTakeAway('')
    }
  }

  const handleRemoveTakeAway = (index: number) => {
    setEditingTakeAways((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateTakeAway = (index: number, value: string) => {
    setEditingTakeAways((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const handleSaveTakeAways = () => {
    setTakeAways(editingTakeAways.filter((item) => item.trim()))
    setIsEditingTakeAways(false)
    setNewTakeAway('')
  }

  const handleCancelTakeAways = () => {
    setIsEditingTakeAways(false)
    setEditingTakeAways([])
    setNewTakeAway('')
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-6'>
          <nav className='mb-4 text-sm text-gray-600'>
            <span>Course Management</span>
            <span className='mx-2'>/</span>
            <span className='text-amber-400'>Create Course</span>
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
            {/* Course Category */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold'>Course Category</h3>

              {/* Selected Categories */}
              {selectedCategories.length > 0 && (
                <div className='mb-4 flex flex-wrap gap-2'>
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className='inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-500'
                    >
                      {category}
                      <button onClick={() => removeCategory(category)} className='ml-2 hover:text-blue-500'>
                        <X className='h-4 w-4' />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className='relative'>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className='flex w-full items-center justify-between rounded-lg border border-gray-300 p-3 text-left hover:border-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                >
                  <span className='text-gray-400'>Select categories (multiple selection allowed)</span>
                  <ChevronDown className='h-5 w-5 text-gray-400' />
                </button>

                {showCategoryDropdown && (
                  <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg'>
                    {categories.map((category) => (
                      <label key={category} className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50'>
                        <input
                          type='checkbox'
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className='mr-3 h-4 w-4 rounded border-gray-300 text-amber-400 focus:ring-amber-500'
                        />
                        <span className='text-sm'>{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Title */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold'>Course Title</h3>
              <input
                type='text'
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder='Enter course title'
                className='w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none'
              />
            </div>

            {/* Age Range */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold'>Age Range</h3>

              {/* Selected Age Ranges */}
              {selectedAgeRanges.length > 0 && (
                <div className='mb-4 flex flex-wrap gap-2'>
                  {selectedAgeRanges.map((ageRange) => (
                    <span
                      key={ageRange}
                      className='inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-400'
                    >
                      {ageRange}
                      <button onClick={() => removeAgeRange(ageRange)} className='ml-2 hover:text-green-600'>
                        <X className='h-4 w-4' />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className='relative'>
                <button
                  onClick={() => setShowAgeRangeDropdown(!showAgeRangeDropdown)}
                  className='flex w-full items-center justify-between rounded-lg border border-gray-300 p-3 text-left hover:border-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                >
                  <span className='text-gray-400'>Select age ranges (multiple selection allowed)</span>
                  <ChevronDown className='h-5 w-5 text-gray-400' />
                </button>

                {showAgeRangeDropdown && (
                  <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg'>
                    {ageRanges.map((ageRange) => (
                      <label key={ageRange} className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50'>
                        <input
                          type='checkbox'
                          checked={selectedAgeRanges.includes(ageRange)}
                          onChange={() => handleAgeRangeToggle(ageRange)}
                          className='mr-3 h-4 w-4 rounded border-gray-300 text-amber-400 focus:ring-amber-500'
                        />
                        <span className='text-sm'>{ageRange}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Standards */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold'>Standards</h3>

              {/* Selected Standards */}
              {selectedStandards.length > 0 && (
                <div className='mb-4 flex flex-wrap gap-2'>
                  {selectedStandards.map((standard) => (
                    <span
                      key={standard}
                      className='inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-400'
                    >
                      {standard}
                      <button onClick={() => removeStandard(standard)} className='ml-2 hover:text-amber-400'>
                        <X className='h-4 w-4' />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className='relative'>
                <button
                  onClick={() => setShowStandardsDropdown(!showStandardsDropdown)}
                  className='flex w-full items-center justify-between rounded-lg border border-gray-300 p-3 text-left hover:border-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                >
                  <span className='text-gray-400'>Select standards (multiple selection allowed)</span>
                  <ChevronDown className='h-5 w-5 text-gray-400' />
                </button>

                {showStandardsDropdown && (
                  <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg'>
                    {standards.map((standard) => (
                      <label key={standard} className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-50'>
                        <input
                          type='checkbox'
                          checked={selectedStandards.includes(standard)}
                          onChange={() => handleStandardToggle(standard)}
                          className='mr-3 h-4 w-4 rounded border-gray-300 text-amber-400 focus:ring-amber-500'
                        />
                        <span className='text-sm'>{standard}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Description */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold'>Course Description</h3>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder='Enter course description...'
                rows={6}
                className='w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none'
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Cover Image */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold'>Cover Image</h3>
              <div className='rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
                <Upload className='mx-auto mb-4 h-12 w-12 text-sky-400' />
                <p className='mb-2 text-sm text-gray-600'>Upload cover image</p>
                <p className='text-xs text-gray-400'>make the course more engaging</p>
                <button className='mt-4 rounded-lg bg-amber-400 px-4 py-2 text-white transition-colors hover:bg-amber-500'>
                  Choose File
                </button>
              </div>
            </div>

            {/* Take Aways */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Skills Learned</h3>
                {!isEditingTakeAways && (
                  <button
                    onClick={handleEditTakeAways}
                    className='flex items-center gap-2 rounded-lg px-3 py-1 text-sm text-amber-400 transition-colors hover:bg-amber-50'
                  >
                    <Edit3 className='h-4 w-4' />
                    Edit
                  </button>
                )}
              </div>

              {!isEditingTakeAways ? (
                // Display mode
                <ul className='space-y-3 text-sm'>
                  {takeAways.map((takeAway, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400'></span>
                      <span>{takeAway}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                // Edit mode
                <div className='space-y-4'>
                  {/* Existing items being edited */}
                  {editingTakeAways.map((takeAway, index) => (
                    <div key={index} className='flex items-start gap-2'>
                      <span className='mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400'></span>
                      <textarea
                        value={takeAway}
                        onChange={(e) => handleUpdateTakeAway(index, e.target.value)}
                        className='flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none'
                        rows={2}
                      />
                      <button
                        onClick={() => handleRemoveTakeAway(index)}
                        className='mt-2 text-red-500 hover:text-red-700'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  ))}

                  {/* Add new item */}
                  <div className='flex items-start gap-2'>
                    <span className='mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400'></span>
                    <textarea
                      value={newTakeAway}
                      onChange={(e) => setNewTakeAway(e.target.value)}
                      placeholder='Add new take away...'
                      className='flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none'
                      rows={2}
                    />
                    <button
                      onClick={handleAddTakeAway}
                      disabled={!newTakeAway.trim()}
                      className='mt-2 text-amber-400 hover:text-amber-500 disabled:cursor-not-allowed disabled:text-gray-400'
                    >
                      <Plus className='h-4 w-4' />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className='flex gap-2 pt-2'>
                    <button
                      onClick={handleSaveTakeAways}
                      className='flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-500'
                    >
                      <Save className='h-4 w-4' />
                      Save
                    </button>
                    <button
                      onClick={handleCancelTakeAways}
                      className='flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50'
                    >
                      <XCircle className='h-4 w-4' />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link href={'https://localhost:3000/teacher/course-management/create-course/create-lesson'}>
                <button className='flex-1 rounded-lg bg-amber-400 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-500'>
                  Save Course
                </button>
              </Link>
              <button className='flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'>
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
