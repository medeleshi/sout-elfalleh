// src/components/activity/ActivityList.tsx
import React from 'react';
import { ManagementCard } from './ManagementCard';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RequestCard } from '@/components/marketplace/RequestCard';
import { PostCard } from '@/components/search/PostCard';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Own Activity
const MOCK_OWN_ACTIVITY = {
  listings: [
    { id: 'ol1', title: '500 كغ طماطم فصلية ممتازة', type: 'listing' as const, status: 'active' as const, createdAt: 'منذ يومين', views: 245, engagement: 12, image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?auto=format&fit=crop&q=80&w=400' },
    { id: 'ol2', title: 'زيت زيتون جرجيس بكر ممتاز', type: 'listing' as const, status: 'stale' as const, createdAt: 'منذ شهر', views: 890, engagement: 45, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400' },
  ],
  requests: [
    { id: 'or1', title: 'مطلوب بذور قمح صلب للزراعة', type: 'request' as const, status: 'active' as const, createdAt: 'منذ 5 ساعات', views: 42, engagement: 3 },
  ],
  posts: [
    { id: 'op1', title: 'تجربتي مع نظام الري الجديد في جندوبة', type: 'post' as const, status: 'active' as const, createdAt: 'منذ 3 أيام', views: 1200, engagement: 64 },
  ],
  saved: [
    { id: 's1', type: 'listing', data: { id: 'l1', title: 'بطاطا طازجة من فلاحي جندوبة', category: 'خضروات', price: 1200, quantity: 500, unit: 'كغ', location: 'جندوبة', publisher: 'فلاح سليم', isVerified: true, createdAt: 'منذ ساعتين' } },
    { id: 's2', type: 'post', data: { id: 'p1', title: 'كيفية علاج آفة النخيل في قبلي؟', content: 'السلام عليكم، لدي نخيل يعاني من اصفرار الأوراق منذ أسبوع...', type: 'question', author: 'فلاح طاهر', createdAt: 'منذ 3 ساعات', repliesCount: 12 } },
  ]
};

interface ActivityListProps {
  activeTab: string;
  userId: string;
}

export async function ActivityList({ activeTab, userId }: ActivityListProps) {
  // Empty State Helper
  const EmptyState = ({ label, actionLabel, actionPath }: { label: string; actionLabel: string; actionPath: string }) => (
    <div className="py-20 flex flex-col items-center text-center space-y-6 border-2 border-dashed border-outline-variant/20 rounded-[3rem] bg-surface-container-lowest">
      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-on-surface-variant/20">
         <Search className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-on-surface">{label}</h3>
        <p className="text-sm font-medium text-on-surface-variant/60 italic">لا يوجد نشاط مسجل في هذا القسم حالياً.</p>
      </div>
      <Link href={actionPath}>
        <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          {actionLabel}
        </button>
      </Link>
    </div>
  );

  if (activeTab === 'listings') {
    if (MOCK_OWN_ACTIVITY.listings.length === 0) return <EmptyState label="ليس لديك إعلانات بعد" actionLabel="إضافة إعلان جديد" actionPath="/listings/new" />;
    return (
      <div className="grid grid-cols-1 gap-6">
        {MOCK_OWN_ACTIVITY.listings.map(item => <ManagementCard key={item.id} item={item} />)}
      </div>
    );
  }

  if (activeTab === 'requests') {
    if (MOCK_OWN_ACTIVITY.requests.length === 0) return <EmptyState label="ليس لديك طلبات شراء بعد" actionLabel="إضافة طلب شراء" actionPath="/purchase-requests/new" />;
    return (
      <div className="grid grid-cols-1 gap-6">
        {MOCK_OWN_ACTIVITY.requests.map(item => <ManagementCard key={item.id} item={item} />)}
      </div>
    );
  }

  if (activeTab === 'posts') {
    if (MOCK_OWN_ACTIVITY.posts.length === 0) return <EmptyState label="ليس لديك منشورات بعد" actionLabel="كتابة منشور جديد" actionPath="/posts/new" />;
    return (
      <div className="grid grid-cols-1 gap-6">
        {MOCK_OWN_ACTIVITY.posts.map(item => <ManagementCard key={item.id} item={item} />)}
      </div>
    );
  }

  if (activeTab === 'saved') {
    if (MOCK_OWN_ACTIVITY.saved.length === 0) {
      return (
        <div className="py-20 flex flex-col items-center text-center space-y-6 border-2 border-dashed border-outline-variant/20 rounded-[3rem] bg-surface-container-lowest">
          <div className="w-20 h-20 bg-error/5 rounded-full flex items-center justify-center text-error/20">
             <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-on-surface">قائمة المحفوظات فارغة</h3>
            <p className="text-sm font-medium text-on-surface-variant/60 italic">احفظ الإعلانات التي تهمك للعودة إليها لاحقاً.</p>
          </div>
          <Link href="/marketplace">
            <button className="px-8 py-3 bg-secondary text-on-secondary rounded-xl font-black text-xs shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
              استكشاف السوق
            </button>
          </Link>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {MOCK_OWN_ACTIVITY.saved.map((item: any) => {
          if (item.type === 'listing') return <ListingCard key={item.id} listing={item.data} />;
          if (item.type === 'post') return <PostCard key={item.id} post={item.data} />;
          return null;
        })}
      </div>
    );
  }

  return null;
}
