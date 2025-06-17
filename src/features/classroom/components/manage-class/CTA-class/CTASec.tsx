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

export default function CTASec() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="max-w-7xl mx-auto px-6 py-12 text-center"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Are You Ready to Begin?</h2>
      <button className="bg-amber-400 hover:bg-amber-500 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
        Create Your Classroom
      </button>
    </motion.section>
  );
}
