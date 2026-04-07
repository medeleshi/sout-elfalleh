import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/types/database";

export type BaseFeedItem = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string;
  governorate_id: string;
  status: 'draft' | 'active' | 'inactive' | 'archived' | 'sold' | 'hidden';
  created_at: string;
  updated_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  governorates: { name_ar: string | null } | null;
  categories: { name_ar: string; slug: string } | null;
};

export type ListingItem = BaseFeedItem & {
  type: 'listing';
  price: number | null;
  is_price_negotiable: boolean;
  quantity: number | null;
  unit_id: string | null;
  units: { name_ar: string } | null;
  listing_images: { storage_path: string }[];
};

export type PurchaseRequestItem = BaseFeedItem & {
  type: 'purchase_request';
  requested_quantity: number | null;
  unit_id: string | null;
  units: { name_ar: string } | null;
  budget: number | null;
};

export type PostItem = BaseFeedItem & {
  type: 'post';
  content: string;
  post_type: 'question' | 'discussion';
};

export type FeedItem = ListingItem | PurchaseRequestItem | PostItem;

export interface FeedFilters {
  category_id?: string | null;
  governorate_id?: string | null;
  type?: 'listing' | 'purchase_request' | 'post' | null;
  limit?: number;
}

export async function getFeedItems(filters: FeedFilters = {}): Promise<FeedItem[]> {
  const { category_id, governorate_id, type, limit = 20 } = filters;
  const supabase = await createClient();

  let listings: any[] = [];
  let requests: any[] = [];
  let posts: any[] = [];

  // 1. Fetch Listings
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

    if (category_id) query = query.eq('category_id', category_id);
    if (governorate_id) query = query.eq('governorate_id', governorate_id);

    const { data, error } = await (query.order('created_at', { ascending: false }).limit(limit)) as { data: any[] | null; error: any };
    if (error) console.error('Error fetching listings for feed:', error);
    listings = data || [];
  }

  // 2. Fetch Purchase Requests
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

    if (category_id) query = query.eq('category_id', category_id);
    if (governorate_id) query = query.eq('governorate_id', governorate_id);

    const { data, error } = await (query.order('created_at', { ascending: false }).limit(limit)) as { data: any[] | null; error: any };
    if (error) console.error('Error fetching purchase requests for feed:', error);
    requests = data || [];
  }

  // 3. Fetch Posts
  if (!type || type === 'post') {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id(full_name, avatar_url)
      `);

    // Posts don't strictly have category/governorate in this schema yet, but we'll leave it for now
    
    const { data, error } = await (query.order('created_at', { ascending: false }).limit(limit)) as { data: any[] | null; error: any };
    if (error) console.error('Error fetching posts for feed:', error);
    posts = data || [];
  }

  // 4. Combine and Sort
  const combined: FeedItem[] = [
    ...listings.map(l => ({ 
      ...l, 
      type: 'listing' as const,
    })),
    ...requests.map(r => ({ 
      ...r, 
      type: 'purchase_request' as const,
    })),
    ...posts.map(p => ({ 
      ...p, 
      type: 'post' as const, 
      post_type: p.type as 'question' | 'discussion',
      governorate_id: '', 
      governorates: null,
      categories: null,
      status: 'active' as const
    }))
  ];

  // Sort by created_at DESC
  return combined.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, limit);
}
