// src/components/search/SearchResultsList.tsx
import React from 'react';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RequestCard } from '@/components/marketplace/RequestCard';
import { PostCard } from './PostCard';
import { ProfileCard } from './ProfileCard';
import { EmptySearch } from './EmptySearch';
import { searchAll } from '@/lib/data/search';

interface SearchResultsListProps {
  query: string;
  type: string;
}

export async function SearchResultsList({ query, type }: SearchResultsListProps) {
  const results = await searchAll(query, type);

  const allResults = [
    ...results.listings.map((l) => ({ ...l, resultType: 'listing' })),
    ...results.requests.map((r) => ({ ...r, resultType: 'request' })),
    ...results.posts.map((p) => ({ ...p, resultType: 'post' })),
    ...results.profiles.map((u) => ({ ...u, resultType: 'profile' })),
  ];

  if (allResults.length === 0) {
    return <EmptySearch query={query} />;
  }

  return (
    <div className="space-y-6">
      {/* Result Count */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">
          تم العثور على {allResults.length} نتيجة
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <span>ترتيب حسب:</span>
          <select className="bg-transparent border-none outline-none font-black cursor-pointer">
            <option>الأحدث</option>
            <option>الأكثر صلة</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allResults.map((result: any) => {
          if (result.resultType === 'listing') return <ListingCard key={result.id} listing={result} />;
          if (result.resultType === 'request') return <RequestCard key={result.id} request={result} />;
          if (result.resultType === 'post') return <PostCard key={result.id} post={result} />;
          if (result.resultType === 'profile') return <ProfileCard key={result.id} profile={result} />;
          return null;
        })}
      </div>
    </div>
  );
}
