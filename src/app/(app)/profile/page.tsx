import { Metadata } from 'next';
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActivityTabs from '@/components/profile/ProfileActivityTabs';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { getUserListings } from '@/lib/data/get-user-activity';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

export const metadata: Metadata = {
  title: 'الملف الشخصي | صوت الفلاح',
  description: 'إدارة ملفك الشخصي ومتابعة نشاطك على المنصة',
};

export default async function ProfilePage() {
  const profileData = await getCurrentProfile();

  if (!profileData || !profileData.profile) {
    redirect(ROUTES.LOGIN);
  }

  const { profile } = profileData;
  const listings = await getUserListings(profile.id, false);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full mx-auto max-w-5xl animate-fade-in pb-12" dir="rtl">
      
      {/* 
        PRD Goal:
        Build trust, present user identity clearly, and surface the user’s activity.
      */}

      {/* Top Identity Block */}
      <section>
        <ProfileHeader profile={profile} isOwnProfile={true} />
      </section>

      {/* Profile Overview Stats */}
      <section>
        <h2 className="text-lg font-bold text-on-surface mb-4 px-2">إحصائيات الملف</h2>
        <ProfileStats role={profile.role} />
      </section>

      {/* Role-Specific Activity Navigation Block */}
      <section className="mt-4">
        <h2 className="text-lg font-bold text-on-surface mb-4 px-2">النشاط الأخير</h2>
        <ProfileActivityTabs role={profile.role} listings={listings} />
      </section>
      
    </div>
  );
}
