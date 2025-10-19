"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

interface QuizNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function QuizNavigation({ activeTab, onTabChange }: QuizNavigationProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">Quiz</h1>
      <Tabs value={activeTab} onValueChange={onTabChange} className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="progress" disabled>
            Progress
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}