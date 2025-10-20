// app/quiz-analytic/components/question-detail-tab.tsx

import { Button } from "@/components/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { ChevronDown, Info, ArrowDownUp } from "lucide-react";
import { QuestionCard } from "../card/QuestionCard";
import { StatisticsCard } from "../card/StatisticCard";

export function QuestionDetailTab() {
  return (
    <div className="space-y-6">
      {/* Sub Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="h-4 w-4" />
          <p>This Tab Shows the accumulated data of all learner attempts</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">All type <ChevronDown className="h-4 w-4 ml-2" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Dropdown items here */}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline"><ArrowDownUp className="h-4 w-4 mr-2" /> Sort by</Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuestionCard />
        </div>
        <div className="lg:col-span-1">
          <StatisticsCard />
        </div>
      </div>
    </div>
  );
}