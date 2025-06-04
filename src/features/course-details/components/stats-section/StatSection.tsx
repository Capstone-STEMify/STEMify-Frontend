import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Award, Clock, Users } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function StatsSection() {
  const stats = [
    { icon: BookOpen, label: "Comprehensive curriculum", value: "1" },
    { icon: Star, label: "Rating (8 reviews)", value: "0" },
    { icon: Award, label: "Difficulty", value: "Intermediate", subtitle: "Suitable for all levels" },
    { icon: Clock, label: "Hours", value: "1", subtitle: "Self-paced learning" },
    { icon: Users, label: "Enrolled", value: "0", subtitle: "Join the community" }
  ];

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="py-12 bg-white border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <motion.div key={index} variants={staggerItem} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
              {stat.subtitle && (
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};