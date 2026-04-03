'use client';

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Leaf,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { type Tables } from "@/types/database";
import { signOutAction } from "@/lib/auth/actions";
import { ROUTES } from "@/lib/constants/routes";

type Profile = Tables<'profiles'>;

interface AppHeaderProps {
  profile: Profile | null;
}

export default function AppHeader({ profile }: AppHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const ROLE_LABELS: Record<string, string> = {
    farmer: 'فلاح',
    merchant: 'تاجر',
    buyer: 'مشتري',
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('q');
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query.toString())}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-2xl transition-all duration-300" dir="rtl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-outline-variant/10 to-transparent" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 relative">
        
        {/* Right side: Logo & Brand */}
        <div className={`flex items-center gap-8 shrink-0 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 invisible md:opacity-100 md:visible' : 'opacity-100 visible'}`}>
          <Link href={ROUTES.HOME} className="flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 rotate-1 transform hover:rotate-0 transition-transform">
              <Leaf className="w-7 h-7 text-on-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-primary font-serif italic block leading-none">صوت الفلاح</span>
              <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mt-0.5 block">سوقكم الرقمي</span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className={`flex-1 max-w-2xl transition-all duration-300 ${isMobileSearchOpen ? 'absolute inset-x-4 top-1/2 -translate-y-1/2 flex z-10' : 'hidden md:block'}`}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors pointer-events-none" />
              <input 
                type="search" 
                name="q"
                autoFocus={isMobileSearchOpen}
                placeholder="ابحث عن منتجات، فلاحين، أو طلبات..."
                className="w-full bg-surface-container-low border-none rounded-2xl py-3.5 pr-12 pl-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium shadow-inner"
              />
              {isMobileSearchOpen && (
                <button type="button" onClick={() => setIsMobileSearchOpen(false)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-container-high rounded-xl text-on-surface-variant md:hidden">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Left side: Actions & Profile */}
        <div className={`flex items-center gap-2 sm:gap-4 shrink-0 transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 invisible md:opacity-100 md:visible' : 'opacity-100 visible'}`}>
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2.5 rounded-xl text-on-surface-variant/70 hover:bg-surface-container-high hover:text-primary transition-all"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 px-1 border-l border-outline-variant/20 ml-2">
            <Link href={ROUTES.NOTIFICATIONS} className="p-2.5 rounded-xl text-on-surface-variant/70 hover:bg-surface-container-high hover:text-primary transition-all relative group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface" />
            </Link>
            <Link href={ROUTES.MESSAGES} className="p-2.5 rounded-xl text-on-surface-variant/70 hover:bg-surface-container-high hover:text-primary transition-all group relative">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Desktop Profile Area */}
          <div className="hidden md:block relative group/menu">
            <button className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl border border-transparent hover:border-outline-variant/30 hover:bg-surface-container-low transition-all cursor-pointer group">
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold text-on-surface text-right truncate max-w-[120px]">{profile?.full_name || 'مستخدم'}</p>
                <p className="text-[10px] text-primary/70 font-black text-right uppercase tracking-wider">{profile?.role ? ROLE_LABELS[profile.role] : 'أكمل البيانات'}</p>
              </div>
              <div className="relative">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/10 shadow-md" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary transition-all"><User className="w-5 h-5" /></div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-on-surface-variant/40 group-hover:text-on-surface transition-colors" />
            </button>

            <div className="absolute left-0 top-full mt-2 w-64 bg-surface rounded-3xl shadow-2xl border border-outline-variant/10 py-3 opacity-0 invisible translate-y-2 group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
              <Link href={ROUTES.PROFILE} className="flex items-center justify-between px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors group/item">
                <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/5 text-primary"><User className="w-4 h-4" /></div><span>الملف الشخصي</span></div>
                <ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover/item:opacity-40 transition-all" />
              </Link>
              <Link href={ROUTES.SETTINGS} className="flex items-center justify-between px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors group/item">
                <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant"><Settings className="w-4 h-4" /></div><span>الإعدادات</span></div>
                <ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover/item:opacity-40 transition-all" />
              </Link>
              <div className="h-px bg-outline-variant/5 mx-4 my-2" />
              <button onClick={() => startTransition(() => signOutAction())} disabled={isPending} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-error hover:bg-error/5 transition-colors">
                <div className="p-2 rounded-lg bg-error/5"><LogOut className="w-4 h-4" /></div>
                <span className="flex-1 text-right">{isPending ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
              </button>
            </div>
          </div>

          {/* Simple Mobile Notification Link (Optional) */}
          <Link href={ROUTES.NOTIFICATIONS} className="md:hidden p-2.5 rounded-xl text-on-surface-variant relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface" />
          </Link>
        </div>
      </div>
    </header>
  );
}
