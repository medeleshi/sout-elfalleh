// src/lib/data/get-conversations.ts
import { createClient } from '@/lib/supabase/server';

export interface ConversationItem {
  id: string;
  sourceType: string;
  lastMessageAt: string | null;
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
  body: string;
  senderId: string;
  createdAt: string;
}

export async function getConversationsForUser(currentUserId: string): Promise<ConversationItem[]> {
  const supabase = await createClient();

  // 1. Get all conversation IDs this user participates in
  const { data: participantRows } = await supabase
    .from('conversation_participants')
    .select('conversation_id, last_read_at')
    .eq('user_id', currentUserId);

  if (!participantRows || participantRows.length === 0) return [];

  const convIds = participantRows.map((r: any) => r.conversation_id);

  // 2. Fetch conversations with their linked items
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, source_type, last_message_at, created_at,
      listings:listing_id(id, title),
      purchase_requests:purchase_request_id(id, title)
    `)
    .in('id', convIds)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (!conversations) return [];

  // 3. For each conv, get the OTHER participant's profile
  const results: ConversationItem[] = [];

  for (const conv of conversations as any[]) {
    // Get other participants
    const { data: allParticipants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conv.id)
      .neq('user_id', currentUserId)
      .limit(1);

    const otherUserId = (allParticipants as any[])?.[0]?.user_id;
    let otherProfile = null;

    if (otherUserId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .eq('id', otherUserId)
        .single();
      otherProfile = profile;
    }

    // Get last message
    const { data: lastMsgRow } = await supabase
      .from('messages')
      .select('body, created_at, sender_id')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get unread count (messages after last_read_at of current user)
    const myParticipant = (participantRows as any[])?.find((r: any) => r.conversation_id === conv.id);
    const lastRead = myParticipant?.last_read_at;

    let unreadCount = 0;
    if (lastRead) {
      const { count } = await (supabase
        .from('messages')
        .select('*', { count: 'exact', head: true }) as any)
        .eq('conversation_id', conv.id)
        .neq('sender_id', currentUserId)
        .gt('created_at', lastRead);
      unreadCount = count || 0;
    } else {
      const { count } = await (supabase
        .from('messages')
        .select('*', { count: 'exact', head: true }) as any)
        .eq('conversation_id', conv.id)
        .neq('sender_id', currentUserId);
      unreadCount = count || 0;
    }

    results.push({
      id: conv.id,
      sourceType: conv.source_type,
      lastMessageAt: conv.last_message_at,
      createdAt: conv.created_at,
      otherParticipant: otherProfile,
      lastMessage: (lastMsgRow as any)?.body || null,
      unreadCount,
      linkedItem: conv.listings
        ? { id: conv.listings.id, title: conv.listings.title, type: 'listing' }
        : conv.purchase_requests
        ? { id: conv.purchase_requests.id, title: conv.purchase_requests.title, type: 'purchase_request' }
        : null,
    });
  }

  return results;
}

export async function getMessagesForConversation(conversationId: string): Promise<MessageItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select('id, body, sender_id, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return (data || []).map((m: any) => ({
    id: m.id,
    body: m.body,
    senderId: m.sender_id,
    createdAt: m.created_at,
  }));
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const supabase = await createClient();
  return supabase
    .from('messages' as any)
    .insert({ conversation_id: conversationId, sender_id: senderId, body } as any);
}
