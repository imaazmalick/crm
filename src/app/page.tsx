import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else if (user.role === "STORE_MANAGER") {
    redirect("/store");
  } else {
    redirect("/pos");
  }
}
