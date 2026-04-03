// src/components/search/SearchResultsList.tsx
import React from 'react';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RequestCard } from '@/components/marketplace/RequestCard';
import { PostCard } from './PostCard';
import { ProfileCard } from './ProfileCard';
import { EmptySearch } from './EmptySearch';

// Mock Data Source (Integrated for implementation pass)
const MOCK_RESULTS = {
  listings: [
    { id: 'l1', title: 'بطاطا طازجة من فلاحي جندوبة', category: 'خضروات', price: 1200, quantity: 500, unit: 'كغ', location: 'جندوبة', publisher: 'فلاح سليم', isVerified: true, createdAt: 'منذ ساعتين' },
    { id: 'l2', title: 'زيت زيتون بكر ممتاز - عصرة أولى', category: 'ألبان', price: 25, quantity: 100, unit: 'لتر', location: 'سوسة', publisher: 'معصرة الأمل', isVerified: true, createdAt: 'منذ 5 ساعات' },
  ],
  requests: [
    { id: 'r1', title: 'مطلوب كمية كبيرة من الطماطم الفصلية', category: 'خضروات', quantity: 2000, unit: 'كغ', budget: 800, location: 'نابل', publisher: 'شركة تصدير الشمال', isVerified: true, createdAt: 'منذ يوم واحد' },
  ],
  posts: [
    { id: 'p1', title: 'كيفية علاج آفة النخيل في قبلي؟', content: 'السلام عليكم، لدي نخيل يعاني من اصفرار الأوراق منذ أسبوع. هل من اقتراحات؟', type: 'question' as const, author: 'فلاح طاهر', createdAt: 'منذ 3 ساعات', repliesCount: 12 },
    { id: 'p2', title: 'نقاش حول أسعار الأسمدة لهذا الموسم', content: 'لوحظ ارتفاع كبير في أسعار الأسمدة مؤخراً، ما رأيكم في الحلول البديلة؟', type: 'discussion' as const, author: 'منير البحري', createdAt: 'منذ يوم', repliesCount: 45 },
  ],
  profiles: [
    { id: 'u1', full_name: 'أحمد التونسي', role: 'farmer' as const, location: 'مدنين', isVerified: true, activityType: 'زراعة الحبوب والتمور' },
    { id: 'u2', full_name: 'شركة القرية التجارية', role: 'merchant' as const, location: 'تونس العاصمة', isVerified: true, activityType: 'توزيع وتصدير المنتجات الفلاحية' },
  ]
};

interface SearchResultsListProps {
  query: string;
  type: string;
}

export async function SearchResultsList({ query, type }: SearchResultsListProps) {
  // Simulator for searching (actual logic would call Supabase)
  const isAll = type === 'all';
  
  // Filter and flatten results based on type
  const results = [];
  
  if (isAll || type === 'listings') {
    results.push(...MOCK_RESULTS.listings.map(l => ({ ...l, resultType: 'listing' })));
  }
  if (isAll || type === 'requests') {
    results.push(...MOCK_RESULTS.requests.map(r => ({ ...r, resultType: 'request' })));
  }
  if (isAll || type === 'posts') {
    results.push(...MOCK_RESULTS.posts.map(p => ({ ...p, resultType: 'post' })));
  }
  if (isAll || type === 'profiles') {
    results.push(...MOCK_RESULTS.profiles.map(u => ({ ...u, resultType: 'profile' })));
  }

  // Filter by query (Dummy logic for implementation pass)
  const filteredResults = query 
    ? (results as any[]).filter(r => {
        const searchText = (r.title || r.full_name || r.content || '').toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
    : results;

  if (filteredResults.length === 0) {
    return <EmptySearch query={query} />;
  }

  return (
    <div className="space-y-6">
      {/* Result Count Status */}
      <div className="flex items-center justify-between px-2">
         <span className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">
           تم العثور على {filteredResults.length} نتيجة
         </span>
         <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <span>ترتيب حسب:</span>
            <select className="bg-transparent border-none outline-none font-black cursor-pointer">
               <option>الأكثر صلة</option>
               <option>الأحدث</option>
               <option>الأقرب</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResults.map((result: any) => {
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
