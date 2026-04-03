// src/components/search/SearchHeader.tsx
'use client';

import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

interface SearchHeaderProps {
  initialQuery?: string;
}

export function SearchHeader({ initialQuery = '' }: SearchHeaderProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb / Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-on-surface-variant/60 hover:text-primary transition-colors group"
      >
        <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">العودة</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-on-surface tracking-tight">نتائج البحث</h1>
          <p className="text-sm font-medium text-on-surface-variant/60 mt-1">
            البحث عن "{initialQuery || '...'}" في كافة الأقسام
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن محاصيل، فلاحين، أو طلبات..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-outline-variant bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-lg placeholder:text-outline-variant shadow-sm"
            />
            {query && (
              <button 
                type="button"
                onClick={() => setQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            )}
          </div>
          
          <button 
            type="button"
            className="lg:hidden p-4 bg-white border-2 border-outline-variant rounded-2xl text-on-surface hover:border-primary transition-all active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
