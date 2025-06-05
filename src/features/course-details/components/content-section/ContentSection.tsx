import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronDown, Play, Users } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function ContentSection() {
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null);
  
  const lectures = [
    {
      id: 1,
      title: "Introduction to Relational Databases",
      duration: "8 lectures",
      time: "01:07:31",
      isExpanded: false
    },
    {
      id: 2,
      title: "What is a Database? Relational Model",
      duration: "1 lecture",
      time: "07:30",
      isExpanded: false
    }
  ];

  return (
    <motion.section 
      id="courses"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="py-12 md:py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">Course Content</h2>
        
        <div className="mb-6 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
          <span>📚 1 sections</span>
          <span>🎥 8 lectures</span>
          <span>⏱️ 1 minutes total</span>
        </div>

        <div className='flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12'>
          <div className="space-y-4 w-full lg:w-2/3"> 
            {lectures.map((lecture) => (
              <div key={lecture.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedLecture(expandedLecture === lecture.id ? null : lecture.id)}
                  className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center mb-2 sm:mb-0"> 
                    <BookOpen className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" /> 
                    <span className="font-medium text-gray-900">{lecture.title}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 sm:ml-4"> 
                    <span className="mr-3 sm:mr-4">{lecture.duration}</span>
                    <span className="mr-3 sm:mr-4">{lecture.time}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                      expandedLecture === lecture.id ? 'rotate-180' : ''
                    }`} />
                  </div>
                </button>
                
                {expandedLecture === lecture.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="border-t border-gray-200 p-4 bg-gray-50 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                        <Play className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Lecture content will be displayed here (e.g., Video Title 1)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                        <Play className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Sub-topic or resource link</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
            
          <div className="bg-white rounded-lg p-6 shadow-xl w-full lg:w-1/3 lg:sticky lg:top-24"> 
            <h3 className="text-xl font-bold text-gray-900 mb-6">Instructors</h3>
            <div className="flex items-start">
              <img src={'/images/Rosie.jpg'} className="w-16 h-16 rounded-full mr-4 flex-shrink-0"/>
              <div>
                <h4 className="font-medium text-gray-900 mb-1 break-all">awesomeorg@gmail.com</h4> 
                <p className="text-sm text-gray-600 mb-2">by Coursera • ⭐️ 4.8 Reviews</p> 
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1 text-blue-500" /> 
                  <span>Expert Instructor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};