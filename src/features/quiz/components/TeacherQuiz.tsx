// app/quiz/page.tsx
"use client";

import { useState } from "react";

import { cn } from "@/shadcn/utils";
import { QuizNavigation } from "./navigation/QuizNavigation";
import QuizOverview from "./overview/QuizOverView";
import QuizActive from "./active/QuizActive";

export default function TeacherQuiz() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div
      className={cn(
        "p-4 sm:p-6 lg:p-8 min-h-screen transition-colors duration-300",
        activeTab === "overview" ? "bg-gray-50" : "bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto">
        <QuizNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" ? (
          <>
            <QuizOverview />
          </>
        ) : (
          <>
            <QuizActive />
          </>
        )}
      </div>
    </div>
  );
}