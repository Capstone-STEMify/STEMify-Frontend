// app/organization-dashboard/components/total-students-card.tsx

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { cn } from "@/shadcn/utils";
import { ExternalLink, GraduationCap, Info } from "lucide-react";

const rates = [
  { title: "Retention Student Rates", count: 15, people: 150, color: "bg-indigo-600" },
  { title: "Regular Student Rates", count: 63, people: 2200, color: "bg-blue-500" },
  { title: "Dropout Student Rates", count: 3, people: 100, color: "bg-yellow-400" },
];

const TOTAL_CAPSULES = 30; 

const capsules: string[] = [];
let currentCount = 0;

const rate1Count = Math.round(rates[0].count * TOTAL_CAPSULES / 100);
const rate2Count = Math.round(rates[1].count * TOTAL_CAPSULES / 100);
const rate3Count = Math.round(rates[2].count * TOTAL_CAPSULES / 100);
currentCount = rate1Count + rate2Count + rate3Count;

const remainingCount = TOTAL_CAPSULES - currentCount;

for (let i = 0; i < rate1Count; i++) capsules.push(rates[0].color);
for (let i = 0; i < rate2Count; i++) capsules.push(rates[1].color);
for (let i = 0; i < rate3Count; i++) capsules.push(rates[2].color);
for (let i = 0; i < remainingCount; i++) capsules.push("bg-gray-200");

export function TotalStudentsCard() {
  return (
    <Card className="shadow-sm rounded-xl h-full bg-white border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Total Student
          <Info className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <span className="text-sm text-indigo-600 cursor-pointer">See Details</span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mt-4 md:pb-8">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-4xl font-semibold">3,500</p>
          <Badge className="bg-green-100 text-green-700 self-start mt-1">+45</Badge>
        </div>

        <div className="relative w-full mt-8 md:mt-2 mb-6">
          <span className="absolute -top-5 left-0 text-sm font-semibold text-gray-700">15%</span>
          <span className="absolute -top-5 left-[15%] text-sm font-semibold text-gray-700">63%</span>
          <span className="absolute -top-5 right-[15%] text-sm font-semibold text-gray-700">3%</span>

          <div className="flex w-full justify-between">
            {capsules.map((color, i) => (
              <div 
                key={i} 
                className={cn("h-8 w-1.5 rounded-full", color)} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-4 mt-6 md:pt-14">
          {rates.map((rate) => (
            <div key={rate.title} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className={cn("h-2.5 w-2.5 rounded-full mr-2", rate.color)}></span>
                <span className="text-gray-600">{rate.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-500">{rate.people} People</span>
                <ExternalLink className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}