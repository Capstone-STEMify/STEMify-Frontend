// app/organization-dashboard/components/total-students-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Progress } from "@/components/shadcn/progress";

const rates = [
  { title: "Retention Student Rates", value: 15, people: 150, color: "bg-indigo-600" },
  { title: "Regular Student Rates", value: 63, people: 2200, color: "bg-blue-500" },
  { title: "Dropout Student Rates", value: 3, people: 100, color: "bg-yellow-400" },
];

export function TotalStudentsCard() {
  return (
    <Card className="shadow-sm rounded-xl h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Total Student</CardTitle>
        <span className="text-sm text-indigo-600 cursor-pointer">See Details</span>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">3,500</p>
        <div className="space-y-5 mt-5">
          {rates.map((rate) => (
            <div key={rate.title}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center">
                  <span className={`h-2 w-2 rounded-full ${rate.color} mr-2`}></span>
                  <span className="text-gray-600">{rate.title}</span>
                </div>
                <span className="font-medium">{rate.people} People</span>
              </div>
              <Progress value={rate.value} className={`h-2 ${rate.color}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}