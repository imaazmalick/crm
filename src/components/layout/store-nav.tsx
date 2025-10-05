"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";

const navItems = [
  {
    title: "Dashboard",
    href: "/store",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    href: "/store/inventory",
    icon: Package,
  },
  {
    title: "Employees",
    href: "/store/employees",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/store/settings",
    icon: Settings,
  },
];

export function StoreNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card sticky top-0 overflow-y-hidden">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Store Manager</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <form action={signOut}>
          <Button
            variant="ghost"
            className="w-full justify-start"
            type="submit"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
