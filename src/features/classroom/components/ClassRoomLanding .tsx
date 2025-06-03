'use client'
import React from 'react'
import HeroSection from './hero-section/HeroSection';
import TeachingSection from './teaching-section/TeachingSection';
import LearningSection from './learning-section/LearningSection';
import ToolSection from './tool-section/ToolSection';
import HeroSectionClass from './hero-section/HeroSection';

export default function ClassRoomLanding() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSectionClass />
      <TeachingSection />
      <LearningSection />
      <ToolSection />
    </div>
  );
}
