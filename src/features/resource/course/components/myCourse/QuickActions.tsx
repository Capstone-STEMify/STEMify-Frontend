'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Calendar, Bell } from 'lucide-react'

const actions = [
  { icon: Plus, label: 'Enroll New Course', color: 'bg-amber-400 hover:bg-amber-500' },
  { icon: Search, label: 'Browse Catalog', color: 'bg-sky-400 hover:bg-sky-500' },
  { icon: Calendar, label: 'Schedule Study', color: 'bg-amber-400 hover:bg-amber-500' },
  { icon: Bell, label: 'Notifications', color: 'bg-sky-400 hover:bg-sky-500' }
]

export function QuickActions() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-gray-600">Get started with your learning journey</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.color} text-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <action.icon className="w-8 h-8 mx-auto mb-3" />
              <div className="text-sm font-medium">{action.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}