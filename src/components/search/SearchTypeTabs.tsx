// src/components/search/SearchTypeTabs.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  ShoppingBag, 
  TrendingDown, 
  MessageSquare, 
  Users 
} from 'lucide-react';

const SEARCH_TYPES = [
  { id: 'all', label: 'الكل', icon: LayoutGrid },
  { id: 'listings', label: 'عروض بيع', icon: ShoppingBag },
  { id: 'requests', label: 'طلبات شراء', icon: TrendingDown },
  { id: 'posts', label: 'أسئلة ونقاشات', icon: MessageSquare },
  { id: 'profiles', label: 'فلاحين وتجار', icon: Users },
] as const;

interface SearchTypeTabsProps {
  activeType: string;
}

export function SearchTypeTabs({ activeType }: SearchTypeTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x">
      {SEARCH_TYPES.map((type) => {
        const Icon = type.icon;
        const isActive = activeType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => handleTypeChange(type.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-black whitespace-nowrap transition-all snap-start shadow-sm text-sm border-2",
              isActive 
                ? "bg-primary border-primary text-on-primary scale-[1.02] shadow-primary/20" 
                : "bg-white border-outline-variant text-on-surface-variant hover:border-primary/30 hover:bg-surface-container-low"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-on-primary" : "text-primary")} />
            <span>{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}
