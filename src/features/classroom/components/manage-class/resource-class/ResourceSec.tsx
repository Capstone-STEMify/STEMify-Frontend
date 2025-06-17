import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react'
import { MessageCircle, BookOpen, BarChart3, HeadphonesIcon, Play } from 'lucide-react';

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

export default function ResourceSec() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const resources = [
    {
      icon: Play,
      title: "Test Video",
      description: "Send us a sample video and get expert feedback.",
      color: "text-amber-400"
    },
    {
      icon: MessageCircle,
      title: "Instructor Community",
      description: "Connect with experienced instructors. Ask questions, browse discussions, and more.",
      color: "text-amber-400"
    },
    {
      icon: BookOpen,
      title: "Teaching Center",
      description: "Learn about best practices for teaching on Udemy.",
      color: "text-amber-400"
    },
    {
      icon: BarChart3,
      title: "Marketplace Insights",
      description: "Validate your classroom topic by exploring our marketplace supply and demand.",
      color: "text-amber-400"
    },
    {
      icon: HeadphonesIcon,
      title: "Help and Support",
      description: "Browse our Help Center or contact our support team.",
      color: "text-amber-400"
    }
  ];

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <p className="text-gray-600">Have questions? Here are our most popular instructor resources.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {resources.map((resource, index) => (
          <motion.div 
            key={index}
            variants={fadeInUp}
            className="text-center group cursor-pointer"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-amber-50 transition-colors">
              <resource.icon className={`w-8 h-8 ${resource.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-400 transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600">{resource.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
