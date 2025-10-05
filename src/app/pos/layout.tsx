import type React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PosNav } from "@/components/layout/pos-nav";

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getCurrentUser();

  if (!payload || payload.role !== "EMPLOYEE") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <PosNav />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
