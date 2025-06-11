import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react'
import { Video, Users } from 'lucide-react';

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

export default function FeatureCardSec() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: Video,
      title: "Get Started with Video",
      description: "Quality video lectures can set your classroom apart. Use our resources to learn the basics.",
      illustration: "bg-gradient-to-br from-purple-100 to-blue-100"
    },
    {
      icon: Users,
      title: "Build Your Audience",
      description: "Set your classroom up for success by building your target audience.",
      illustration: "bg-gradient-to-br from-green-100 to-teal-100"
    }
  ];

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start gap-6">
              <div className={`w-24 h-24 ${feature.illustration} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <feature.icon className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="text-amber-400 hover:text-amber-500 underline font-medium transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
