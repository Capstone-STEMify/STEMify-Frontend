'use client'
import React, { useEffect, useState } from 'react';

type HeroSectionProps = {
  backgroundImage?: string;
  heading?: string;
  subheading?: string;
  highlightColor?: string; 
  showDivider?: boolean;
  minHeight?: string;
}

export default function HeroSection({
  backgroundImage = "/images/stemclass.jpg",
  heading = "Accelerate learning with",
  subheading = "STEMify classroom",
  highlightColor = "text-amber-400",
  showDivider = true,
  minHeight = "600px"
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="relative flex justify-center items-center bg-gradient-to-r from-blue-50 to-orange-50 py-20"
      style={{
        background: `url('${backgroundImage}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        minHeight,
      }}
    >
      {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}

      <div className="relative max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            {heading}
          </h1>
          <p className={`${highlightColor} font-extrabold text-6xl`}>
            {subheading}
          </p>
          {showDivider && (
            <div className="flex justify-center mt-4">
              <div className="w-32 h-1 bg-orange-400 rounded"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
