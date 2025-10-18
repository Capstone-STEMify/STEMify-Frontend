// app/quiz-active/components/quiz-toolbar.tsx

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { ChevronDown, Filter, MoreHorizontal, Plus, Search } from "lucide-react";

export function QuizToolbar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
      <div className="flex w-full md:w-auto items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between">
              All Status (20) <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Dropdown items go here */}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Filter
        </Button>
      </div>
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-8 w-full md:w-[250px]" />
        </div>
        <Button>Export</Button>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}