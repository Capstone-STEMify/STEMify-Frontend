import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};


export default function SubHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.header 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-gray-600">
          Jump Into Classroom Creation
        </div>
        <button className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Create Your Classroom
        </button>
      </div>
    </motion.header>
  );
}
