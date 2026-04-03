// src/components/settings/NotificationSettings.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  ShoppingBag, 
  Zap, 
  TrendingUp, 
  BellRing,
  Smartphone
} from 'lucide-react';

const NOTIFICATION_GROUPS = [
  {
    id: 'commercial',
    label: 'النشاط التجاري',
    items: [
      { id: 'messages', label: 'الرسائل الجديدة', icon: MessageSquare, initial: true },
      { id: 'matches', label: 'مطابقات السوق', icon: Zap, initial: true },
      { id: 'listing_activity', label: 'تفاعل الإعلانات', icon: TrendingUp, initial: true },
    ]
  },
  {
    id: 'community',
    label: 'المجتمع والمنشورات',
    items: [
      { id: 'replies', label: 'التعليقات والردود', icon: MessageSquare, initial: true },
      { id: 'follows', label: 'متابعات جديدة', icon: BellRing, initial: false },
    ]
  },
  {
    id: 'system',
    label: 'النظام والأمان',
    items: [
      { id: 'account_updates', label: 'تحديثات الحساب', icon: Smartphone, initial: true },
      { id: 'recommendations', label: 'مقترحات مخصصة', icon: Zap, initial: false },
    ]
  }
];

export function NotificationSettings() {
  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 overflow-hidden divide-y-2 divide-outline-variant/10 shadow-sm transition-all duration-500 hover:border-primary/20">
      {NOTIFICATION_GROUPS.map((group) => (
        <div key={group.id} className="p-8 space-y-6">
           <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">{group.label}</h3>
           
           <div className="space-y-6">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center text-on-surface-variant/30 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                          <Icon className="w-5 h-5" />
                       </div>
                       <label htmlFor={item.id} className="text-sm font-black text-on-surface cursor-pointer select-none">
                         {item.label}
                       </label>
                    </div>

                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id={item.id}
                        className="sr-only peer" 
                        defaultChecked={item.initial}
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      ))}

      <div className="p-6 bg-surface-container-lowest flex items-center justify-between italic">
         <p className="text-xs font-medium text-on-surface-variant/60">
            سيتم إرسال التنبيهات عبر البريد الإلكتروني والإشعارات الفورية.
         </p>
         <button className="text-xs font-black text-primary hover:underline">تعديل الوسائل</button>
      </div>
    </div>
  );
}
