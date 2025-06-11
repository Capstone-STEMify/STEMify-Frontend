import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';
import React, { useRef } from 'react'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function TipSec() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="max-w-7xl mx-auto px-6 pb-8"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-48 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-12 h-12 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the New Teacher Challenge!</h2>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Get exclusive tips and resources designed to help you launch your first classroom 
              faster! Eligible teachers who publish their first classroom on time will receive a special 
              bonus to celebrate. Start today!
            </p>
            <button className="text-amber-400 hover:text-amber-500 underline rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
