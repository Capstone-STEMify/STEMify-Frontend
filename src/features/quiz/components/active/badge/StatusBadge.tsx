// app/quiz-active/components/status-badge.tsx

import { Badge } from "@/components/shadcn/badge";
import { cn } from "@/shadcn/utils";
import { CheckCircle2, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "Completed" | "In Progress";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === "Completed";
  return (
    <Badge
      variant="outline"
      className={cn(
        "py-1 px-2 border text-xs font-medium",
        isCompleted
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-yellow-200 bg-yellow-50 text-yellow-700"
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className="mr-1 h-3 w-3" />
      ) : (
        <Clock className="mr-1 h-3 w-3" />
      )}
      {status}
    </Badge>
  );
}