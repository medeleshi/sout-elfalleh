'use client';

import React from 'react';
import { 
  X, 
  MapPin, 
  Tag, 
  Layers, 
  Banknote, 
  Scale,
  RefreshCcw,
  Zap,
  TrendingDown,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOVERNORATES = [
  'تونس', 'أريانة', 'بن عروس', 'منوبة', 'بنزرت', 'نابل', 'باجة', 'جندوبة', 'الكاف', 'سليانة', 
  'سوسة', 'المنستير', 'المهدية', 'صفاقس', 'القيروان', 'القصرين', 'سيدي بوزيد', 'قابس', 'مدنين', 
  'تطاوين', 'قفصة', 'توزر', 'قبلي'
];

const CATEGORIES = ['خضروات', 'فواكه', 'حبوب', 'ألبان', 'لحوم', 'تمور', 'زيتون', 'أعلاف'];

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500" 
        onClick={onClose}
      />
      
      {/* Drawer Body */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] shadow-2xl transition-transform duration-500 transform translate-y-0 max-h-[90vh] flex flex-col">
        {/* Drag Handle */}
        <div className="w-16 h-1.5 bg-outline-variant/30 rounded-full mx-auto my-4 shrink-0" />

        {/* Header */}
        <div className="px-8 pb-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">تصفية النتائج</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">تخصيص Marketplace الخاص بك</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant hover:text-on-surface transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
          {/* 1. Type Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <Layers className="w-4 h-4" />
               <span>نوع المحتوى</span>
            </h3>
            <div className="flex bg-surface-container-low border border-outline-variant/30 p-1.5 rounded-[2rem]">
               <button className="flex-1 py-4 px-4 bg-primary text-on-primary rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>عرض بيع</span>
               </button>
               <button className="flex-1 py-4 px-4 text-on-surface-variant/60 hover:text-on-surface font-black text-sm flex items-center justify-center gap-2 transition-all">
                  <TrendingDown className="w-4 h-4" />
                  <span>طلب شراء</span>
               </button>
            </div>
          </div>

          {/* 2. Location Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <MapPin className="w-4 h-4" />
               <span>الولاية</span>
            </h3>
            <div className="relative group">
               <select className="w-full h-16 bg-white border-2 border-outline-variant/30 rounded-2xl px-6 font-black text-sm appearance-none outline-none focus:border-primary transition-all">
                  <option>كل الولايات</option>
                  {GOVERNORATES.map(gov => (
                    <option key={gov}>{gov}</option>
                  ))}
               </select>
               <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant/40 pointer-events-none" />
            </div>
          </div>

          {/* 3. Category Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <Tag className="w-4 h-4" />
               <span>الصنف</span>
            </h3>
            <div className="flex flex-wrap gap-3">
               {CATEGORIES.map(cat => (
                 <button key={cat} className="py-3.5 px-6 bg-white border-2 border-outline-variant/30 rounded-2xl text-xs font-black text-on-surface-variant active:border-primary active:text-primary active:bg-primary/5 transition-all">
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          {/* 4. Price Filter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <Banknote className="w-4 h-4" />
               <span>السعر (د.ت)</span>
            </h3>
            <div className="flex items-center gap-4">
               <input type="number" placeholder="من" className="flex-1 h-14 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 font-black text-sm" />
               <div className="w-2 h-px bg-outline-variant" />
               <input type="number" placeholder="إلى" className="flex-1 h-14 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 font-black text-sm" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-white/80 backdrop-blur border-t border-outline-variant/20 flex gap-4 shrink-0">
           <button 
             onClick={onClose}
             className="flex-1 h-16 bg-primary text-on-primary rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-all"
           >
             تطبيق (12)
           </button>
           <button className="w-16 h-16 bg-surface-container-low border border-outline-variant/30 rounded-[1.5rem] flex items-center justify-center text-on-surface-variant/60 active:scale-95 transition-all">
             <RefreshCcw className="w-6 h-6" />
           </button>
        </div>
      </div>
    </div>
  );
}
