// app/quiz-analytic/components/question-detail-tab.tsx

import { Button } from "@/components/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { ChevronDown, Info, ArrowDownUp } from "lucide-react";
import { QuestionCard } from "../card/QuestionCard";

export function QuestionDetailTab() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="h-4 w-4 flex-shrink-0" />
          <p>This Tab Shows the accumulated data of all learner attempts</p>
        </div>
        <div className="flex items-center gap-2 self-end md:self-center">
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

      <div className="space-y-6">
        <QuestionCard />
      </div>
    </div>
  );
}