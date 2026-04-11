import { createClient } from '@/lib/supabase/server';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BaseFeedItem = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string;
  governorate_id: string;
  status: 'draft' | 'active' | 'inactive' | 'archived' | 'sold' | 'hidden' | 'fulfilled';
  created_at: string;
  updated_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  governorates: { name_ar: string | null } | null;
  categories: { name_ar: string; slug: string } | null;
};

export type ListingItem = BaseFeedItem & {
  type: 'listing';
  price: number | null;
  quantity: number;
  unit_id: string;
  units: { name_ar: string } | null;
  listing_images: { storage_path: string; is_primary: boolean; sort_order: number }[];
};

export type PurchaseRequestItem = BaseFeedItem & {
  type: 'purchase_request';
  quantity: number;           // ← was 'requested_quantity' — schema column is 'quantity'
  unit_id: string;
  units: { name_ar: string } | null;
  budget: number | null;
};

export type PostItem = {
  id: string;
  author_id: string;
  type: 'post';
  post_type: 'question' | 'discussion';
  title: string;
  content: string;
  category_id: string | null;
  status: 'draft' | 'active' | 'inactive' | 'archived' | 'sold' | 'hidden' | 'fulfilled';
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  categories: { name_ar: string; slug: string } | null;
};

export type FeedItem = ListingItem | PurchaseRequestItem | PostItem;

export interface FeedFilters {
  category_id?: string | null;
  governorate_id?: string | null;
  type?: 'listing' | 'purchase_request' | 'post' | null;
  limit?: number;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

export async function getFeedItems(filters: FeedFilters = {}): Promise<FeedItem[]> {
  const { category_id, governorate_id, type, limit = 20 } = filters;
  const supabase = await createClient();

  const listings: ListingItem[]          = [];
  const requests: PurchaseRequestItem[]  = [];
  const posts: PostItem[]                = [];

  // ── 1. Listings ──────────────────────────────────────────────────────────
  if (!type || type === 'listing') {
    let query = supabase
      .from('listings')
      .select(`
        *,
        profiles:user_id(full_name, avatar_url),
        governorates:governorate_id(name_ar),
        categories:category_id(name_ar, slug),
        units:unit_id(name_ar),
        listing_images(storage_path, is_primary, sort_order)
      `)
      .eq('status', 'active');

    if (category_id)    query = query.eq('category_id', category_id);
    if (governorate_id) query = query.eq('governorate_id', governorate_id);

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) console.error('[FEED] listings error:', error.message);

    for (const l of data ?? []) {
      listings.push({ ...(l as any), type: 'listing' });
    }
  }

  // ── 2. Purchase Requests ─────────────────────────────────────────────────
  if (!type || type === 'purchase_request') {
    let query = supabase
      .from('purchase_requests')
      .select(`
        *,
        profiles:user_id(full_name, avatar_url),
        governorates:governorate_id(name_ar),
        categories:category_id(name_ar, slug),
        units:unit_id(name_ar)
      `)
      .eq('status', 'active');

    if (category_id)    query = query.eq('category_id', category_id);
    if (governorate_id) query = query.eq('governorate_id', governorate_id);

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) console.error('[FEED] purchase_requests error:', error.message);

    for (const r of data ?? []) {
      requests.push({ ...(r as any), type: 'purchase_request' });
    }
  }

  // ── 3. Posts ─────────────────────────────────────────────────────────────
  if (!type || type === 'post') {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id(full_name, avatar_url),
        categories:category_id(name_ar, slug)
      `)
      .eq('status', 'active');   // ← was missing — exposed hidden/draft posts

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) console.error('[FEED] posts error:', error.message);

    for (const p of data ?? []) {
      posts.push({
        ...(p as any),
        type: 'post',
        post_type: (p as any).type as 'question' | 'discussion',
      });
    }
  }

  // ── 4. Merge and sort by created_at DESC ──────────────────────────────────
  const combined: FeedItem[] = [...listings, ...requests, ...posts];

  return combined
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
