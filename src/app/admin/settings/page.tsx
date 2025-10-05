import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/passwords-form";

export default async function AdminSettingsPage() {
  const payload = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { id: payload!.userId },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm user={user!} />
        <PasswordForm />
      </div>
    </div>
  );
}
