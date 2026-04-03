// src/app/(app)/settings/page.tsx
import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { AccountActions } from '@/components/settings/AccountActions';
import Link from 'next/link';
import { User, Bell, Shield, Sliders, LogOut } from 'lucide-react';

export default async function SettingsPage() {
  const profileData = await getCurrentProfile();
  if (!profileData || !profileData.profile) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-32 pt-4 px-4 lg:px-8" dir="rtl">
      {/* 1. Page Header */}
      <SettingsHeader profile={profileData.profile} />

      <div className="space-y-16">
        {/* 2. Account Settings */}
        <SettingsSection 
          title="إعدادات الحساب" 
          description="إدارة معلوماتك الأساسية وربط حساباتك."
          icon={User}
        >
          <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/10 shadow-sm">
            {/* Group 1: Personal Info */}
            <div className="p-8 space-y-6">
               <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">المعلومات الشخصية</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-1">
                     <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">الاسم الكامل</p>
                     <p className="text-sm font-black text-on-surface">{profileData.profile.full_name || '—'}</p>
                  </div>
                  
                  <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-1">
                     <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">نبذة عنك</p>
                     <p className="text-sm font-black text-on-surface leading-tight line-clamp-1 italic">{profileData.profile.bio || 'لا يوجد وصف حالياً.'}</p>
                  </div>
               </div>
            </div>

            {/* Group 2: Professional Details */}
            <div className="p-8 space-y-6">
               <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">التصنيف المهني</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-1">
                     <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">الدور الحالي</p>
                     <p className="text-sm font-black text-on-surface">{profileData.profile.role === 'farmer' ? 'فلاح' : 'مشتري / تاجر'}</p>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-1">
                     <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">نوع النشاط</p>
                     <p className="text-sm font-black text-on-surface">{(profileData.profile as any).activity_type_name_ar || 'غير محدد'}</p>
                  </div>
               </div>
            </div>

            {/* Group 3: Location */}
            <div className="p-8 space-y-6">
               <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">الموقع الجغرافي</h3>
               
               <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-1">
                  <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">المحافظة</p>
                  <p className="text-sm font-black text-on-surface">{profileData.profile.governorate_name_ar || 'غير محدد'}</p>
               </div>
            </div>

            <div className="p-6 bg-surface-container-lowest flex items-center justify-between group">
               <p className="text-xs font-medium text-on-surface-variant/60">
                  هل ترغب في تحديث معلومات ملفك الشخصي بالكامل؟
               </p>
               <Link href="/profile/edit" className="text-xs font-black text-primary hover:underline">تعديل الملف الشخصي</Link>
            </div>
          </div>
        </SettingsSection>

        {/* 3. Notification Settings */}
        <SettingsSection 
          title="تنبيهات المنصة" 
          description="حدد كيف ومتى تود استلام التحديثات المهمة."
          icon={Bell}
        >
          <NotificationSettings />
        </SettingsSection>

        {/* 4. Privacy & Safety */}
        <SettingsSection 
          title="الخصوصية والأمان" 
          description="إدارة رؤية بياناتك وحدود التواصل مع الآخرين."
          icon={Shield}
        >
          <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 p-8 space-y-6">
             <div className="flex items-center justify-between group">
                <div className="space-y-1">
                   <h4 className="text-sm font-black text-on-surface">رؤية الملف الشخصي</h4>
                   <p className="text-xs font-medium text-on-surface-variant/60 italic">السماح للجميع برؤية نشاطاتك وموقعك التقريبي.</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1">
                   <div className="w-4 h-4 bg-white rounded-full mr-auto" />
                </div>
             </div>

             <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between group">
                <div className="space-y-1">
                   <h4 className="text-sm font-black text-on-surface">الأشخاص المحظورون</h4>
                   <p className="text-xs font-medium text-on-surface-variant/60 italic">إدارة قائمة الحسابات التي قمت بحظرها.</p>
                </div>
                <button className="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-black text-on-surface-variant hover:bg-surface-container-highest transition-all">عرض القائمة</button>
             </div>
          </div>
        </SettingsSection>

        {/* 5. General Preferences */}
        <SettingsSection 
          title="تفضيلات التجربة" 
          description="تخصيص سلوك التطبيق بما يناسب احتياجاتك اليومية."
          icon={Sliders}
        >
           <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 p-8 space-y-6">
             <div className="flex items-center justify-between group">
                <div className="space-y-1">
                   <h4 className="text-sm font-black text-on-surface">وضع توفير البيانات</h4>
                   <p className="text-xs font-medium text-on-surface-variant/60 italic">تقليل جودة الصور لتوفير رصيد الإنترنت.</p>
                </div>
                <div className="w-12 h-6 bg-outline-variant rounded-full relative flex items-center px-1">
                   <div className="w-4 h-4 bg-white rounded-full" />
                </div>
             </div>
          </div>
        </SettingsSection>

        {/* 6. Account Actions */}
        <AccountActions />
      </div>
    </div>
  );
}
