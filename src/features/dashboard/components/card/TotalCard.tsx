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
const remainingCount = 100 - rates.reduce((acc, r) => acc + r.count, 0);

// Component con cho mỗi "viên nhộng"
const BarSegment = ({ count, color }: { count: number, color: string }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn("h-8 w-1 rounded-full", color)} />
    ))}
  </>
);

export function TotalStudentsCard() {
  return (
    <Card className="shadow-sm rounded-xl h-full bg-white border-none">
      <CardHeader className="flex flex-row items-center justify-between pt-6">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Total Student
          <Info className="h-4 w-4 text-gray-400" />
        </CardTitle>
        <span className="text-sm text-indigo-600 cursor-pointer">See Details</span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 my-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-semibold">3,500</p>
          <Badge className="bg-green-100 text-green-700 self-start mt-1">+45</Badge>
        </div>

        <div className="relative w-full mt-14 mb-6">
          <p className="absolute -top-7 left-0 text-sm font-semibold text-gray-700">15%</p>
          <p className="absolute -top-7 left-[15%] text-sm font-semibold text-gray-700">63%</p>
          <p className="absolute -top-7 right-[-1%] text-sm font-semibold text-gray-700">3%</p>

          <div className="flex w-full gap-px">
            <BarSegment count={rates[0].count} color={rates[0].color} />
            <BarSegment count={rates[1].count} color={rates[1].color} />
            <BarSegment count={rates[2].count} color={rates[2].color} />
          </div>
        </div>

        <div className="space-y-4 mt-10">
          {rates.map((rate) => (
            <div key={rate.title} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className={cn("h-2.5 w-2.5 rounded-full mr-2", rate.color)}></span>
                <span className="font-semibold">{rate.title}</span>
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