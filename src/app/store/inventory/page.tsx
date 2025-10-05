import { getProducts } from "@/actions/products";
import { ProductsTable } from "@/components/store/products-table";
import { ProductFormDialog } from "@/components/store/product-form-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function InventoryPage() {
  const result = await getProducts();

  if ("error" in result) {
    return <div>Error loading inventory</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your product stock</p>
        </div>
        <ProductFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>View and manage your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable products={result.products} />
        </CardContent>
      </Card>
    </div>
  );
}
