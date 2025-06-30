'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, PlayCircle } from 'lucide-react'

const progressData = [
  {
    status: 'Completed',
    count: 8,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    status: 'In Progress',
    count: 3,
    icon: PlayCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  {
    status: 'Not Started',
    count: 1,
    icon: Clock,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100'
  }
]

export function ProgressOverview() {
  return (
    <section className="py-12 bg-gradient-to-br from-sky-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Progress</h2>
          <p className="text-gray-600">Overview of your course completion status</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressData.map((item, index) => (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`${item.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{item.count}</div>
                <div className="text-gray-600 font-medium">{item.status}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-amber-600">87%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '87%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-amber-500 to-sky-500 h-3 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}