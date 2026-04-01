import React from "react";
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  ChevronLeft,
  LayoutDashboard
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

interface DashboardStatsProps {
  profile: any;
}

export default async function DashboardStats({ profile }: DashboardStatsProps) {
  const supabase = await createClient();

  // Fetch counts for the current user
  const [listingsCount, requestsCount] = await Promise.all([
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'active'),
    supabase
      .from('purchase_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'active')
  ]);

  const stats = [
    {
      label: "عروض",
      fullLabel: "عروض نشطة",
      value: listingsCount.count || 0,
      icon: Package,
      href: "/my-listings",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      label: "طلبات",
      fullLabel: "طلبات معلقة",
      value: requestsCount.count || 0,
      icon: ShoppingBag,
      href: "/my-requests",
      color: "text-secondary",
      bg: "bg-secondary/10"
    }
  ];

  return (
    <section>
      {/* ── MOBILE VIEW (Ultra-Compact Stat Bar) ── */}
      <div className="lg:hidden flex items-center justify-around bg-card border border-outline-variant/10 rounded-2xl py-3 px-4 shadow-sm animate-in fade-in duration-300">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="flex items-center gap-2 group">
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-on-surface leading-none">{stat.value}</span>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">{stat.label}</span>
            </div>
          </Link>
        ))}
        {/* Minimalist divider */}
        <div className="w-[1px] h-8 bg-outline-variant/20 mx-2" />
        <Link href={ROUTES.DASHBOARD} className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant">
          <LayoutDashboard className="w-4 h-4" />
        </Link>
      </div>

      {/* ── DESKTOP VIEW (Sidebar Card) ── */}
      <div className="hidden lg:block bg-surface rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant/5 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black text-on-surface">ملخص النشاط</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {stats.map((stat, idx) => (
            <Link 
              key={idx} 
              href={stat.href}
              className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all group border border-outline-variant/5"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-tight">{stat.fullLabel}</p>
                  <p className="text-xl font-black text-on-surface">{stat.value}</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-on-surface-variant/30 group-hover:text-primary transition-colors" />
            </Link>
          ))}
          <Link 
            href={ROUTES.DASHBOARD} 
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-highest text-on-surface-variant font-bold text-[11px] hover:bg-primary hover:text-on-primary transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>لوحة التحكم الكاملة</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
