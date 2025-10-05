import { getAdminStats } from "@/actions/stores";
import { StatsCards } from "@/components/admin/stats-cards";
import { RecentSalesTable } from "@/components/admin/recent-sales-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  if ("error" in stats) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your CRM system</p>
      </div>

      <StatsCards
        totalStores={stats.totalStores}
        totalSales={stats.totalSales}
        totalRevenue={stats.totalRevenue}
        totalPosFees={stats.totalPosFees}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Latest transactions across all stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSalesTable sales={stats.recentSales} />
        </CardContent>
      </Card>
    </div>
  );
}
