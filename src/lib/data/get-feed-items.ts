import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/types/database";

export type BaseFeedItem = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  governorate_id: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  governorates: { name_ar: string | null } | null;
};

export type ListingItem = BaseFeedItem & {
  type: 'listing';
  price: number | null;
  is_price_negotiable: boolean;
  quantity: number | null;
  unit: string | null;
  listing_images: { storage_path: string }[];
};

export type PurchaseRequestItem = BaseFeedItem & {
  type: 'purchase_request';
  requested_quantity: number | null;
  unit: string | null;
  budget: number | null;
};

export type FeedItem = ListingItem | PurchaseRequestItem;

export async function getFeedItems(limit = 20): Promise<FeedItem[]> {
  const supabase = await createClient();

  // 1. Fetch Listings
  const { data: listings, error: listingsError } = await (supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id(full_name, avatar_url),
      governorates:governorate_id(name_ar),
      listing_images(storage_path)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)) as { data: any[] | null; error: any };

  if (listingsError) {
    console.error('Error fetching listings for feed:', listingsError);
  }

  // 2. Fetch Purchase Requests
  const { data: requests, error: requestsError } = await (supabase
    .from('purchase_requests')
    .select(`
      *,
      profiles:user_id(full_name, avatar_url),
      governorates:desired_governorate_id(name_ar)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)) as { data: any[] | null; error: any };

  if (requestsError) {
    console.error('Error fetching purchase requests for feed:', requestsError);
  }

  // 3. Combine and Sort
  const combined: FeedItem[] = [
    ...(listings?.map(l => ({ ...l, type: 'listing' as const })) || []),
    ...(requests?.map(r => ({ ...r, type: 'purchase_request' as const })) || [])
  ];

  // Sort by created_at DESC
  return combined.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, limit);
}
