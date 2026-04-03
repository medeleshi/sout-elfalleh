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

/**
 * 1. WelcomeHeader: Compact greeter with location info.
 */
export function WelcomeHeader({ profile }: { profile: any }) {
  const firstName = profile?.full_name?.split(' ')[0] || 'أخي الفلاح';
  const governorate = profile?.governorate_name_ar || 'تونس';
  
  return (
    <div className="flex items-center justify-between gap-3 mb-6" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-primary/60 uppercase tracking-widest leading-none mb-1">سوق {governorate}</span>
          <h1 className="text-xl md:text-2xl font-black text-on-surface font-serif italic italic">طاب يومك، {firstName}</h1>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. PrimaryAction: High-impact standalone CTA.
 */
export function PrimaryAction({ profile }: { profile: any }) {
  const role = profile?.role;
  
  const action = role === 'farmer' || role === 'merchant'
    ? { label: 'أضف بضاعة جديدة', sub: 'ابدأ البيع الآن في سوق صوت الفلاح', icon: PlusCircle, href: ROUTES.LISTINGS_NEW }
    : { label: 'اطلب منتجاً الآن', sub: 'انشر طلب شراء ليصلك العروض من الفلاحين', icon: ShoppingBag, href: ROUTES.PURCHASE_REQUESTS_NEW };

  return (
    <Link
      href={action.href}
      className="block w-full group relative overflow-hidden rounded-[2rem] bg-primary p-6 md:p-8 text-on-primary shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
      dir="rtl"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl opacity-50" />
      
      <div className="relative flex items-center gap-6">
        <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-[1.5rem] bg-white/20 backdrop-blur-md shrink-0 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
          <action.icon className="w-8 h-8 md:w-10 h-10" />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-2 group-hover:translate-x-1 transition-transform">{action.label}</h2>
          <p className="text-sm md:text-base font-medium opacity-80 leading-relaxed max-w-[240px] md:max-w-none">{action.sub}</p>
        </div>
        <div className="mr-auto hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 opacity-0 group-hover:opacity-100 group-hover:mr-4 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
}

/**
 * 3. QuickActionPanel: Supportive, lightweight secondary actions.
 */
export function QuickActionPanel({ profile }: { profile: any }) {
  const role = profile?.role;
  
  const actions = role === 'farmer' || role === 'merchant'
    ? [
        { label: 'بحث سريع', icon: Search, href: '/marketplace?search=true' },
        { label: 'طلبات الشراء', icon: LayoutList, href: '/requests' },
        { label: 'اسأل المجتمع', icon: HelpCircle, href: '/community/create' },
      ]
    : [
        { label: 'بحث المنتجات', icon: Search, href: '/marketplace' },
        { label: 'تصفح العروض', icon: LayoutList, href: '/marketplace' },
        { label: 'اسأل المجتمع', icon: HelpCircle, href: '/community/create' },
      ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6" dir="rtl">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="flex flex-col items-center justify-center gap-2 rounded-[1.5rem] bg-surface-container-low p-4 text-on-surface hover:bg-surface-container-high hover:shadow-md transition-all border border-outline-variant/10 active:scale-95 group text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-[11px] md:text-xs font-black text-on-surface-variant group-hover:text-primary transition-colors leading-tight">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

// Keeping HomeHero as a combined container but better structured
export default function HomeHero({ profile }: HomeHeroProps) {
  return (
    <section className="space-y-6" dir="rtl">
      <WelcomeHeader profile={profile} />
      <PrimaryAction profile={profile} />
      <QuickActionPanel profile={profile} />
    </section>
  );
}
