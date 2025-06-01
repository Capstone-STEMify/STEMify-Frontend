'use client'
import React from 'react'

export default function StatsSection() {
  const stats = [
    { number: "195+", label: "Free Resources", color: "yellow" },
    { number: "1000+", label: "Engaged Students", color: "blue" },
    { number: "90%", label: "Positive Impact on STEM", color: "green" }
  ];

  return (
    <section className="relative px-6 py-16 bg-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-15 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-300 to-cyan-300 rounded-full opacity-20 animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-ping"></div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center relative z-10">
        {stats.map((stat, index) => (
          <div key={index} className="relative group">
            <div className={`absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-${stat.color}-200 to-${stat.color === 'green' ? 'yellow' : stat.color}-200 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
            <div className="relative bg-white p-6 rounded-lg group-hover:transform group-hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-4xl font-bold text-yellow-500 mb-2 relative">
                {stat.number}
                <div className={`absolute -top-1 -right-1 w-3 h-3 bg-${stat.color}-400 rounded-full opacity-60 animate-pulse`}></div>
              </div>
              <div className="text-gray-700 font-semibold">{stat.label}</div>
            </div>
          </div>
        ))}
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
