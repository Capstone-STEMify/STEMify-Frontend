// app/organization-dashboard/components/welcome-banner.tsx

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";

export function WelcomeBanner() {
  return (
    <Card className="shadow-none border-none rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Hi, Mohib 👋</h2>
        <p className="text-xl font-semibold text-gray-600 mt-2">
          What do you want to learn today with your partner?
        </p>
        <p className="text-gray-500 mt-3 max-w-lg">
          Discover courses, track progress, and achieve your learning goals seamlessly.
        </p>
        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6 py-3">
          Explore Courses
        </Button>
      </div>
      <div className="hidden md:block">
        <img src="/path-to-your-illustration.png" alt="Learning Illustration" className="h-56" />
      </div>
    </Card>
  );
}