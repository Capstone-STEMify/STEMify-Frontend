import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Ensure this is the correct icon if you prefer the one in the image

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Sample learning points based on the image
const learningPoints = [
  "Design and query databases with SQL",
  "Understand relational database concepts",
  "Learn to normalize data effectively",
  "Write complex SQL queries for data analysis"
];

export default function AboutSection() {
  return (
    <motion.section 
      id="about"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-10 items-start"> 
          <div>
            <div className="rounded-lg overflow-hidden shadow-2xl aspect-video bg-black">
              <video
                controls
                className="w-full h-full"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div className="mt-0 lg:mt-0">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-1">Unable to load progress information</h4>
                  <p className="text-sm text-red-600">
                    Please enroll in the course to stay updated on progress or contact support if the error persists.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};