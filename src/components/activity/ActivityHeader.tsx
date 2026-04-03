// src/components/activity/ActivityHeader.tsx
'use client';

import React from 'react';
import { 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Heart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActivityHeader() {
  const stats = [
    { label: 'إعلانات نشطة', value: '12', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'طلبات شراء', value: '5', icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/5' },
    { label: 'تفاعل كلي', value: '+2.4k', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
    { label: 'محفوظات', value: '18', icon: Heart, color: 'text-error', bg: 'bg-error/5' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">نشاطاتي</h1>
        <p className="text-sm font-medium text-on-surface-variant/60 mt-1 max-w-2xl italic">
          إدارة منشوراتك، مراجعة العروض، وتتبع محفوظاتك في مكان واحد.
        </p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-[2rem] border-2 border-outline-variant/30 px-6 py-5 flex items-center gap-4 hover:border-primary/30 transition-all transition-transform hover:-translate-y-1 shadow-sm">
            <div className={cn("p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="space-y-0.5">
               <p className="text-2xl font-black text-on-surface leading-none">{stat.value}</p>
               <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Action Alert */}
      <div className="bg-error/5 border border-error/10 p-4 rounded-2xl flex items-center gap-3">
         <AlertCircle className="w-5 h-5 text-error shrink-0" />
         <p className="text-sm font-black text-error italic">لديك 3 إعلانات شارفت على الانتهاء، ينصح بتحديثها لضمان استمرار ظهورها.</p>
      </div>
    </div>
  );
}
