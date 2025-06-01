'use client'
import React, { useState } from 'react'

export default function ToolsSection ()  {
  const tools = [
    { icon: '/HomeFiles/classroom.jpg' },
    { icon: '/HomeFiles/drive.png' },
    { icon: '/HomeFiles/camera.jpg' },
    { icon: '/HomeFiles/facebook.png' },
    { icon: '/HomeFiles/zalo.png' },
    { icon: '/HomeFiles/calendar.png' },
    { icon: '/HomeFiles/paint.png' },
    { icon: '/HomeFiles/note.jpg' }
  ];

  return (
    <section className="relative px-6 py-16 bg-gray-50 overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-30 animate-float-delayed"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-yellow-300 rounded-full opacity-25 animate-pulse"></div>
      
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          All the tools that you need
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          So kids forget logos and longer design inspiration, but we connected out 5 years history, 
          physics, via respected rerum volvere amed, aut et id sagpendisse.
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 rounded-2xl p-8 relative overflow-hidden shadow-xl">
          <div className="absolute -left-16 top-0 w-32 h-full bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full opacity-80 animate-slow-spin"></div>
          <div className="absolute -right-16 top-0 w-32 h-full bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full opacity-80 animate-slow-spin-reverse"></div>
          
          <div className="relative z-20 flex justify-center mb-8">
            <div className="relative w-[600px]">
              <img 
                src="/HomeFiles/window.png" 
                alt="Tools Window"
                className="w-[40rem] h-[22rem] object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-yellow-300 to-orange-300 rounded-lg opacity-30 -z-10"></div>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center">
            {tools.map((tool, index) => (
              <div 
                key={index}
                className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-bounce`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <span className="text-white font-bold"><img className='w-full max-w-10' src={tool.icon}></img></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slow-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        .animate-slow-spin-reverse {
          animation: slow-spin-reverse 25s linear infinite;
        }
      `}</style>
    </section>
  );
};