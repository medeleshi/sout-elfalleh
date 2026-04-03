// src/app/(app)/activity/page.tsx
import React, { Suspense } from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { ActivityHeader } from '@/components/activity/ActivityHeader';
import { ActivityTabs } from '@/components/activity/ActivityTabs';
import { ActivityList } from '@/components/activity/ActivityList';
import { ActionPrompts } from '@/components/activity/ActionPrompts';

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const profileData = await getCurrentProfile();
  if (!profileData || !profileData.profile) return null;

  const activeTab = searchParams.tab || 'listings';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-32 pt-4 px-4 lg:px-8" dir="rtl">
      {/* 1. Page Header & Summary Metrics */}
      <ActivityHeader />

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-8">
          {/* 2. Management Tabs */}
          <ActivityTabs activeTab={activeTab} />

          {/* 3. Activity Content */}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-on-surface-variant/40 animate-pulse font-black uppercase tracking-widest text-sm">جاري تحميل نشاطاتك...</div>}>
             <ActivityList activeTab={activeTab} userId={profileData.profile.id} />
          </Suspense>
        </div>

        {/* 4. Action Prompts Sidebar */}
        <aside className="w-full xl:w-80 shrink-0 space-y-6">
          <ActionPrompts />
        </aside>
      </div>
    </div>
  );
}
