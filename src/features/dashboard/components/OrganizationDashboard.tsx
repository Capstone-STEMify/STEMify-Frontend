// app/organization-dashboard/page.tsx

import { WelcomeBanner } from "./banner/HelloBanner";
import { StudentRetentionCard } from "./card/RetentionCard";
import { ProgressStatisticsCard } from "./card/StatisticCard";
import { TotalStudentsCard } from "./card/TotalCard";
import { QuickStatsGrid } from "./stat/StatsGrid";
import { StudentListTable } from "./table/StudentTable";

export default function OrganizationDashboard() {
  return (
    <div className="px-4 mt-20 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WelcomeBanner />
          </div>
          <div>
            <QuickStatsGrid />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TotalStudentsCard />
          <StudentRetentionCard />
          <ProgressStatisticsCard />
        </div>

        <div>
          <StudentListTable />
        </div>
      </div>
    </div>
  );
}