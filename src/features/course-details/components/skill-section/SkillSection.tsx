import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

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

export default function SkillSection() {
  const outcomes = [
    {
      title: "Ways to create and describe a game concept",
      items: [
        "Ways to create and describe a game concept",
        "Ways to create and describe a game concept",
        "Ways to create and describe a game concept"
      ]
    },
    {
      title: "Concepts and approaches involved in creating successful character designs",
      items: [
        "Concepts and approaches involved in creating successful character designs",
        "Concepts and approaches involved in creating successful character designs",
        "Concepts and approaches involved in creating successful character designs"
      ]
    },
    {
      title: "Evaluation and interpretation of different story styles",
      items: [
        "Evaluation and interpretation of different story styles",
        "Evaluation and interpretation of different story styles",
        "Evaluation and interpretation of different story styles"
      ]
    }
  ];

  return (
    <motion.section 
      id="skill"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 variants={staggerItem} className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Skills learned from the course
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {outcomes.map((outcome, index) => (
            <motion.div key={index} variants={staggerItem} className="space-y-4">
              {outcome.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
