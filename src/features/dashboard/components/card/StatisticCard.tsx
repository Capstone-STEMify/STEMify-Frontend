// app/organization-dashboard/components/progress-statistics-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/shadcn/dropdown-menu";
import { Button } from "@/components/shadcn/button";
import { ChevronDown } from "lucide-react";
import { progressData } from "../../api/data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-2 rounded-md shadow-lg">
        <p className="font-semibold">High Retention</p>
        <p className="text-sm">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function ProgressStatisticsCard() {
  return (
    <Card className="shadow-sm rounded-xl h-full bg-white border-none">
      <CardHeader className="flex flex-row items-center justify-between py-6">
        <CardTitle className="text-lg font-semibold">Progress Statistics</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Jan - April <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* ... items */}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end items-center gap-4 text-sm mb-4 pt-4">
          <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 mr-2"></span>
            <span>Retention</span>
          </div>
           <div className="flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-100 mr-2"></span>
            <span>Dropped</span>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="retention" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dropped" fill="#E0E7FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}