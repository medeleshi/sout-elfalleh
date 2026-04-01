import React from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ShoppingBag,
  Leaf,
  Users,
  HelpCircle,
  ShieldCheck,
  Bell
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import DashboardStats from "@/components/dashboard/DashboardStats";
import MarketBrief from "@/components/dashboard/MarketBrief";
import PracticalAdvice from "@/components/dashboard/PracticalAdvice";
import SuggestedTraders from "@/components/dashboard/SuggestedTraders";

export default async function MorePage() {
  const profileData = await getCurrentProfile();
  if (!profileData || !profileData.profile) return null;
  const { profile } = profileData;

  const NavLink = ({ href, icon: Icon, label, color = "text-on-surface" }: any) => (
    <Link 
      href={href} 
      className="flex items-center justify-between p-5 bg-surface border border-outline-variant/10 rounded-3xl hover:bg-surface-container-low transition-all active:scale-[0.98] group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl bg-surface-container-high ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-black text-lg text-on-surface">{label}</span>
      </div>
      <ChevronLeft className="w-5 h-5 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
    </Link>
  );

  return (
    <div className="max-w-md mx-auto space-y-8 pb-32" dir="rtl">
      {/* 1. Profile Header */}
      <section className="bg-primary rounded-[3rem] p-8 text-on-primary shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-on-primary/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-on-primary/20 shadow-xl" alt="Profile" />
            ) : (
              <div className="w-24 h-24 rounded-[2rem] bg-on-primary/10 flex items-center justify-center"><User className="w-12 h-12" /></div>
            )}
            <div className="absolute -bottom-2 -right-2 p-2 bg-on-primary text-primary rounded-xl shadow-lg ring-4 ring-primary">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black">{profile.full_name}</h1>
            <p className="text-on-primary/60 font-medium uppercase tracking-[0.2em] text-[11px] mt-1">{profile.role} • {profile.governorate_name_ar}</p>
            <Link href={ROUTES.PROFILE} className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-on-primary/10 hover:bg-on-primary/20 rounded-full text-xs font-bold transition-all">
              تعديل الحساب
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Insights (The Sidebar items) */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-primary px-2">الإحصائيات والسوق</h2>
        <DashboardStats profile={profile} />
        <MarketBrief governorate={profile.governorate_name_ar || 'تونس'} />
      </section>

      {/* 3. Main Navigation */}
      <section className="grid gap-4">
         <h2 className="text-xl font-black text-primary px-2">مركز الخدمات</h2>
         <NavLink href="/marketplace" icon={ShoppingBag} label="سوق الفلاح" />
         <NavLink href="/community" icon={Users} label="منتدى الفلاحين" />
         <NavLink href={ROUTES.NOTIFICATIONS} icon={Bell} label="التنبيهات" />
         <NavLink href={ROUTES.SETTINGS} icon={Settings} label="الإعدادات العامة" />
         <NavLink href="/support" icon={HelpCircle} label="المساعدة والدعم" />
      </section>

      {/* 4. Support & Advice (More Sidebar items) */}
      <section className="space-y-6 pt-4">
         <PracticalAdvice />
         <SuggestedTraders currentUserId={profile.id} />
      </section>

      {/* 5. Logout Section */}
      <section className="pt-8">
        <button className="w-full flex items-center justify-center gap-3 p-6 bg-error/5 text-error rounded-3xl border border-error/10 font-black hover:bg-error/10 transition-all">
          <LogOut className="w-6 h-6" />
          <span>تسجيل الخروج</span>
        </button>
        <p className="text-center text-[10px] text-on-surface-variant/40 mt-6 font-bold tracking-widest uppercase">Sout El Falah • v1.0.0</p>
      </section>
    </div>
  );
}
