'use client';

import React from 'react';

export type ConversationStatus = 'new' | 'active' | 'replied' | 'awaiting_response' | 'archived' | 'blocked';

interface StatusChipProps {
  status: ConversationStatus;
}

const STATUS_MAP: Record<ConversationStatus, { label: string, color: string }> = {
  new: { label: 'جديد', color: 'bg-primary text-on-primary' },
  active: { label: 'نشط', color: 'bg-success/10 text-success border-success/20' },
  replied: { label: 'تم الرد', color: 'bg-surface-container-low text-on-surface-variant/60 border-outline-variant/30' },
  awaiting_response: { label: 'في انتظار الرد', color: 'bg-secondary/10 text-secondary border-secondary/20' },
  archived: { label: 'مؤرشف', color: 'bg-outline-variant/10 text-on-surface-variant/40' },
  blocked: { label: 'محظور', color: 'bg-error/10 text-error border-error/20' }
};

export function StatusChip({ status }: StatusChipProps) {
  const config = STATUS_MAP[status];
  
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${config.color}`}>
      {config.label}
    </span>
  );
}
