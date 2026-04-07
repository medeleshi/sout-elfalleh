'use client';

import React from 'react';
import { 
  X, 
  MapPin, 
  Tag, 
  Layers, 
  Banknote, 
  RefreshCcw,
  Zap,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name_ar: string }[];
  governorates: { id: string; name_ar: string }[];
  units: { id: string; name_ar: string }[];
}

export function FilterDrawer({ isOpen, onClose, categories, governorates, units }: FilterDrawerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = searchParams.get('type') || 'listing';
  const categoryId = searchParams.get('category_id');
  const governorateId = searchParams.get('governorate_id');

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute inset-y-0 left-0 w-full max-w-[400px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <h2 className="text-2xl font-black text-on-surface">تصفية النتائج</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
          <button 
            onClick={clearFilters}
            className="text-xs font-black text-primary hover:underline flex items-center gap-2 uppercase tracking-widest"
          >
             <RefreshCcw className="w-3 h-3" />
             <span>مسح الكل</span>
          </button>

          {/* Type Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <Layers className="w-4 h-4" />
               <span>نوع المحتوى</span>
            </h3>
            <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
               <button 
                 onClick={() => updateFilters({ type: 'listing' })}
                 className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                   type === 'listing' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant/60 hover:text-on-surface'
                 }`}
               >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>عرض بيع</span>
               </button>
               <button 
                 onClick={() => updateFilters({ type: 'request' })}
                 className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                   type === 'request' ? 'bg-secondary text-on-secondary shadow-lg' : 'text-on-surface-variant/60 hover:text-on-surface'
                 }`}
               >
                  <TrendingDown className="w-4 h-4" />
                  <span>طلب شراء</span>
               </button>
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <MapPin className="w-4 h-4" />
               <span>الولاية</span>
            </h3>
            <div className="relative group">
               <select 
                 value={governorateId || ''}
                 onChange={(e) => updateFilters({ governorate_id: e.target.value || null })}
                 className="w-full h-16 bg-white border-2 border-outline-variant/30 rounded-2xl px-6 font-black text-sm appearance-none outline-none focus:border-primary transition-all cursor-pointer"
               >
                  <option value="">كل الولايات</option>
                  {governorates.map(gov => (
                    <option key={gov.id} value={gov.id}>{gov.name_ar}</option>
                  ))}
               </select>
               <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant/40 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <Tag className="w-4 h-4" />
               <span>الصنف</span>
            </h3>
            <div className="flex flex-wrap gap-3">
               {categories.map(cat => (
                 <button 
                   key={cat.id} 
                   onClick={() => updateFilters({ category_id: cat.id === categoryId ? null : cat.id })}
                   className={`py-3.5 px-6 border-2 rounded-2xl text-xs font-black transition-all ${
                     categoryId === cat.id 
                       ? 'bg-primary/10 border-primary text-primary' 
                       : 'bg-white border-outline-variant/30 text-on-surface-variant'
                   }`}
                 >
                   {cat.name_ar}
                 </button>
               ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
               <Banknote className="w-4 h-4" />
               <span>السعر (د.ت)</span>
            </h3>
            <div className="flex items-center gap-4">
               <input type="number" placeholder="من" className="flex-1 h-14 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 font-black text-sm outline-none focus:border-primary transition-all" />
               <div className="w-2 h-px bg-outline-variant" />
               <input type="number" placeholder="إلى" className="flex-1 h-14 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-6 font-black text-sm outline-none focus:border-primary transition-all" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-white/80 backdrop-blur border-t border-outline-variant/20 flex gap-4 shrink-0">
           <Button 
             onClick={onClose}
             className="flex-1 h-16 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/20"
           >
             تطبيق الفلاتر
           </Button>
        </div>
      </div>
    </div>
  );
}
