'use client'

import React from 'react'
import { motion } from 'framer-motion'

const mockMyCourses = {
  courses: [
    { progress: { progressPercentage: 100 } },
    { progress: { progressPercentage: 87 } },
    { progress: { progressPercentage: 65 } },
    { progress: { progressPercentage: 100 } },
    { progress: { progressPercentage: 43 } },
    { progress: { progressPercentage: 92 } },
    { progress: { progressPercentage: 100 } },
    { progress: { progressPercentage: 78 } },
    { progress: { progressPercentage: 56 } },
    { progress: { progressPercentage: 34 } },
    { progress: { progressPercentage: 89 } },
    { progress: { progressPercentage: 100 } }
  ]
}

interface HeroSectionProps {
  myCourses?: typeof mockMyCourses
}

export function HeroSection({ myCourses = mockMyCourses }: HeroSectionProps) {
  const totalCourses = myCourses?.courses.length || 0
  const averageProgress = Math.round(
    (myCourses?.courses?.reduce(
      (sum, course) => sum + (course.progress?.progressPercentage || 0),
      0
    ) || 0) / (totalCourses || 1)
  )
  const completedCourses = myCourses?.courses.filter(
    (course) => course.progress?.progressPercentage === 100
  ).length || 0
  const inProgressCourses = myCourses?.courses.filter(
    (course) => course.progress?.progressPercentage > 0 && course.progress?.progressPercentage < 100
  ).length || 0
  const notStartedCourses = myCourses?.courses.filter(
    (course) => course.progress?.progressPercentage === 0
  ).length || 0

  const stats = [
    { label: 'Total Courses', value: totalCourses },
    { label: 'Completed', value: completedCourses },
    { label: 'In Progress', value: `${totalCourses - completedCourses - notStartedCourses}` },
    { label: 'Not Start', value: notStartedCourses }
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Your Learning Journey
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-blue-100 mb-4 max-w-xl"
            >
              Continue learning and developing your skills with your enrolled courses.
              {totalCourses > 0 && ` You're currently taking ${totalCourses} courses.`}
            </motion.p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <motion.h3 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="text-xl sm:text-2xl font-bold mb-1"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-blue-100 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                <span className="text-2xl font-bold text-white">{averageProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${averageProgress}%` }}
                  transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 h-3 rounded-full shadow-lg"
                  style={{
                    background: 'white'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <motion.img
              whileHover={{ 
                rotate: 0, 
                scale: 1.05,
                x: -10,
                transition: { 
                  duration: 0.3,
                  x: { 
                    repeat: 3, 
                    repeatType: "reverse", 
                    duration: 0.1 
                  }
                }
              }}
              src="/images/my_learning.png"
              alt="Learning illustration"
              className="w-[500px] h-[500px] rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 hover:shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}