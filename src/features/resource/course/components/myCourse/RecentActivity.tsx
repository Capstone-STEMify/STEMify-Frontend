'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, BookOpen, Award, MessageCircle } from 'lucide-react'

const activities = [
  {
    icon: BookOpen,
    title: 'Completed Lesson 5',
    course: 'Advanced Mathematics',
    time: '2 hours ago',
    color: 'text-amber-600'
  },
  {
    icon: Award,
    title: 'Earned Certificate',
    course: 'English Grammar Essentials',
    time: '1 day ago',
    color: 'text-sky-600'
  },
  {
    icon: MessageCircle,
    title: 'Participated in Discussion',
    course: 'World History Overview',
    time: '2 days ago',
    color: 'text-amber-600'
  },
  {
    icon: Clock,
    title: 'Started New Module',
    course: 'Chemistry Fundamentals',
    time: '3 days ago',
    color: 'text-sky-600'
  }
]

export function RecentActivity() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">Keep track of your latest learning activities</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`${activity.color} bg-opacity-10 p-3 rounded-full`}>
                  <activity.icon className={`w-6 h-6 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.course}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}