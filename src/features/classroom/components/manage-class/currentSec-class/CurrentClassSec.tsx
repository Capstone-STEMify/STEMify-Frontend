import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react'
import { Users2 } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function CurrentClassSec() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const classrooms = [
    { name: 'test-classroom', members: 0, color: 'bg-gradient-to-r from-amber-400 to-red-500' },
    { name: 'test-classroom', members: 0, color: 'bg-gradient-to-r from-amber-400 to-red-500' }
  ];

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="bg-sky-100 rounded-t-lg pt-6 mb-8 border-3 border-[#e6eef7]">
        <div className='flex mb-6 items-start px-4'>

        <h3 className="text-lg font-semibold text-gray-900">
          Workspaces for teacher name
        </h3>
        </div>
        {classrooms.map((classroom, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="flex items-center justify-between bg-white p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-full h-full rounded"><img className='w-30 h-20 rounded' src="/HomeFiles/hcm.jpg" alt="class_img" /></div>
              <div className='w-full'>
                <h4 className="font-semibold text-gray-900">{classroom.name}</h4>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Users2 className="w-4 h-4" />
                  <span>{classroom.members} members</span>
                </div>
              </div>
            </div>
            <button className="bg-sky-300 hover:bg-sky-400 text-white p-2 rounded-lg font-medium transition-colors">
              View Class
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
