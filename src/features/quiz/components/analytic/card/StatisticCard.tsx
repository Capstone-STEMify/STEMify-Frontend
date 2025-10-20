import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { Check, X } from "lucide-react";

export function StatisticsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <span className="text-sm text-gray-500">Correct</span>
            <p className="font-semibold">13</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <X className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <span className="text-sm text-gray-500">Incorrect</span>
            <p className="font-semibold">7</p>
          </div>
        </div>
        <Separator />
        <div>
          <span className="text-sm text-gray-500">Accuracy</span>
          <p className="font-semibold">65%</p>
        </div>
      </CardContent>
    </Card>
  );
}