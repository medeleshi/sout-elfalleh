import React from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  ShoppingBag,
  Search,
  HelpCircle,
  LayoutList,
  MapPin,
  ChevronLeft
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

interface HomeHeroProps {
  profile: any;
}

export default function HomeHero({ profile }: HomeHeroProps) {
  const firstName = profile?.full_name?.split(' ')[0] || 'أخي الفلاح';
  const role = profile?.role;
  const governorate = profile?.governorate_name_ar || 'تونس';

  const getActions = () => {
    if (role === 'farmer' || role === 'merchant') {
      return {
        primary: { label: 'أضف بضاعة', icon: PlusCircle, href: ROUTES.LISTINGS_NEW, theme: 'primary' },
        secondary: [
          { label: 'بحث', icon: Search, href: '/marketplace?search=true' },
          { label: 'طلبات الشراء', icon: LayoutList, href: '/requests' },
          { label: 'اسأل', icon: HelpCircle, href: '/community/create' },
        ]
      };
    }
    return {
      primary: { label: 'اطلب منتجاً', icon: ShoppingBag, href: ROUTES.PURCHASE_REQUESTS_NEW, theme: 'primary' },
      secondary: [
        { label: 'بحث', icon: Search, href: '/marketplace' },
        { label: 'تصفح العروض', icon: LayoutList, href: '/marketplace' },
        { label: 'اسأل', icon: HelpCircle, href: '/community/create' },
      ]
    };
  };

  const { primary, secondary } = getActions();

  return (
    <section className="pt-0 pb-2 md:py-2" dir="rtl">
      <div className="bg-card border border-outline-variant/10 rounded-2xl md:rounded-[2rem] p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        
        {/* 1. Header Line: Location + Greeter (Compact) */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 md:mb-5 md:pb-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="w-3.5 h-3.5 md:w-4 h-4" />
            </div>
            <span className="text-[13px] md:text-sm font-black text-on-surface">سوق {governorate}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant/30 hidden sm:block" />
            <span className="text-sm text-on-surface-variant/60 hidden sm:block">طاب يومك، {firstName}</span>
          </div>
          
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
            ما هي خُطوتكم؟
          </div>
        </div>

        {/* 2. Action Toolbar (Flat & Direct) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {/* Primary Highlighted Action */}
          <Link
            href={primary.href}
            className="flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-primary px-3 py-2.5 md:px-4 md:py-3.5 text-on-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 active:scale-95 group"
          >
            <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-white/20 shrink-0 group-hover:rotate-12 transition-transform">
              <primary.icon className="w-4 h-4 md:w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] md:text-sm font-black leading-none mb-0.5">{primary.label}</span>
              <span className="text-[9px] md:text-[10px] font-medium opacity-70 truncate uppercase">ابدأ الآن</span>
            </div>
            <ChevronLeft className="w-3.5 h-3.5 mr-auto opacity-60 hidden sm:block" />
          </Link>

          {/* Secondary Muted Actions */}
          {secondary.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border bg-surface px-3 py-2.5 md:px-4 md:py-3.5 text-on-surface hover:bg-surface-container-low transition-all border-outline-variant/30 active:scale-95 group"
            >
              <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-surface-container-high text-on-surface group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
                <action.icon className="w-4 h-4 md:w-5 h-5" />
              </div>
              <span className="text-[13px] md:text-sm font-black group-hover:text-primary transition-colors truncate">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
