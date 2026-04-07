'use client';

import React from 'react';
import { Leaf, Filter } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface CategoryChipsProps {
  categories: { id: string; name_ar: string }[];
  activeCategoryId?: string | null;
}

export function CategoryChips({ categories, activeCategoryId }: CategoryChipsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('category_id', id);
    } else {
      params.delete('category_id');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {/* "All" Chip */}
      <button
        onClick={() => handleSelect(null)}
        className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap border-2 ${
          !activeCategoryId 
            ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/20' 
            : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary/50'
        }`}
      >
        <Filter className={`w-4 h-4 ${!activeCategoryId ? 'text-on-primary' : 'text-primary'}`} />
        <span>الكل</span>
      </button>

      {categories.map((cat) => {
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap border-2 ${
              isActive 
                ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/20' 
                : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary/50'
            }`}
          >
            <Leaf className={`w-4 h-4 ${isActive ? 'text-on-primary' : 'text-primary'}`} />
            <span>{cat.name_ar}</span>
          </button>
        );
      })}
    </div>
  );
}
