'use client'
import React, { useState } from 'react'
import { Plus, BookOpen, FileText } from 'lucide-react'
import QuizComponent from './section/quiz/CreateQuiz'
import ContentComponent from './section/content/CreateContent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'

export default function CreateLesson() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                  1
                </div>
                <span className="text-sm font-medium text-gray-900">Course Details</span>
              </div>
              
              {/* Connector */}
              <div className="w-24 h-px bg-gray-300 border-t-2 border-dashed mx-8 mt-[-20px]"></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                  2
                </div>
                <span className="text-sm font-medium text-gray-900">Lesson Details</span>
              </div>
              
              {/* Connector */}
              <div className="w-24 h-px bg-gray-300 border-t-2 border-dashed mx-8 mt-[-20px]"></div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                  3
                </div>
                <span className="text-sm font-medium text-gray-500">FAQ</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-6xl px-4 py-8'>
        {/* Module Header */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>Section 3 : Types of Niches in Amazon KDP</h2>
            <button className='flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50'>
              <Plus className='h-4 w-4' />
              Add Section
            </button>
          </div>

          <div className='mb-4 text-sm text-gray-600'>Lesson 1 - 4: Quiz</div>

          <div className='flex items-center gap-3 rounded-md bg-gray-50 p-4'>
            <FileText className='h-5 w-5 text-gray-400' />
            <span className='font-medium text-gray-700'>First Quiz of this section</span>
          </div>
        </div>

        {/* Tabs with Components */}
        <Tabs defaultValue='quiz' className='rounded-lg border border-gray-200 bg-white p-6'>
          <TabsList>
            <TabsTrigger value='quiz'>
              <BookOpen className='h-4 w-4' />
              Quiz
            </TabsTrigger>
            <TabsTrigger value='content'>
              <FileText className='h-4 w-4' />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value='quiz'>
            <QuizComponent />
          </TabsContent>

          <TabsContent value='content'>
            <ContentComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
