'use client'
import React from 'react'

export default function TestimonialsSection() {
  return (
    <section className="relative px-6 py-16 bg-yellow-50 overflow-hidden">
        {/* <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-15 animate-float-delayed"></div> */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-orange-400 rounded-full opacity-40 animate-ping"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            What do students say about <span className="text-yellow-500 relative">
              STEMify
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60"></div>
            </span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm relative group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="flex items-center mb-4">
                <img 
                  src="/HomeFiles/hcm.jpg" 
                  alt="Jessica Andrew"
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Jessica Andrew</h4>
                  <p className="text-sm text-gray-600">Student</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                "My child has improved a lot after learning with STEMify online. The road from 6th to 7th grade."
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm relative group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="flex items-center mb-4">
                <img 
                  src="/HomeFiles/hcm.jpg" 
                  alt="Gabrielle Robertson"
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Gabrielle Robertson</h4>
                  <p className="text-sm text-gray-600">Parent</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                "My child found how to write very good reports. English skills and writing skills have improved significantly."
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm relative group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="flex items-center mb-4">
                <img 
                  src="/HomeFiles/hcm.jpg" 
                  alt="Dianne Russell"
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Dianne Russell</h4>
                  <p className="text-sm text-gray-600">Student</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                "My child has improved a lot after learning online. Thank you very much team."
              </p>
            </div>
          </div>
        </div>
      </section>
  )
}
