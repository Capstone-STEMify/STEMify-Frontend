// app/quiz-overview/components/quiz-overview-toolbar.tsx

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { CalendarDays, Plus, Search, X } from "lucide-react";

export function QuizOverviewToolbar() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Total Question: 5 or more
            <X className="h-3 w-3 ml-2" />
          </Button>
          <Button variant="link" className="text-gray-600 p-2">Reset</Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
        <Button variant="outline">
          <CalendarDays className="h-4 w-4 mr-2" />
          Date Created
        </Button>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <span className="font-medium text-sm text-gray-700">100 content</span>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>
    </div>
  );
}