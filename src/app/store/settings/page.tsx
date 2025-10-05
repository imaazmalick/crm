import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/passwords-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StoreSettingsPage() {
  const payload = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { id: payload!.userId },
    include: {
      store: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and store information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfileForm
            user={{ name: user!.name, email: user!.email, role: user!.role }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Your assigned store details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Store Name</p>
                <p className="text-lg font-medium">{user?.store?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-lg font-medium">{user?.store?.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={user?.store?.isActive ? "default" : "secondary"}
                >
                  {user?.store?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <PasswordForm />
      </div>
    </div>
  );
}
