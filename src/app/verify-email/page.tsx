import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const { userId } = await searchParams;
  if (!userId) {
    redirect("/signup");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <VerifyEmailForm userId={userId} />
    </div>
  );
}
