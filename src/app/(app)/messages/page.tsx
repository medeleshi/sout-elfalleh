'use client';

import React, { useState } from 'react';
import { ConversationsListPanel } from '@/components/messaging/ConversationsListPanel';
import { ActiveChatWindow } from '@/components/messaging/ActiveChatWindow';
import { ContextPanel } from '@/components/messaging/ContextPanel';

// --- MOCK DATA ---
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    user: { name: 'سليم بن خليفة', role: 'فلاح منتج', isVerified: true, avatar: null },
    lastMessage: 'هل يمكننا الاتفاق على موعد للنقل؟',
    time: 'منذ 5 د',
    unread: true,
    status: 'new' as const, 
    linkedItem: { id: '1', title: 'بطاطا جندوبة الممتازة', category: 'خضروات', price: '1.200 د.ت' }
  },
  {
    id: 'c2',
    user: { name: 'الهادي الماجري', role: 'تاجر جملة', isVerified: false, avatar: null },
    lastMessage: 'شكراً لك، سأقوم بالتأكيد غداً.',
    time: 'منذ ساعتين',
    unread: false,
    status: 'replied' as const,
    linkedItem: { id: '2', title: 'طماطم فصلية', category: 'خضروات', price: '0.900 د.ت' }
  }
];

const MOCK_MESSAGES = [
  { id: 'm1', text: 'السلام عليكم، هل البطاطا لا تزال متوفرة؟', sender: 'me' as const, time: '10:30 ص' },
  { id: 'm2', text: 'وعليكم السلام، نعم متوفرة حوالي 500 كغ حالياً.', sender: 'them' as const, time: '10:32 ص' },
  { id: 'm3', text: 'ممتاز، أحتاج 200 كغ للتوصيل لتونس العاصمة.', sender: 'me' as const, time: '10:35 ص' },
  { id: 'm4', text: 'هل يمكننا الاتفاق على موعد للنقل؟', sender: 'them' as const, time: '10:40 ص' },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState('c1');
  const [showContext, setShowContext] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');

  const activeConv = MOCK_CONVERSATIONS.find(c => c.id === selectedId) || MOCK_CONVERSATIONS[0];

  return (
    <div className="fixed top-20 bottom-16 inset-x-0 lg:static z-[45] flex flex-col bg-surface-container-lowest overflow-hidden lg:px-8 lg:py-6" dir="rtl">
      <div className="flex-1 flex overflow-hidden lg:rounded-[3rem] lg:border-2 lg:border-outline-variant/30 lg:shadow-2xl lg:bg-white relative">
        
        {/* PANEL 1: Conversations List */}
        <ConversationsListPanel 
          conversations={MOCK_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); setView('chat'); }}
          isHiddenOnMobile={view === 'chat'}
        />

        {/* PANEL 2: Active Chat Window */}
        <ActiveChatWindow 
          conversation={activeConv}
          messages={MOCK_MESSAGES}
          onBack={() => setView('list')}
          onToggleContext={() => setShowContext(true)}
          onSendMessage={(text) => console.log('Sending:', text)}
          isHiddenOnMobile={view === 'list'}
        />

        {/* PANEL 3: Context Sidebar */}
        <ContextPanel 
          isOpen={showContext}
          onClose={() => setShowContext(false)}
          user={activeConv.user}
          linkedItem={activeConv.linkedItem}
        />
      </div>

      {/* Navigation Spacer for Mobile - ensuring it doesn't overlap the fixed composer if needed */}
      <div className="h-[env(safe-area-inset-bottom)] lg:hidden shrink-0" />
    </div>
  );
}
