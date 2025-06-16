'use client'
import React, { useState } from 'react';
import { ChevronDown, Upload, X, Plus, Edit3, Save, XCircle } from 'lucide-react';

export default function CreateCoursePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAgeRangeDropdown, setShowAgeRangeDropdown] = useState(false);
  const [showStandardsDropdown, setShowStandardsDropdown] = useState(false);
  const [takeAways, setTakeAways] = useState<string[]>([
    'Clearly define the specific learning objectives at the start of the course.',
    'Create content that is interactive and engaging for better student retention.',
    'Include assessments and quizzes to measure student learning experience and progress.'
  ]);
  const [newTakeAway, setNewTakeAway] = useState('');
  const [isEditingTakeAways, setIsEditingTakeAways] = useState(false);
  const [editingTakeAways, setEditingTakeAways] = useState<string[]>([]);

  const categories = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Art',
    'Music',
    'Physical Education'
  ];

  const ageRanges = [
    '3-5 years',
    '6-8 years',
    '9-11 years',
    '12-14 years',
    '15-17 years',
    '18+ years'
  ];

  const standards = [
    'Common Core State Standards',
    'Next Generation Science Standards',
    'International Baccalaureate',
    'Cambridge International',
    'Advanced Placement (AP)',
    'SAT Subject Tests',
    'CEFR Language Standards',
    'National Curriculum Standards'
  ];

  const handleStandardToggle = (standard: string) => {
    setSelectedStandards(prev => 
      prev.includes(standard) 
        ? prev.filter(s => s !== standard)
        : [...prev, standard]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAgeRangeToggle = (ageRange: string) => {
    setSelectedAgeRanges(prev => 
      prev.includes(ageRange) 
        ? prev.filter(a => a !== ageRange)
        : [...prev, ageRange]
    );
  };

  const removeStandard = (standard: string) => {
    setSelectedStandards(prev => prev.filter(s => s !== standard));
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const removeAgeRange = (ageRange: string) => {
    setSelectedAgeRanges(prev => prev.filter(a => a !== ageRange));
  };

  const handleEditTakeAways = () => {
    setIsEditingTakeAways(true);
    setEditingTakeAways([...takeAways]);
    setNewTakeAway('');
  };

  const handleAddTakeAway = () => {
    if (newTakeAway.trim()) {
      setEditingTakeAways(prev => [...prev, newTakeAway.trim()]);
      setNewTakeAway('');
    }
  };

  const handleRemoveTakeAway = (index: number) => {
    setEditingTakeAways(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateTakeAway = (index: number, value: string) => {
    setEditingTakeAways(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSaveTakeAways = () => {
    setTakeAways(editingTakeAways.filter(item => item.trim()));
    setIsEditingTakeAways(false);
    setNewTakeAway('');
  };

  const handleCancelTakeAways = () => {
    setIsEditingTakeAways(false);
    setEditingTakeAways([]);
    setNewTakeAway('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <span>Course Management</span>
            <span className="mx-2">/</span>
            <span className="text-amber-400">Create Course</span>
          </nav>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex space-x-6">
              <button className="text-amber-400 border-b-2 border-amber-500 pb-2 font-medium">
                Basic Info
              </button>
              <button className="text-gray-500 pb-2">
                Course content
              </button>
              <button className="text-gray-500 pb-2">
                Fee
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Category */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Course Category</h3>
              
              {/* Selected Categories */}
              {selectedCategories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-500"
                    >
                      {category}
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-2 hover:text-blue-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <span className="text-gray-400">
                    Select categories (multiple selection allowed)
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showCategoryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="mr-3 h-4 w-4 text-amber-400 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Title */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Course Title</h3>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Enter course title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Age Range */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Age Range</h3>
              
              {/* Selected Age Ranges */}
              {selectedAgeRanges.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedAgeRanges.map((ageRange) => (
                    <span
                      key={ageRange}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-400"
                    >
                      {ageRange}
                      <button
                        onClick={() => removeAgeRange(ageRange)}
                        className="ml-2 hover:text-green-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowAgeRangeDropdown(!showAgeRangeDropdown)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <span className="text-gray-400">
                    Select age ranges (multiple selection allowed)
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showAgeRangeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {ageRanges.map((ageRange) => (
                      <label
                        key={ageRange}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAgeRanges.includes(ageRange)}
                          onChange={() => handleAgeRangeToggle(ageRange)}
                          className="mr-3 h-4 w-4 text-amber-400 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <span className="text-sm">{ageRange}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Standards */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Standards</h3>
              
              {/* Selected Standards */}
              {selectedStandards.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedStandards.map((standard) => (
                    <span
                      key={standard}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-400"
                    >
                      {standard}
                      <button
                        onClick={() => removeStandard(standard)}
                        className="ml-2 hover:text-amber-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowStandardsDropdown(!showStandardsDropdown)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <span className="text-gray-400">
                    Select standards (multiple selection allowed)
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                
                {showStandardsDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {standards.map((standard) => (
                      <label
                        key={standard}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStandards.includes(standard)}
                          onChange={() => handleStandardToggle(standard)}
                          className="mr-3 h-4 w-4 text-amber-400 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <span className="text-sm">{standard}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Course Description</h3>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Enter course description..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">Upload cover image</p>
                <p className="text-xs text-gray-400">make the course more engaging</p>
                <button className="mt-4 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors">
                  Choose File
                </button>
              </div>
            </div>

            {/* Take Aways */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Skills Learned</h3>
                {!isEditingTakeAways && (
                  <button
                    onClick={handleEditTakeAways}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-amber-400 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {!isEditingTakeAways ? (
                // Display mode
                <ul className="space-y-3 text-sm">
                  {takeAways.map((takeAway, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-sky-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{takeAway}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                // Edit mode
                <div className="space-y-4">
                  {/* Existing items being edited */}
                  {editingTakeAways.map((takeAway, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full mt-3 flex-shrink-0"></span>
                      <textarea
                        value={takeAway}
                        onChange={(e) => handleUpdateTakeAway(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={2}
                      />
                      <button
                        onClick={() => handleRemoveTakeAway(index)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add new item */}
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 flex-shrink-0"></span>
                    <textarea
                      value={newTakeAway}
                      onChange={(e) => setNewTakeAway(e.target.value)}
                      placeholder="Add new take away..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={2}
                    />
                    <button
                      onClick={handleAddTakeAway}
                      disabled={!newTakeAway.trim()}
                      className="text-amber-400 hover:text-amber-500 mt-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveTakeAways}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelTakeAways}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 px-6 py-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors font-medium">
                Save Course
              </button>
              <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};