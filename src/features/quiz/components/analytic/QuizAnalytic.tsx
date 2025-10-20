// app/quiz-analytic/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { QuizDetailHeader } from "./header/QuizAnalHeader";
import { QuestionDetailTab } from "./question/QuestionTab";
import { LearnerOverviewTab } from "./overview/OverviewTab";

export default function QuizAnalytic() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <QuizDetailHeader />

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
            
            <TabsTrigger 
              value="questions" 
              className="
                flex-none w-auto text-gray-400
                rounded-none
                data-[state=active]:shadow-none 
                data-[state=active]:text-foreground
                data-[state=active]:border-transparent
                data-[state=active]:bg-transparent
                data-[state=active]:border-b-primary
                data-[state=active]:border-b-2
              "
            >
              Questions
            </TabsTrigger>
            
            <TabsTrigger 
              value="overview" 
              className="
                flex-none w-auto text-gray-400
                rounded-none
                data-[state=active]:shadow-none 
                data-[state=active]:text-foreground
                data-[state=active]:border-transparent
                data-[state=active]:bg-transparent
                data-[state=active]:border-b-primary
                data-[state=active]:border-b-2
              "
            >
              Overview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="mt-6">
            <QuestionDetailTab />
          </TabsContent>
          <TabsContent value="overview" className="mt-6">
            <LearnerOverviewTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}