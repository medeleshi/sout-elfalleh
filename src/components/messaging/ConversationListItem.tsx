'use client';

import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { StatusChip, ConversationStatus } from './StatusChip';

interface ConversationListItemProps {
  id: string;
  user: {
    name: string;
    role: string;
    isVerified: boolean;
  };
  lastMessage: string;
  time: string;
  unread: boolean;
  status: ConversationStatus;
  linkedItemTitle: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function ConversationListItem({
  id,
  user,
  lastMessage,
  time,
  unread,
  status,
  linkedItemTitle,
  isSelected,
  onClick
}: ConversationListItemProps) {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`
        p-3 lg:p-4 rounded-[1.5rem] lg:rounded-[2rem] cursor-pointer transition-all flex items-center lg:items-start gap-3 lg:gap-4 h-20 lg:h-28 relative border-2
        ${isSelected ? 'bg-primary/5 border-primary/10 shadow-sm' : 'hover:bg-surface-container-low border-transparent'}
      `}
    >
      <div className="w-12 h-12 lg:w-14 lg:h-14 bg-surface-container-low rounded-xl lg:rounded-2xl shrink-0 flex items-center justify-center text-on-surface-variant/40 border border-outline-variant/20 relative overflow-hidden">
        <User className="w-6 h-6 lg:w-8 lg:h-8" />
        {user.isVerified && (
          <div className="absolute bottom-0 right-0 p-0.5 bg-primary text-on-primary rounded-tl-lg lg:rounded-tl-xl border-t border-l border-white/20">
            <ShieldCheck className="w-2.5 h-2.5 lg:w-3 h-3" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-0.5 lg:space-y-1 py-0.5 lg:py-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-[13px] lg:text-sm font-black truncate ${unread ? 'text-on-surface' : 'text-on-surface-variant/80'}`}>{user.name}</h3>
          <span className="text-[9px] lg:text-[10px] font-black text-on-surface-variant/30 uppercase tracking-tighter shrink-0">{time}</span>
        </div>
        <p className={`text-[11px] lg:text-xs truncate ${unread ? 'font-black text-on-surface' : 'font-medium text-on-surface-variant/60'}`}>{lastMessage}</p>
        <div className="flex items-center gap-1.5 lg:gap-2 pt-1 lg:pt-2 overflow-hidden">
          <div className="px-1.5 lg:px-2 py-0.5 bg-surface-container-low border border-outline-variant/30 rounded-md text-[8px] lg:text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest truncate max-w-[80px] lg:max-w-[120px]">
            {linkedItemTitle}
          </div>
          <div className="scale-75 lg:scale-100 origin-right">
            <StatusChip status={status} />
          </div>
          {unread && status === 'new' && <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-primary rounded-full animate-pulse shrink-0" />}
        </div>
      </div>
    </div>
  );
}
