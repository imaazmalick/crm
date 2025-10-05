import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default async function SalesHistoryPage() {
  const payload = await getCurrentUser();

  const employee = await prisma.user.findUnique({
    where: { id: payload!.userId },
  });

  const sales = await prisma.sale.findMany({
    where: {
      storeId: employee!.storeId!,
      employeeId: payload!.userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales History</h1>
        <p className="text-muted-foreground">
          View your recent sales transactions
        </p>
      </div>

      <div className="grid gap-4">
        {sales.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No sales yet</p>
            </CardContent>
          </Card>
        ) : (
          sales.map((sale: any) => (
            <Card key={sale.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Sale #{sale.id.slice(-8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(sale.createdAt), "PPp")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatCurrency(sale.total)}
                    </p>
                    <Badge
                      variant={
                        sale.paymentMethod === "CASH" ? "default" : "secondary"
                      }
                    >
                      {sale.paymentMethod}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sale.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">POS Fee</span>
                    <span>{formatCurrency(sale.posFee)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
