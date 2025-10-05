import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = await searchParams;
  if (!token) {
    return redirect("/forgot-password");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ResetPasswordForm token={token} />
    </div>
  );
}
