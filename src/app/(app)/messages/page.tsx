// src/app/(app)/messages/page.tsx
import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { getConversationsForUser } from '@/lib/data/get-conversations';
import { MessagesClient } from '@/components/messaging/MessagesClient';
import { MessageSquare } from 'lucide-react';

export default async function MessagesPage() {
  const profileData = await getCurrentProfile();
  if (!profileData?.user) {
    return null;
  }

  const conversations = await getConversationsForUser(profileData.user.id);

  // Shape data to match the existing ConversationsListPanel interface
  const shapedConversations = conversations.map((conv) => ({
    id: conv.id,
    user: {
      name: conv.otherParticipant?.full_name || 'عضو نشط',
      role: conv.otherParticipant?.role || 'عضو',
      isVerified: true,
      avatar: conv.otherParticipant?.avatar_url || null,
    },
    lastMessage: conv.lastMessage || 'ابدأ المحادثة...',
    time: conv.lastMessageAt
      ? new Date(conv.lastMessageAt).toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' })
      : '',
    unread: conv.unreadCount > 0,
    status: (conv.unreadCount > 0 ? 'new' : 'replied') as 'new' | 'replied',
    linkedItem: conv.linkedItem
      ? {
          id: conv.linkedItem.id,
          title: conv.linkedItem.title,
          category: conv.linkedItem.type === 'listing' ? 'عرض بيع' : 'طلب شراء',
          price: '',
        }
      : { id: '', title: 'محادثة مباشرة', category: '', price: '' },
  }));

  if (shapedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-8 text-center px-4" dir="rtl">
        <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center text-on-surface-variant/20">
          <MessageSquare className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-on-surface">لا توجد محادثات بعد</h2>
          <p className="text-sm text-on-surface-variant/60 font-medium italic max-w-sm">
            حين تتواصل مع بائع أو مشتري، ستظهر محادثتك هنا مباشرة.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MessagesClient
      conversations={shapedConversations}
      currentUserId={profileData.user.id}
    />
  );
}
