import AppShell from "@/components/shared/app-shell";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileData = await getCurrentProfile();

  if (!profileData) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <AppShell profile={profileData.profile}>
      {children}
    </AppShell>
  );
}
