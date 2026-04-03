import React from "react";
import { 
  Bell, 
  FileEdit, 
  UserCircle, 
  Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/types/database";
import ReminderCard from "./ReminderCard";

interface HomeRemindersProps {
  profile: Tables<'profiles'>;
}

export default async function HomeReminders({ profile }: HomeRemindersProps) {
  const supabase = await createClient();

  // Logic to fetch reminder signals
  const [draftListingsResult, draftRequestsResult] = await Promise.all([
    supabase
      .from('listings')
      .select('id, title')
      .eq('user_id', profile.id)
      .eq('status', 'draft')
      .limit(1),
    supabase
      .from('purchase_requests')
      .select('id, title')
      .eq('user_id', profile.id)
      .eq('status', 'draft')
      .limit(1)
  ]);

  const draftListings = draftListingsResult.data as any[] | null;
  const draftRequests = draftRequestsResult.data as any[] | null;

  const reminders = [];

  // 1. Profile Completeness Reminder
  if (!profile.bio) {
    reminders.push({
      id: 'profile-bio',
      icon: UserCircle,
      title: "أكمل ملفك الشخصي",
      description: "إضافة نبذة شخصية تزيد من فرص تواصل التجار معك بنسبة 40%. أخبرهم بخبرتك.",
      actionLabel: "تعديل الملف",
      actionHref: "/profile/edit",
      variant: 'primary' as const
    });
  }

  // 2. Draft Listing Reminder
  if (draftListings && draftListings.length > 0) {
    reminders.push({
      id: 'draft-listing',
      icon: FileEdit,
      title: "لديك مسودة عرض غير منشورة",
      description: `يوجد عرض بعنوان "${draftListings[0].title}" يحتاج للإكمال والنشر ليبدأ في استقبال الطلبات.`,
      actionLabel: "إكمال العرض",
      actionHref: `/listings/${draftListings[0].id}/edit`,
      variant: 'warning' as const
    });
  } else if (draftRequests && draftRequests.length > 0) {
    reminders.push({
      id: 'draft-request',
      icon: FileEdit,
      title: "لديك مسودة طلب شراء",
      description: `طلب الشراء "${draftRequests[0].title}" لم يُنشر بعد. أكمله لتصل إلى البائعين.`,
      actionLabel: "إكمال الطلب",
      actionHref: `/requests/${draftRequests[0].id}/edit`,
      variant: 'warning' as const
    });
  }

  // 3. Welcome/Onboarding Tip (If newly completed)
  if (reminders.length === 0) {
    reminders.push({
      id: 'explore-matches',
      icon: Sparkles,
      title: "استكشف الفرص الجديدة",
      description: "تمت إضافة عروض جديدة تتوافق مع اهتماماتك في منطقتك. تحقق منها الآن.",
      actionLabel: "تصفح السوق",
      actionHref: "/marketplace",
      variant: 'info' as const
    });
  }

  return (
    <section className="mt-16 sm:mt-24 pb-12">
      <div className="mb-8 px-4 sm:px-0">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">تذكيرات وإجراءات</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-on-surface">إجراءات مقترحة لك</h2>
        <p className="text-sm text-on-surface-variant font-medium mt-1">خطوات بسيطة لتحسين حضورك ونجاح صفقاتك</p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 sm:px-0">
        {reminders.map((reminder) => (
          <ReminderCard 
            key={reminder.id}
            {...reminder}
          />
        ))}
      </div>
    </section>
  );
}
