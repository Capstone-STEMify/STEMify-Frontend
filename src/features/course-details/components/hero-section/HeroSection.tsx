import React from 'react';
import { motion } from 'framer-motion';
import { Award, User, BookOpen, ShoppingCart, Heart, Play } from 'lucide-react';

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
      className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              <Award className="w-4 h-4 mr-2" />
              Age Range
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
              <div className="flex items-center bg-white text-sky-300 rounded-full px-3 py-1 w-fit">
                <BookOpen className="w-4 h-4 mr-2" />
                IT & Software
              </div>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                by awesomeorg@gmail.com
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to cart
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">SQL</h3>
                <p className="text-center text-white/90">Master Database Design</p>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
