import React from 'react'

export default function FAQSection() {
  return (
    <section className="relative px-6 py-16 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-44 h-44 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-15 animate-slow-spin"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 bg-gradient-to-tl from-yellow-200 to-orange-200 rounded-full opacity-20 animate-slow-spin-reverse"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-bounce"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative">
            Do you still have any questions?
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </h2>
          <p className="text-gray-600 mb-8">
            Book meeting to learn is your offline materials. We will contact you in 
            about customer care which should be yours.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-8 relative">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
              />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full opacity-0 focus-within:opacity-60 focus-within:animate-ping transition-opacity duration-300"></div>
            </div>
            <button className="px-8 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 relative">
              Subscribe
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-60 animate-pulse"></div>
            </button>
          </div>
          
          <div className="flex justify-center space-x-4 relative">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="relative group">
                <img 
                  src="/HomeFiles/hcm.jpg" 
                  alt={`Avatar ${i}`}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-80 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}
