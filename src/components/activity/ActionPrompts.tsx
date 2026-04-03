// src/components/activity/ActionPrompts.tsx
'use client';

import React from 'react';
import { 
  Zap, 
  RefreshCw, 
  MessageCircle, 
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActionPrompts() {
  const prompts = [
    {
      id: 1,
      title: 'تحديث عروض قديمة',
      description: 'لديك عرض "زيت زيتون جرجيس" مضى عليه أكثر من 30 يوماً. قم بتحديثه ليبقى في قائمة الصدارة.',
      icon: RefreshCw,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      action: 'تحديث الآن'
    },
    {
      id: 2,
      title: 'ردود منتظرة',
      description: 'هناك 5 فلاحين علقوا على منشورك الأخير حول "أساليب الري". تفاعل معهم الآن.',
      icon: MessageCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
      action: 'رد الآن'
    },
    {
      id: 3,
      title: 'فرصة مطابقة',
      description: 'يتوفر حالياً عرض بيع يطابق طلبك لشراء "بذور القمح". اطلع عليه قبل فوات الأوان.',
      icon: Zap,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      action: 'عرض المطابقات'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
         <h2 className="text-sm font-black text-on-surface uppercase tracking-widest">إجراءات مقترحة</h2>
         <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
      </div>

      <div className="space-y-4">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="bg-white rounded-[2rem] border-2 border-outline-variant/30 p-6 space-y-4 hover:border-primary/20 transition-all group shadow-sm hover:shadow-xl hover:shadow-surface-container-highest/10 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl shrink-0", prompt.bg)}>
                <prompt.icon className={cn("w-5 h-5", prompt.color)} />
              </div>
              <h3 className="text-sm font-black text-on-surface">{prompt.title}</h3>
            </div>
            
            <p className="text-xs font-medium text-on-surface-variant/60 leading-relaxed italic">
              {prompt.description}
            </p>

            <button className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-primary/5 rounded-2xl group/btn transition-all">
               <span className="text-xs font-black text-on-surface-variant group-hover/btn:text-primary transition-colors">{prompt.action}</span>
               <ChevronLeft className="w-4 h-4 text-on-surface-variant group-hover/btn:text-primary transition-all group-hover/btn:-translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="p-6 bg-surface-container-lowest rounded-[2rem] border border-dashed border-outline-variant/40 space-y-3">
         <h4 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">نصيحة سريعة</h4>
         <p className="text-xs font-medium text-on-surface-variant/60 leading-relaxed">
            تحديث إعلاناتك بانتظام يزيد من فرص ظهورها للمشترين بنسبة تصل إلى 40%.
         </p>
      </div>
    </div>
  );
}
