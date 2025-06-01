'use client'
import { Star } from 'lucide-react';
import React, { useState } from 'react'

export default function BenefitsSection() {
  const benefits = [
    "Master fundamental knowledge at school",
    "The ability to criticize knowledge increases", 
    "Respond confidently when encountering difficult situations"
  ];

  return (
    <section className="relative px-6 py-16 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-orange-200 to-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full opacity-30 animate-float"></div>
      <div className="absolute top-1/2 left-10 w-6 h-6 bg-yellow-400 rounded-full opacity-50 animate-ping"></div>
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-orange-400 rounded-full opacity-60 animate-bounce"></div>
      
      <div className="flex items-center justify-between max-w-6xl mx-auto relative z-10">
        <div className="flex-1 relative">
          <div className="relative group">
            <img 
              src="/HomeFiles/hcm.jpg" 
              alt="Students collaborating"
              className="rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-blue-300 to-purple-300 rounded-lg opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-tl from-yellow-300 to-orange-300 rounded-lg opacity-15 -z-20 group-hover:opacity-25 transition-opacity duration-300"></div>
          </div>
        </div>
        
        <div className="flex-1 ml-12">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm text-gray-600">Growing and online</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6 relative">
              What will your child get after studying at{' '}
              <span className="text-orange-500 relative">
                STEMify
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-60"></div>
              </span>?
            </h2>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 relative group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-sm">✓</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full opacity-60 animate-ping group-hover:animate-pulse"></div>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};