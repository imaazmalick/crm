import { getStores } from "@/actions/stores";
import { StoresTable } from "@/components/admin/stores-table";
import { StoreFormDialog } from "@/components/admin/store-form-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function StoresPage() {
  const result = await getStores();

  if ("error" in result) {
    return <div>Error loading stores</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">Manage your retail locations</p>
        </div>
        <StoreFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>View and manage all store locations</CardDescription>
        </CardHeader>
        <CardContent>
          <StoresTable stores={result.stores} />
        </CardContent>
      </Card>
    </div>
  );
}
