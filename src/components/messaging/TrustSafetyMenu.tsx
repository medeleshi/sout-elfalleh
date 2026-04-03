'use client';

import React from 'react';
import { MoreVertical, Archive, BellOff, Slash, AlertOctagon } from 'lucide-react';

interface TrustSafetyMenuProps {
  onArchive?: () => void;
  onMute?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}

export function TrustSafetyMenu({ onArchive, onMute, onBlock, onReport }: TrustSafetyMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-2xl text-on-surface-variant/40 hover:bg-surface-container-low hover:text-on-surface transition-all active:scale-95"
      >
        <MoreVertical className="w-6 h-6" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-outline-variant/30 rounded-[1.5rem] shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { onArchive?.(); setIsOpen(false); }}
              className="w-full text-right px-4 py-3 text-sm font-black text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center justify-between transition-colors"
            >
              <span>أرشفة</span>
              <Archive className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { onMute?.(); setIsOpen(false); }}
              className="w-full text-right px-4 py-3 text-sm font-black text-on-surface-variant hover:bg-surface-container-low rounded-xl flex items-center justify-between transition-colors"
            >
              <span>كتم التنبيهات</span>
              <BellOff className="w-4 h-4" />
            </button>
            <div className="h-px bg-outline-variant/10 my-1" />
            <button 
              onClick={() => { onBlock?.(); setIsOpen(false); }}
              className="w-full text-right px-4 py-3 text-sm font-black text-error hover:bg-error/5 rounded-xl flex items-center justify-between transition-colors"
            >
              <span>حظر المستخدم</span>
              <Slash className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { onReport?.(); setIsOpen(false); }}
              className="w-full text-right px-4 py-3 text-sm font-black text-error hover:bg-error/5 rounded-xl flex items-center justify-between transition-colors"
            >
              <span>إبلاغ</span>
              <AlertOctagon className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
