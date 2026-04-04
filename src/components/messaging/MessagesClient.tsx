'use client';

import React, { useState } from 'react';
import { ConversationsListPanel } from './ConversationsListPanel';
import { ActiveChatWindow } from './ActiveChatWindow';
import { ContextPanel } from './ContextPanel';

interface MessagesClientProps {
  conversations: any[];
  currentUserId: string;
}

export function MessagesClient({ conversations, currentUserId }: MessagesClientProps) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || '');
  const [showContext, setShowContext] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [localMessages, setLocalMessages] = useState<any[]>([]);

  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSend = (text: string) => {
    // Optimistic update — real persistence happens via server action later
    setLocalMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, text, sender: 'me' as const, time: new Date().toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' }) },
    ]);
  };

  // Transform conversation messages to the format ActiveChatWindow expects
  const displayMessages = localMessages;

  return (
    <div className="fixed top-20 bottom-16 inset-x-0 lg:static z-[45] flex flex-col bg-surface-container-lowest overflow-hidden lg:px-8 lg:py-6" dir="rtl">
      <div className="flex-1 flex overflow-hidden lg:rounded-[3rem] lg:border-2 lg:border-outline-variant/30 lg:shadow-2xl lg:bg-white relative">

        {/* PANEL 1: Conversations List */}
        <ConversationsListPanel
          conversations={conversations}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); setView('chat'); setLocalMessages([]); }}
          isHiddenOnMobile={view === 'chat'}
        />

        {/* PANEL 2: Active Chat Window */}
        <ActiveChatWindow
          conversation={activeConv}
          messages={displayMessages}
          onBack={() => setView('list')}
          onToggleContext={() => setShowContext(true)}
          onSendMessage={handleSend}
          isHiddenOnMobile={view === 'list'}
        />

        {/* PANEL 3: Context Sidebar */}
        <ContextPanel
          isOpen={showContext}
          onClose={() => setShowContext(false)}
          user={activeConv?.user}
          linkedItem={activeConv?.linkedItem}
        />
      </div>

      <div className="h-[env(safe-area-inset-bottom)] lg:hidden shrink-0" />
    </div>
  );
}
