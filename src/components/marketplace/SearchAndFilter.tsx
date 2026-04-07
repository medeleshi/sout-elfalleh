'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterDrawer } from './FilterDrawer';

interface SearchAndFilterProps {
  categories: { id: string; name_ar: string }[];
  governorates: { id: string; name_ar: string }[];
  units: { id: string; name_ar: string }[];
}

export function SearchAndFilter({ categories, governorates, units }: SearchAndFilterProps) {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

  return (
    <>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
          <input 
            type="text" 
            placeholder="ابحث عن محاصيل، فلاحين، أو طلبات..."
            className="w-full pl-6 pr-12 py-4 rounded-2xl border-2 border-outline-variant bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-lg placeholder:text-outline-variant shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsFiltersOpen(true)}
          className="p-4 bg-white border-2 border-outline-variant rounded-2xl text-on-surface hover:border-primary transition-all active:scale-95 shadow-sm group relative"
        >
          <SlidersHorizontal className="w-6 h-6 group-hover:text-primary transition-colors" />
          <span className="absolute -top-1 -left-1 w-4 h-4 bg-primary rounded-full border-2 border-white scale-0 transition-transform" />
        </button>
      </div>

      <FilterDrawer 
        isOpen={isFiltersOpen} 
        onClose={() => setIsFiltersOpen(false)} 
        categories={categories}
        governorates={governorates}
        units={units}
      />
    </>
  );
}
