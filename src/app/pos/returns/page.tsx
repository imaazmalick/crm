import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReturnsClient } from "@/components/pos/returns-client";

export default async function ReturnsPage() {
  const payload = await getCurrentUser();

  const employee = await prisma.user.findUnique({
    where: { id: payload!.userId },
  });

  const sales = await prisma.sale.findMany({
    where: {
      storeId: employee!.storeId!,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      employee: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const returns = await prisma.return.findMany({
    where: { storeId: employee!.storeId! },
    include: {
      sale: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Returns Management</h1>
        <p className="text-muted-foreground">
          Process product returns and view return history
        </p>
      </div>

      <ReturnsClient sales={sales} returns={returns} />
    </div>
  );
}
