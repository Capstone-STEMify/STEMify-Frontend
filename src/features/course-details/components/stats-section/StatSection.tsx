import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Award, Clock, Users } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15 
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 2 } } 
};

const statsData = [
  { 
    icon: BookOpen, 
    value: "1", 
    title: "Course lessons", 
    subtitle: "Comprehensive curriculum", 
    iconColor: "text-blue-600", 
    bgColor: "bg-blue-100" 
  },
  { 
    icon: Star, 
    value: "0 ★",
    title: "Rating", 
    subtitle: "0 reviews", 
    iconColor: "text-yellow-500", 
    bgColor: "bg-yellow-100" 
  },
  { 
    icon: Award, 
    value: "Intermediate", 
    title: "Difficulty", 
    subtitle: "Suitable for all levels", 
    iconColor: "text-green-600", 
    bgColor: "bg-green-100" 
  },
  { 
    icon: Clock, 
    value: "1", 
    title: "Hour(s)", 
    subtitle: "Self-paced learning", 
    iconColor: "text-purple-600", 
    bgColor: "bg-purple-100" 
  },
  { 
    icon: Users, 
    value: "0", 
    title: "Students", 
    subtitle: "Join the community", 
    iconColor: "text-red-500", 
    bgColor: "bg-red-100" 
  }
];

export default function StatsSection() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} 
      variants={staggerContainer}
      className="absolute -bottom-24 inset-x-0 z-10 px-4 sm:px-6 lg:px-8" 
    >
      <div className="bg-white max-w-7xl mx-auto p-6 sm:px-6 lg:px-8 rounded-lg shadow-lg"> 
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6"> 
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={staggerItem} 
              className="text-center py-2" 
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-full mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-700 mt-1">{stat.title}</div>
              {stat.subtitle && (
                <div className="text-xs text-gray-500 mt-0.5">{stat.subtitle}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};