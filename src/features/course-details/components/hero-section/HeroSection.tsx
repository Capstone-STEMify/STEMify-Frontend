import React from 'react';
import { motion } from 'framer-motion';
import { CalendarFold , BookOpen, Heart } from 'lucide-react';
import { TbDoorExit } from "react-icons/tb";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function HeroSection() {
  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="bg-gradient-to-br from-sky-200 to-blue-100 py-26"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 text-white text-sm font-medium">
              <CalendarFold className="w-4 h-4 mr-2" />
              Age Ranges: 8-14+
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Database Design and Querying with SQL Server
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              This course will help you understand relational databases and how to use SQL to design and query data. You will learn how to create tables, query data, optimize queries, and manage databases.
            </p>
            
            <div className="pace-x-6 text-sm text-gray-600">
              <div className='flex items-center gap-2 mb-4'>

                <p className='font-bold text-lg'>Category: </p>
              <div className="flex items-center bg-white text-sky-400 rounded-full px-3 py-1 w-fit">
                <BookOpen className="w-4 h-4 mr-2" />
                IT & Software
              </div>
              </div>
              <div className="flex items-center">
                <img src={'/images/Rosie.jpg'} className="w-10 h-10 rounded-full mr-4 flex-shrink-0"/>
                by awesomeorg@gmail.com
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-sky-400 hover:bg-sky-500 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                <TbDoorExit className="w-5 h-5 mr-2" />
                Assign to Student
              </button>
              <button className="bg-white border hover:border-sky-400 text-sky-400 px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </button>
            </div>
          </div>
          
          <div className="lg:flex items-center justify-center w-fit lg:justify-end hidden">
            <img
              src={'/HomeFiles/hcm.jpg'} 
              alt="Database Design and Querying with SQL Server Course Preview" 
              className="rounded-2xl shadow-xl w-full max-w-lg h-auto object-cover border-4 border-white shadow-amber-400"
            />
          </div>
        </div>
      </div>
    </motion.section>
  ); 
};
