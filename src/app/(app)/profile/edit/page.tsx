// src/app/(app)/profile/edit/page.tsx
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/actions';
import { ROUTES } from '@/lib/constants/routes';
import { EditProfileForm } from './EditProfileForm';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const profileData = await getCurrentProfile();
  if (!profileData || !profileData.profile) {
    redirect(ROUTES.ONBOARDING);
  }

  const supabase = await createClient();
  
  // Fetch Lookups and Private Details for the form
  const [governoratesRes, activityTypesRes, privateDetailsRes] = await Promise.all([
    supabase.from("governorates").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("activity_types").select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("profile_private_details").select("phone").eq("user_id", user.id).maybeSingle() as any),
  ]);

  return (
    <div className="min-h-screen bg-surface pb-32" dir="rtl">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
           <h1 className="text-2xl font-black text-on-surface tracking-tight">تعديل الحساب</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <EditProfileForm 
          initialData={{
            ...(profileData.profile as any),
            phone: privateDetailsRes.data?.phone || "",
          }}
          governorates={governoratesRes.data || []}
          activityTypes={activityTypesRes.data || []}
        />
      </main>
    </div>
  );
}
