// src/app/(app)/search/page.tsx
import React, { Suspense } from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchTypeTabs } from '@/components/search/SearchTypeTabs';
import { SearchResultsList } from '@/components/search/SearchResultsList';
import { SearchFilters } from '@/components/search/SearchFilters';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const profileData = await getCurrentProfile();
  if (!profileData || !profileData.profile) return null;

  const query = searchParams.q || '';
  const activeType = searchParams.type || 'all';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-32 pt-4 px-4 lg:px-8" dir="rtl">
      {/* 1. Search Entry & Header */}
      <SearchHeader initialQuery={query} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 2. Desktop Sidebar Filters */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-24">
          <SearchFilters />
        </div>

        <div className="flex-1 w-full space-y-6">
          {/* 3. Result Type Controls */}
          <SearchTypeTabs activeType={activeType} />

          {/* 4. Results Section */}
          <Suspense fallback={<div className="h-96 flex items-center justify-center text-on-surface-variant/40 animate-pulse font-black uppercase tracking-widest">جاري البحث...</div>}>
             <SearchResultsList query={query} type={activeType} />
          </Suspense>
        </div>
      </div>
      
      {/* Mobile Filters Trigger (implemented inside SearchHeader or as a floating button) */}
    </div>
  );
}
