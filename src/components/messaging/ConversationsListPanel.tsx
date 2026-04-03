'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { ConversationListItem } from './ConversationListItem';
import { ConversationStatus } from './StatusChip';

interface User {
  name: string;
  role: string;
  isVerified: boolean;
  avatar: string | null;
}

interface LinkedItem {
  title: string;
  category: string;
  price: string;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unread: boolean;
  status: ConversationStatus;
  linkedItem: LinkedItem;
}

interface ConversationsListPanelProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  isHiddenOnMobile?: boolean;
}

export function ConversationsListPanel({
  conversations,
  selectedId,
  onSelect,
  isHiddenOnMobile
}: ConversationsListPanelProps) {
  return (
    <div className={`
      w-full lg:w-[380px] flex flex-col border-l border-outline-variant/20 bg-white shrink-0 h-full overflow-hidden
      ${isHiddenOnMobile ? 'hidden lg:flex' : 'flex'}
    `}>
      {/* Inbox Header - Dedicated feel on mobile */}
      <div className="p-5 lg:p-6 space-y-5 lg:space-y-6 shrink-0 bg-white z-10 border-b lg:border-b-0 border-outline-variant/10">
        <div className="flex items-center justify-between px-1 lg:px-0">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-black text-on-surface italic font-serif leading-none">المحادثات</h1>
            <p className="lg:hidden text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">صندوق الوارد</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[9px] lg:text-[10px] font-black text-primary uppercase tracking-widest leading-none">مباشر</span>
          </div>
        </div>
        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="ابحث في الرسائل..." 
            className="w-full h-11 lg:h-12 pr-11 lg:pr-12 pl-4 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-xl lg:rounded-2xl text-[13px] lg:text-sm font-medium outline-none transition-all placeholder:text-on-surface-variant/30 shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 lg:px-3 space-y-0.5 lg:space-y-1 pb-24">
        {conversations.map(conv => (
          <ConversationListItem 
            key={conv.id}
            id={conv.id}
            user={conv.user}
            lastMessage={conv.lastMessage}
            time={conv.time}
            unread={conv.unread}
            status={conv.status}
            linkedItemTitle={conv.linkedItem.title}
            isSelected={selectedId === conv.id}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
