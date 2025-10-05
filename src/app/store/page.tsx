import { getStoreStats } from "@/actions/employees";
import { StoreStatsCards } from "@/components/store/store-stats-cards";
import { getCurrentUser } from "@/lib/auth";

export default async function StoreDashboard() {
  const user = await getCurrentUser();
  const stats = await getStoreStats();

  if ("error" in stats) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <StoreStatsCards
        totalProducts={stats.totalProducts}
        lowStockProducts={stats.lowStockProducts}
        totalEmployees={stats.totalEmployees}
        totalRevenue={stats.totalRevenue}
      />
    </div>
  );
}
