'use client'
import React from 'react';
import { motion } from 'framer-motion';
import CourseDetails from './guide/GuideDetails';
import SyllabusTable from './guide/GuideTable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const PacingGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <CourseDetails />
          <SyllabusTable />
        </motion.div>
      </div>
    </div>
  );
};

export default PacingGuide;