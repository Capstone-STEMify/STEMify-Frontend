// app/organization-dashboard/components/student-retention-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { GraduationCap, Info } from "lucide-react";
import { retentionData } from "../../api/data";
import { Badge } from "@/components/shadcn/badge";

export function StudentRetentionCard() {
  return (
    <Card className="shadow-md rounded-xl h-full bg-white border-none">
      <CardHeader className="flex flex-row items-center justify-between pt-6">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Student Retention
          <Info className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <span className="text-sm text-indigo-600 cursor-pointer">See Details</span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mt-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-semibold">63%</p>
          <Badge className="bg-green-100 text-green-700 self-start mt-1">+32</Badge>
        </div>

        <div className="relative h-44 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={retentionData}
                cx="50%"
                cy="100%" 
                innerRadius={65}
                outerRadius={120}
                startAngle={180} 
                endAngle={0}     
                dataKey="value"
                paddingAngle={2}
              >
                {retentionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-30 pointer-events-none">
            <span className="text-xl font-semibold text-gray-800">63%</span>
            <span className="text-sm text-gray-500">Retention</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3 mt-4 mb-4">
          <Info className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Feedback-</span> some student suggested more frequent communication and feedback from management
          </p>
        </div>
      </CardContent>
    </Card>
  );
}