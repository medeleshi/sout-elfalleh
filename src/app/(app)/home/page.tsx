// src/app/(app)/home/page.tsx
import HomeHero from "@/components/home/HomeHero";
import FeedFilters from "@/components/home/FeedFilters";
import MainFeed from "@/components/home/MainFeed";
import MarketBrief from "@/components/home/MarketBrief";
import SuggestedTraders from "@/components/home/SuggestedTraders";
import HomeStats from "@/components/home/HomeStats";
import PracticalAdvice from "@/components/home/PracticalAdvice";
import SuggestedPeople from "@/components/home/SuggestedPeople";
import HomeReminders from "@/components/home/HomeReminders";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { type UserRole, type Tables } from "@/types/database";

export default async function HomePage() {
  const profileData = await getCurrentProfile();

  if (!profileData || !profileData.profile) return null;

  const { profile } = profileData;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10" dir="rtl">
      {/* 1, 2, 3. Top Action Layer (Welcome + Primary CTA + Quick Actions) */}
      <HomeHero profile={profile} />
      
      {/* 4, 5, 6, 7. Discovery Layer (Main Feed + Sidebar Widgets) */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Main Content Column (Discovery) */}
        <div className="flex-1 min-w-0 space-y-8">
          <FeedFilters />
          <MainFeed />
        </div>

        {/* Right Sidebar Column (Secondary Info / Widgets) */}
        <aside className="w-full lg:w-[360px] shrink-0 space-y-8 lg:sticky lg:top-24">
          <HomeStats profile={profile} />
          <MarketBrief governorate={profile.governorate_name_ar || 'تونس'} />
          <PracticalAdvice />
        </aside>
      </div>

      {/* 8, 9. Re-engagement Layer (Suggested People + Reminders) */}
      <div className="pt-10 border-t border-outline-variant/10 space-y-12">
        <SuggestedPeople 
          currentUserId={profile.id} 
          userRole={profile.role as UserRole} 
          governorateId={profile.governorate_id} 
        />
        <HomeReminders profile={profile as Tables<'profiles'>} />
      </div>
    </div>
  );
}