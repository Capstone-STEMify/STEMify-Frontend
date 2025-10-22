// app/organization-dashboard/components/quick-stats-grid.tsx
"use client";

import { Card, CardContent } from "@/components/shadcn/card";
import { Briefcase, Award, ArrowUpRight, Users } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { quickStatsData } from "../../api/data";

const stats = [
  { title: "Completed Courses", value: "155+", icon: Briefcase, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  { title: "Earned Certificate", value: "40+", icon: Award, color: "text-green-600", bgColor: "bg-green-100" },
  { title: "Course in Progress", value: "27+", icon: ArrowUpRight, color: "text-blue-600", bgColor: "bg-blue-100" },
  { title: "Community Support", value: "19k+", icon: Users, color: "text-orange-600", bgColor: "bg-orange-100" },
];

export function QuickStatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-xl bg-white border-none shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="h-10 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quickStatsData}>
                    <Line type="monotone" dataKey="value" stroke={stat.color.split('-')[0].replace('text-','')} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <h3 className="text-2xl font-semibold mt-4">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}