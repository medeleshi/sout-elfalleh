import { createClient } from '@/lib/supabase/server';

export interface ConversationItem {
  id: string;
  sourceType: 'listing' | 'purchase_request' | 'direct';
  sourceId: string | null;
  createdAt: string;
  otherParticipant: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
  lastMessage: string | null;
  unreadCount: number;
  linkedItem: {
    id: string;
    title: string;
    type: string;
  } | null;
}

export interface MessageItem {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export async function getConversationsForUser(
  currentUserId: string
): Promise<ConversationItem[]> {
  const supabase = await createClient();

  // 1. Get all conversations + last_read_at for this user in one query
  const { data: participantRows } = await supabase
    .from('conversation_participants')
    .select('conversation_id, last_read_at')
    .eq('user_id', currentUserId);

  if (!participantRows || participantRows.length === 0) return [];

  const convIds = participantRows.map((r) => r.conversation_id);

  // 2. Fetch conversations — only columns that actually exist in schema
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, source_type, source_id, created_at')
    .in('id', convIds);

  if (!conversations || conversations.length === 0) return [];

  // 3. Batch: get all OTHER participants in one query (avoids N+1)
  const { data: allOtherParticipants } = await supabase
    .from('conversation_participants')
    .select('conversation_id, user_id')
    .in('conversation_id', convIds)
    .neq('user_id', currentUserId);

  // Map conversation_id → other user_id
  const otherUserByConvId: Record<string, string> = {};
  for (const p of allOtherParticipants ?? []) {
    if (!otherUserByConvId[p.conversation_id]) {
      otherUserByConvId[p.conversation_id] = p.user_id;
    }
  }

  // 4. Batch: fetch all other participants' profiles in one query
  const otherUserIds = [...new Set(Object.values(otherUserByConvId))];
  const profilesMap: Record<string, any> = {};
  if (otherUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .in('id', otherUserIds);
    for (const p of profiles ?? []) {
      profilesMap[p.id] = p;
    }
  }

  // 5. Batch: get last message per conversation
  //    Supabase doesn't support window functions directly, so we query each conv.
  //    For small conversation counts this is acceptable; for scale use a DB view.
  const lastMessages: Record<string, string | null> = {};
  for (const convId of convIds) {
    const { data: msg } = await supabase
      .from('messages')
      .select('content')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    lastMessages[convId] = msg?.content ?? null;
  }

  // 6. Batch: unread counts
  const unreadCounts: Record<string, number> = {};
  for (const row of participantRows) {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', row.conversation_id)
      .neq('sender_id', currentUserId)
      .gt('created_at', row.last_read_at);
    unreadCounts[row.conversation_id] = count ?? 0;
  }

  // 7. Resolve linked items (listings / purchase_requests) via source_id
  //    We collect ids by type, then batch fetch titles.
  const listingIds = conversations
    .filter((c) => c.source_type === 'listing' && c.source_id)
    .map((c) => c.source_id!);
  const requestIds = conversations
    .filter((c) => c.source_type === 'purchase_request' && c.source_id)
    .map((c) => c.source_id!);

  const listingTitles: Record<string, string> = {};
  const requestTitles: Record<string, string> = {};

  if (listingIds.length > 0) {
    const { data } = await supabase
      .from('listings')
      .select('id, title')
      .in('id', listingIds);
    for (const l of data ?? []) listingTitles[l.id] = l.title;
  }
  if (requestIds.length > 0) {
    const { data } = await supabase
      .from('purchase_requests')
      .select('id, title')
      .in('id', requestIds);
    for (const r of data ?? []) requestTitles[r.id] = r.title;
  }

  // 8. Assemble results, sort by most-recently-messaged
  const results: ConversationItem[] = conversations.map((conv) => {
    const otherUserId = otherUserByConvId[conv.id];
    const otherProfile = otherUserId ? profilesMap[otherUserId] ?? null : null;

    let linkedItem: ConversationItem['linkedItem'] = null;
    if (conv.source_type === 'listing' && conv.source_id && listingTitles[conv.source_id]) {
      linkedItem = { id: conv.source_id, title: listingTitles[conv.source_id], type: 'listing' };
    } else if (conv.source_type === 'purchase_request' && conv.source_id && requestTitles[conv.source_id]) {
      linkedItem = { id: conv.source_id, title: requestTitles[conv.source_id], type: 'purchase_request' };
    }

    return {
      id: conv.id,
      sourceType: conv.source_type as ConversationItem['sourceType'],
      sourceId: conv.source_id ?? null,
      createdAt: conv.created_at,
      otherParticipant: otherProfile,
      lastMessage: lastMessages[conv.id] ?? null,
      unreadCount: unreadCounts[conv.id] ?? 0,
      linkedItem,
    };
  });

  // Sort: conversations with recent messages first
  return results.sort((a, b) => {
    const aTime = a.lastMessage ? 1 : 0;
    const bTime = b.lastMessage ? 1 : 0;
    return bTime - aTime || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getMessagesForConversation(
  conversationId: string
): Promise<MessageItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select('id, content, sender_id, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return (data ?? []).map((m) => ({
    id: m.id,
    content: m.content,        // ← was 'body' — column is 'content'
    senderId: m.sender_id,
    createdAt: m.created_at,
  }));
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string            // ← was 'body' — schema field is 'content'
) {
  const supabase = await createClient();
  return supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,                   // ← was body
  });
}
