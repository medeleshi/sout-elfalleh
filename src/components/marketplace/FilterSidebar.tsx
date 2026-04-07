'use client';

import React from 'react';
import { 
  X, 
  ChevronDown, 
  MapPin, 
  Tag, 
  Layers, 
  Banknote, 
  Scale,
  RefreshCcw,
  Zap,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FilterSidebarProps {
  categories: { id: string; name_ar: string }[];
  governorates: { id: string; name_ar: string }[];
  units: { id: string; name_ar: string }[];
}

export function FilterSidebar({ categories, governorates, units }: FilterSidebarProps) {
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

  return (
    <aside className="hidden lg:block w-80 shrink-0 space-y-8 sticky top-24 h-fit" dir="rtl">
      {/* Header with Reset */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <h2 className="text-2xl font-black text-on-surface">تصفية النتائج</h2>
        <button 
          onClick={clearFilters}
          className="text-xs font-black text-primary hover:underline flex items-center gap-2 uppercase tracking-widest"
        >
           <RefreshCcw className="w-3 h-3" />
           <span>مسح الكل</span>
        </button>
      </div>

      {/* 1. Type Filter (Supply vs Demand) */}
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

      {/* 2. Category Filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
           <Tag className="w-4 h-4" />
           <span>الصنف</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
           {categories.map(cat => (
             <button 
               key={cat.id} 
               onClick={() => updateFilters({ category_id: cat.id === categoryId ? null : cat.id })}
               className={`py-2.5 px-4 border rounded-xl text-xs font-black transition-all text-right ${
                 categoryId === cat.id 
                   ? 'bg-primary/10 border-primary text-primary' 
                   : 'bg-white border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
               }`}
             >
               {cat.name_ar}
             </button>
           ))}
        </div>
      </div>

      {/* 3. Location Filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
           <MapPin className="w-4 h-4" />
           <span>الولاية</span>
        </h3>
        <div className="relative group">
           <select 
             value={governorateId || ''}
             onChange={(e) => updateFilters({ governorate_id: e.target.value || null })}
             className="w-full h-14 bg-white border-2 border-outline-variant/30 rounded-2xl px-5 font-black text-sm appearance-none outline-none focus:border-primary transition-all cursor-pointer"
           >
              <option value="">كل الولايات</option>
              {governorates.map(gov => (
                <option key={gov.id} value={gov.id}>{gov.name_ar}</option>
              ))}
           </select>
           <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 pointer-events-none group-focus-within:rotate-180 transition-transform" />
        </div>
      </div>

      {/* 4. Price Filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
           <Banknote className="w-4 h-4" />
           <span>السعر (د.ت)</span>
        </h3>
        <div className="flex items-center gap-3">
           <input type="number" placeholder="من" className="flex-1 h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 font-black text-sm outline-none focus:border-primary transition-all" />
           <div className="w-2 h-px bg-outline-variant" />
           <input type="number" placeholder="إلى" className="flex-1 h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 font-black text-sm outline-none focus:border-primary transition-all" />
        </div>
      </div>

      {/* 5. Quantity Filter */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-2">
           <Scale className="w-4 h-4" />
           <span>الكمية</span>
        </h3>
        <div className="flex items-center gap-3">
           <input type="number" placeholder="الحد الأدنى" className="flex-1 h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 font-black text-sm outline-none focus:border-primary transition-all" />
           <select className="w-24 h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 font-black text-xs outline-none cursor-pointer">
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name_ar}</option>
              ))}
           </select>
        </div>
      </div>

      <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">تطبيق الفلاتر</Button>
    </aside>
  );
}
