import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { POSClient } from "@/components/pos/pos-client";

export default async function POSPage() {
  const payload = await getCurrentUser();

  const employee = await prisma.user.findUnique({
    where: { id: payload!.userId },
    include: { store: true },
  });

  const products = await prisma.product.findMany({
    where: {
      storeId: employee!.storeId!,
      minStock: { gt: 0 },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground">
          {employee?.store?.name} - Scan or search products to add to cart
        </p>
      </div>

      <POSClient
        products={products}
        storeId={employee!.storeId!}
        employeeId={employee!.id}
      />
    </div>
  );
}
