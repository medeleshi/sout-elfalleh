// src/app/(app)/dashboard/page.tsx
import HomeHero from "@/components/dashboard/HomeHero";
import FeedFilters from "@/components/dashboard/FeedFilters";
import MainFeed from "@/components/dashboard/MainFeed";
import MarketBrief from "@/components/dashboard/MarketBrief";
import SuggestedTraders from "@/components/dashboard/SuggestedTraders";
import DashboardStats from "@/components/dashboard/DashboardStats";
import PracticalAdvice from "@/components/dashboard/PracticalAdvice";
import SuggestedPeople from "@/components/dashboard/SuggestedPeople";
import DashboardReminders from "@/components/dashboard/DashboardReminders";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { type UserRole, type Tables } from "@/types/database";

export default async function DashboardPage() {
  const profileData = await getCurrentProfile();

  if (!profileData || !profileData.profile) return null;

  const { profile } = profileData;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Unified Home Hero - PRD 11.1 Sections 1, 2, 3 combined */}
      <HomeHero profile={profile} />
      
      {/* 2-Column Responsive Layout - Sidebar on Right (Start) */}
      <div className="flex flex-col lg:flex-row gap-8 mt-4 lg:mt-8">
        {/* Right Sidebar Column (Support Area) - HIDDEN ON MOBILE */}
        <aside className="hidden lg:block w-[320px] shrink-0 space-y-6 lg:order-first">
          {/* Contextual Sidebar widgets */}
          <DashboardStats profile={profile} />
          <MarketBrief governorate={profile.governorate_name_ar || 'تونس'} />
          <PracticalAdvice />
          <SuggestedTraders currentUserId={profile.id} />
        </aside>

        {/* Main Content Column (Left/Center) */}
        <div className="flex-1 min-w-0">
          <FeedFilters />
          
          <div className="mt-6 lg:mt-8">
            <MainFeed />
          </div>
        </div>
      </div>

      {/* Suggested People Discovery Section */}
      <SuggestedPeople 
        currentUserId={profile.id} 
        userRole={profile.role as UserRole} 
        governorateId={profile.governorate_id} 
      />

      {/* Personalized Reminders & Follow-ups */}
      <DashboardReminders profile={profile as Tables<'profiles'>} />
    </div>
  );
}