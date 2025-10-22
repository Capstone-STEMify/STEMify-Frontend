// app/organization-dashboard/components/welcome-banner.tsx

import { Button } from "@/components/shadcn/button";

export function WelcomeBanner() {
  return (
    <div className="
      rounded-2xl bg-white shadow-md
      p-8 
      flex flex-col md:flex-row items-center justify-between gap-8
    ">
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-4xl font-bold text-gray-800">Hi, Mohib 👋</h2>
        <p className="text-2xl font-semibold text-gray-600 mt-2">
          What do you want to learn today with your partner?
        </p>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto md:mx-0">
          Discover courses, track progress, and achieve your learning goals seamlessly.
        </p>
        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6 py-3">
          Explore Courses
        </Button>
      </div>
      
      <div className="flex-shrink-0">
        <img 
          src="/images/banner.png" 
          alt="Learning Illustration" 
          className="h-72 md:h-60 object-contain" 
        />
      </div>
    </div>
  );
}