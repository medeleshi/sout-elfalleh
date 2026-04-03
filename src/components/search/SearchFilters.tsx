// src/components/search/SearchFilters.tsx
'use client';

import React from 'react';
import { 
  Filter, 
  MapPin, 
  Tag, 
  Coins, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchFilters() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-outline-variant/10 p-6 space-y-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-black text-on-surface">تصفية النتائج</h2>
        </div>
        <button className="text-[10px] font-black text-on-surface-variant/40 hover:text-error transition-colors flex items-center gap-1.5 group">
           <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
           <span>إعادة تعيين</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between group cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-container-low rounded-xl group-hover:bg-primary/10 transition-colors">
                 <Tag className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs font-black text-on-surface">التصنيف</span>
           </div>
           <ChevronDown className="w-4 h-4 text-on-surface-variant/30" />
        </div>
        
        <div className="grid grid-cols-1 gap-2 pt-2">
           {['خضروات', 'فواكه', 'حبوب', 'أعلاف', 'معدات'].map(cat => (
             <label key={cat} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-all cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-outline-variant text-primary focus:ring-primary/20 accent-primary" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
             </label>
           ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between group cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-container-low rounded-xl group-hover:bg-secondary/10 transition-colors">
                 <MapPin className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </div>
              <span className="text-xs font-black text-on-surface">الولاية / المنطقة</span>
           </div>
           <ChevronDown className="w-4 h-4 text-on-surface-variant/30" />
        </div>
        
        <div className="relative">
           <input 
             type="text" 
             placeholder="ابحث عن ولاية..."
             className="w-full pl-4 pr-10 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-secondary outline-none transition-all text-sm font-medium italic"
           />
           <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
        </div>
      </div>

      {/* Price/Budget Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between group cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-container-low rounded-xl group-hover:bg-amber-500/10 transition-colors">
                 <Coins className="w-4 h-4 text-on-surface-variant group-hover:text-amber-500 transition-colors" />
              </div>
              <span className="text-xs font-black text-on-surface">السعر / الميزانية</span>
           </div>
           <ChevronDown className="w-4 h-4 text-on-surface-variant/30" />
        </div>
        
        <div className="flex items-center gap-4 pt-2">
           <div className="flex-1 space-y-1">
              <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">من</span>
              <input type="number" placeholder="0" className="w-full p-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-sm font-black" />
           </div>
           <div className="flex-1 space-y-1">
              <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">إلى</span>
              <input type="number" placeholder="++" className="w-full p-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-sm font-black" />
           </div>
        </div>
      </div>

      <Button className="w-full h-12 rounded-2xl font-black shadow-lg shadow-primary/10">تطبيق الفلاتر</Button>
    </div>
  );
}
