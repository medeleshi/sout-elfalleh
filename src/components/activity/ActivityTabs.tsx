// src/components/activity/ActivityTabs.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  TrendingDown, 
  MessageSquare, 
  Heart 
} from 'lucide-react';

const ACTIVITY_TABS = [
  { id: 'listings', label: 'إعلاناتي', icon: ShoppingBag },
  { id: 'requests', label: 'طلباتي', icon: TrendingDown },
  { id: 'posts', label: 'مشاركاتي', icon: MessageSquare },
  { id: 'saved', label: 'المحفوظات', icon: Heart },
] as const;

interface ActivityTabsProps {
  activeTab: string;
}

export function ActivityTabs({ activeTab }: ActivityTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/activity?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-[2rem] border-2 border-outline-variant/20 mb-2 overflow-x-auto scrollbar-hide snap-x">
      {ACTIVITY_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-black whitespace-nowrap transition-all shadow-sm text-sm snap-start flex-1",
              isActive 
                ? "bg-white border-2 border-primary text-primary scale-[1.02] shadow-xl shadow-primary/5" 
                : "border-2 border-transparent text-on-surface-variant/40 hover:text-on-surface-variant hover:bg-white/50"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-on-surface-variant/30")} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
