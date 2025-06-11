
import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users } from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
};

export default function HeroClassSec() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-6 pt-12"
    >
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <p className="text-gray-600 mb-8">Based on your experience, we think these resources will be helpful.</p>
      </motion.div>

      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-48 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-12 bg-amber-400 rounded opacity-80"></div>
                <div className="absolute -top-2 -right-2 w-12 h-8 bg-orange-400 rounded opacity-60"></div>
                <Users className="absolute top-1 left-1 w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create an Engaging Classroom</h2>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Whether you've been teaching for years or are teaching for the first time, you can 
              make an engaging classroom. We've compiled resources and best practices to help you 
              get to the next level, no matter where you're starting.
            </p>
            <button className="text-amber-400 hover:text-amber-500 underline rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
