// src/lib/data/get-user-activity.ts
import { createClient } from '@/lib/supabase/server';

export interface ActivityListing {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  views: number;
  category: string;
  price: number | null;
  unit: string | null;
  image?: string;
  listing_images?: { storage_path: string }[];
}

export interface ActivityRequest {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  category: string;
  budget: number | null;
  unit: string | null;
}

export interface ActivityPost {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  category: string | null;
}

export interface ActivitySavedItem {
  id: string;
  itemType: string;
  itemId: string;
  createdAt: string;
}

export async function getUserListings(userId: string, publicOnly: boolean = false): Promise<ActivityListing[]> {
  const supabase = await createClient();
  let query = supabase
    .from('listings')
    .select('*, listing_images(storage_path)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (publicOnly) {
    query = query.eq('status', 'active');
  } else {
    query = query.neq('status', 'archived');
  }

  const { data } = await query;
  return (data || []).map((l: any) => {
    const storagePath = l.listing_images?.[0]?.storage_path;
    const imageUrl = storagePath 
      ? supabase.storage.from('listings').getPublicUrl(storagePath).data.publicUrl
      : undefined;

    return {
      id: l.id,
      title: l.title,
      status: l.status,
      createdAt: l.created_at,
      views: 0,
      category: l.category,
      price: l.price,
      unit: l.unit,
      image: imageUrl,
      listing_images: l.listing_images || []
    };
  });
}

export async function getUserRequests(userId: string): Promise<ActivityRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('purchase_requests')
    .select('id, title, status, created_at, category, budget, unit')
    .eq('user_id', userId)
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  return (data || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    createdAt: r.created_at,
    category: r.category,
    budget: r.budget,
    unit: r.unit,
  }));
}

export async function getUserPosts(userId: string): Promise<ActivityPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, type, status, created_at, views_count, comments_count, likes_count, category')
    .eq('author_id', userId)
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  return (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    status: p.status,
    createdAt: p.created_at,
    viewsCount: p.views_count,
    commentsCount: p.comments_count,
    likesCount: p.likes_count,
    category: p.category,
  }));
}

export async function getUserSavedItems(userId: string): Promise<ActivitySavedItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('saved_items')
    .select('id, item_type, item_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data || []).map((s: any) => ({
    id: s.id,
    itemType: s.item_type,
    itemId: s.item_id,
    createdAt: s.created_at,
  }));
}
