// app/organization-dashboard/components/student-retention-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Info } from "lucide-react";
import { retentionData } from "../../api/data";

export function StudentRetentionCard() {
  return (
    <Card className="shadow-sm rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Student Retention</CardTitle>
        <span className="text-sm text-indigo-600 cursor-pointer">See Details</span>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={retentionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                paddingAngle={0}
              >
                {retentionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">63%</span>
            <span className="text-sm text-gray-500">Retention</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3 mt-6">
          <Info className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Feedback-</span> some student suggested more frequent communication and feedback from management
          </p>
        </div>
      </CardContent>
    </Card>
  );
}