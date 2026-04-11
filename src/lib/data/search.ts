import { createClient } from '@/lib/supabase/server';

export interface SearchResults {
  listings: any[];
  requests: any[];
  profiles: any[];
  posts: any[];
}

export async function searchAll(query: string, type: string): Promise<SearchResults> {
  const supabase = await createClient();
  const term = `%${query}%`;
  const isAll = type === 'all';

  const results: SearchResults = { listings: [], requests: [], profiles: [], posts: [] };

  // ── Listings ──────────────────────────────────────────────────────────────
  if (isAll || type === 'listings') {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        id, title, price, quantity, status, created_at,
        profiles:user_id(full_name),
        categories:category_id(name_ar),
        units:unit_id(name_ar),
        governorates:governorate_id(name_ar)
      `)
      .eq('status', 'active')
      .or(query ? `title.ilike.${term},description.ilike.${term}` : 'status.eq.active')
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) console.error('[SEARCH] listings:', error.message);

    results.listings = (data ?? []).map((l: any) => ({
      id: l.id,
      title: l.title,
      category: l.categories?.name_ar ?? 'أخرى',
      price: l.price,
      quantity: l.quantity,
      unit: l.units?.name_ar ?? '',
      location: l.governorates?.name_ar ?? 'تونس',
      publisher: l.profiles?.full_name ?? 'عضو نشط',
      createdAt: l.created_at,
    }));
  }

  // ── Purchase Requests ─────────────────────────────────────────────────────
  if (isAll || type === 'requests') {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select(`
        id, title, quantity, budget, status, created_at,
        profiles:user_id(full_name),
        categories:category_id(name_ar),
        units:unit_id(name_ar),
        governorates:governorate_id(name_ar)
      `)                           // ← was 'requested_quantity' — column is 'quantity'
      .eq('status', 'active')
      .or(query ? `title.ilike.${term},description.ilike.${term}` : 'status.eq.active')
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) console.error('[SEARCH] requests:', error.message);

    results.requests = (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.categories?.name_ar ?? 'أخرى',
      quantity: r.quantity,        // ← was r.requested_quantity
      unit: r.units?.name_ar ?? '',
      budget: r.budget,
      location: r.governorates?.name_ar ?? 'تونس',
      publisher: r.profiles?.full_name ?? 'عضو نشط',
      createdAt: r.created_at,
    }));
  }

  // ── Profiles ──────────────────────────────────────────────────────────────
  if (isAll || type === 'profiles') {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, full_name, role, avatar_url,
        governorates:governorate_id(name_ar)
      `)
      .eq('is_onboarding_completed', true)
      .ilike(query ? 'full_name' : 'role', query ? term : '%')
      .limit(8);

    if (error) console.error('[SEARCH] profiles:', error.message);

    results.profiles = (data ?? []).map((p: any) => ({
      id: p.id,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      role: p.role,
      location: p.governorates?.name_ar ?? 'تونس',
    }));
  }

  // ── Posts ─────────────────────────────────────────────────────────────────
  if (isAll || type === 'posts') {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, title, content, type, status, created_at,
        profiles:author_id(full_name),
        categories:category_id(name_ar)
      `)
      .eq('status', 'active')
      .or(query ? `title.ilike.${term},content.ilike.${term}` : 'status.eq.active')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) console.error('[SEARCH] posts:', error.message);

    results.posts = (data ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      type: p.type ?? 'discussion',
      author: p.profiles?.full_name ?? 'عضو نشط',
      createdAt: p.created_at,
    }));
  }

  return results;
}
