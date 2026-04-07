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
    .select(`
      *,
      listing_images(storage_path, is_primary, sort_order),
      categories:category_id(name_ar),
      units:unit_id(name_ar),
      governorates:governorate_id(name_ar)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (publicOnly) {
    query = query.eq('status', 'active');
  } else {
    query = query.neq('status', 'archived');
  }

  const { data } = await query;
  return (data || []).map((l: any) => {
    // Sort images: primary first, then by sort_order
    const sortedImages = [...(l.listing_images || [])].sort((a: any, b: any) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
    const storagePath = sortedImages[0]?.storage_path;
    const imageUrl = storagePath
      ? supabase.storage.from('listings').getPublicUrl(storagePath).data.publicUrl
      : undefined;

    return {
      id: l.id,
      title: l.title,
      status: l.status,
      createdAt: l.created_at,
      views: 0,
      category: l.categories?.name_ar || 'أخرى',
      price: l.price,
      unit: l.units?.name_ar || '',
      image: imageUrl,
      listing_images: sortedImages,
      // Relational joins for ListingCard compatibility
      categories: l.categories,
      units: l.units,
      governorates: l.governorates,
    };
  });
}

export async function getUserRequests(userId: string): Promise<ActivityRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('purchase_requests')
    .select(`
      id, title, status, created_at, budget,
      categories:category_id(name_ar),
      units:unit_id(name_ar)
    `)
    .eq('user_id', userId)
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  return (data || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    createdAt: r.created_at,
    category: r.categories?.name_ar || 'أخرى',
    budget: r.budget,
    unit: r.units?.name_ar || '',
  }));
}

export async function getUserPosts(userId: string): Promise<ActivityPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts')
    .select(`
      id, title, status, created_at, view_count,
      categories:category_id(name_ar)
    `)
    .eq('author_id', userId)
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  return (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    type: (p as any).type || 'discussion',
    status: p.status,
    createdAt: p.created_at,
    viewsCount: p.view_count || 0,
    commentsCount: 0, // Should be fetched or joined if needed
    likesCount: 0,
    category: p.categories?.name_ar || 'أخرى',
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
