// src/components/activity/ActivityList.tsx
import React from 'react';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { ManagementCard } from './ManagementCard';
import { getFreshnessInfo } from '@/lib/utils/freshness';
import {
  getUserListings,
  getUserRequests,
  getUserPosts,
  getUserSavedItems,
} from '@/lib/data/get-user-activity';
import { createClient } from '@/lib/supabase/server';
import { ListingCard } from '@/components/marketplace/ListingCard';

interface ActivityListProps {
  activeTab: string;
  userId: string;
}

const EmptyState = ({
  label,
  actionLabel,
  actionPath,
}: {
  label: string;
  actionLabel: string;
  actionPath: string;
}) => (
  <div className="py-20 flex flex-col items-center text-center space-y-6 border-2 border-dashed border-outline-variant/20 rounded-[3rem] bg-surface-container-lowest">
    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-on-surface-variant/20">
      <Search className="w-10 h-10" />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black text-on-surface">{label}</h3>
      <p className="text-sm font-medium text-on-surface-variant/60 italic">
        لا يوجد نشاط مسجل في هذا القسم حالياً.
      </p>
    </div>
    <Link href={actionPath}>
      <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
        {actionLabel}
      </button>
    </Link>
  </div>
);

export async function ActivityList({ activeTab, userId }: ActivityListProps) {
  if (activeTab === 'listings') {
    const listings = await getUserListings(userId);
    if (listings.length === 0) {
      return <EmptyState label="ليس لديك إعلانات بعد" actionLabel="إضافة إعلان جديد" actionPath="/listings/new" />;
    }
    return (
      <div className="grid grid-cols-1 gap-6">
        {listings.map((item) => {
          const freshness = getFreshnessInfo(item.createdAt);
          return (
            <ManagementCard
              key={item.id}
              item={{
                id: item.id,
                title: item.title,
                type: 'listing',
                status: freshness.label === 'قديم' ? 'stale' : item.status === 'active' ? 'active' : 'closed',
                createdAt: new Date(item.createdAt).toLocaleDateString('ar-TN'),
                views: 0,
                engagement: 0,
                image: item.image
              }}
            />
          );
        })}
      </div>
    );
  }

  if (activeTab === 'requests') {
    const requests = await getUserRequests(userId);
    if (requests.length === 0) {
      return <EmptyState label="ليس لديك طلبات شراء بعد" actionLabel="إضافة طلب شراء" actionPath="/purchase-requests/new" />;
    }
    return (
      <div className="grid grid-cols-1 gap-6">
        {requests.map((item) => (
          <ManagementCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              type: 'request',
              status: item.status === 'active' ? 'active' : 'closed',
              createdAt: new Date(item.createdAt).toLocaleDateString('ar-TN'),
              views: 0,
              engagement: 0,
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTab === 'posts') {
    const posts = await getUserPosts(userId);
    if (posts.length === 0) {
      return <EmptyState label="ليس لديك منشورات بعد" actionLabel="كتابة منشور جديد" actionPath="/posts/new" />;
    }
    return (
      <div className="grid grid-cols-1 gap-6">
        {posts.map((item) => (
          <ManagementCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              type: 'post',
              status: item.status === 'active' ? 'active' : 'closed',
              createdAt: new Date(item.createdAt).toLocaleDateString('ar-TN'),
              views: item.viewsCount,
              engagement: item.commentsCount,
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTab === 'saved') {
    const savedItems = await getUserSavedItems(userId);

    if (savedItems.length === 0) {
      return (
        <div className="py-20 flex flex-col items-center text-center space-y-6 border-2 border-dashed border-outline-variant/20 rounded-[3rem] bg-surface-container-lowest">
          <div className="w-20 h-20 bg-error/5 rounded-full flex items-center justify-center text-error/20">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-on-surface">قائمة المحفوظات فارغة</h3>
            <p className="text-sm font-medium text-on-surface-variant/60 italic">
              احفظ الإعلانات التي تهمك للعودة إليها لاحقاً.
            </p>
          </div>
          <Link href="/marketplace">
            <button className="px-8 py-3 bg-secondary text-on-secondary rounded-xl font-black text-xs shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
              استكشاف السوق
            </button>
          </Link>
        </div>
      );
    }

    // Fetch actual saved listings from DB
    const supabase = await createClient();
    const savedListingIds = savedItems
      .filter((s) => s.itemType === 'listing')
      .map((s) => s.itemId);

    const { data: savedListings } = savedListingIds.length > 0
      ? await supabase
          .from('listings')
          .select(`
            *,
            profiles:user_id(full_name),
            listing_images(storage_path, is_primary, sort_order),
            categories:category_id(name_ar, slug),
            units:unit_id(name_ar),
            governorates:governorate_id(name_ar)
          `)
          .in('id', savedListingIds)
      : { data: [] };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(savedListings || []).map((listing: any) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  }

  return null;
}
