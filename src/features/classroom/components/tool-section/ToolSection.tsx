import MacCard from '@/components/shared/card/MacCard';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import MacCardVideo from './MacCardVideo';

export default function ToolSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('tools-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const slides = [
    {
      title: "Easily create classes",
      features: [
        "Create a class",
        "Invite students to join",
        "Share a class code to add students."
      ],
      image: "tablet"
    },
    {
      title: "Monitor Progress",
      features: [
        "Track student activity",
        "View completed assignments",
        "Generate progress reports"
      ],
      image: "progress"
    },
    {
      title: "Assign Activities",
      features: [
        "Create custom assignments",
        "Set due dates",
        "Provide feedback"
      ],
      image: "activities"
    }
  ];

  return (
    <section id="tools-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
            Classroom Tools
          </h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h3 className="text-4xl font-bold text-gray-900 mb-8">
                {slides[currentSlide].title}
              </h3>
              <div className="space-y-4 mb-8">
                {slides[currentSlide].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 text-3xl">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="text-blue-600 text-xl hover:text-blue-800 font-semibold">
                Find more about the app →
              </button>
            </div>

            <div className={`relative transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="absolute -top-15 -left-35 w-80 h-80 -z-10 transform rotate-12">
                <img src="/images/effectbg.png" alt="effect" />
              </div>
              
              <div className="relative z-10">
                <MacCard> 
                  <MacCardVideo/>
                </MacCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
