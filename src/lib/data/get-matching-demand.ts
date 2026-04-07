import { createClient } from "@/lib/supabase/server";
import { type Tables } from "@/types/database";

export async function getMatchingDemand(userId: string, categoryId?: string, governorateId?: string, limit = 4) {
  const supabase = await createClient();

  let query = supabase
    .from('purchase_requests')
    .select(`
      *,
      profiles:user_id(full_name, avatar_url),
      governorates:governorate_id(name_ar),
      categories:category_id(name_ar, slug),
      units:unit_id(name_ar)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  // If we have a category, prioritize it
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // If we have a governorate, prioritize it
  if (governorateId) {
    query = query.eq('governorate_id', governorateId);
  }

  const { data, error } = await query.limit(limit);

  if (error) {
    console.error('Error fetching matching demand:', error);
    return [];
  }

  return (data || []).map(item => ({
    ...(item as any),
    type: 'purchase_request' as const,
    category: (item as any).categories?.name_ar || 'أخرى',
    unit: (item as any).units?.name_ar || '',
    location: (item as any).governorates?.name_ar || 'تونس',
    publisher: (item as any).profiles?.full_name || 'مشتري',
  }));
}
