import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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

export default function RecommendationSection () {
  const courses = [
    {
      title: "React - The Complete Guide 2025 (incl. Next.js, Redux)",
      author: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
      rating: 4.6,
      students: "100+",
      age: "8 - 14 years old"
    },
    {
      title: "The Ultimate React Course 2024: React, Next.js...",
      author: "Master modern React from beginner to advanced! Context API, React Query, Redux Toolkit, Tailwind, advanced patterns",
      rating: 4.7,
      students: "130+",
      age: "8 - 14 years old"
    },
    {
      title: "Front-end Web Development with React from...",
      author: "This course explores the front-end web development using the popular React framework. You will learn React Router and Flux architecture",
      rating: 4.5,
      students: "50+",
      age: "8 - 14 years old"
    }
  ];

  return (
    <motion.section 
      id="suggestions"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 variants={staggerItem} className="text-3xl font-bold text-gray-900 mb-8">
          Students also bought
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course, index) => (
            <motion.div key={index} variants={staggerItem} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {course.age}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.author}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{course.students}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <button className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Show more courses
          </button>
        </div>
      </div>
    </motion.section>
  );
};