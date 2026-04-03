import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";
import { getCurrentUser } from "@/lib/auth/actions";
import { ROUTES } from "@/lib/constants/routes";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const supabase = await createClient();
  
  // Check if onboarding is already completed
  const { data: profile } = await (supabase
    .from("profiles")
    .select("is_onboarding_completed")
    .eq("id", user.id)
    .single() as any);

  if (profile?.is_onboarding_completed) {
    redirect(ROUTES.HOME);
  }

  // Fetch Lookups
  const [governoratesRes, activityTypesRes] = await Promise.all([
    supabase.from("governorates").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("activity_types").select("*").eq("is_active", true).order("sort_order"),
  ]);

  return (
    <div className="min-h-screen bg-surface">
      <OnboardingForm 
        user={user}
        governorates={governoratesRes.data || []}
        activityTypes={activityTypesRes.data || []}
      />
    </div>
  );
}
