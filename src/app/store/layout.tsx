import type React from "react";
import { StoreNav } from "@/components/layout/store-nav";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !["STORE_MANAGER", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized");
  }

  if (!user.storeId && user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen">
      <StoreNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
