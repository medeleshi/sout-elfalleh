'use client';

import React, { useState } from 'react';
import { Sparkles, X, ChevronUp } from 'lucide-react';

interface MobileSupportDrawerProps {
  children: React.ReactNode;
}

export default function MobileSupportDrawer({ children }: MobileSupportDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Mobile Trigger Button (Floating or Inline) */}
      <div className="lg:hidden fixed bottom-6 left-6 z-[60]">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-primary text-on-primary rounded-full shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-black">أدوات المنطقة</span>
          <ChevronUp className="w-4 h-4 opacity-60" />
        </button>
      </div>

      {/* 2. Bottom Sheet Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center lg:hidden animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sheet Body */}
          <div className="relative w-full bg-surface rounded-t-[3rem] shadow-2xl p-6 pt-2 h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-500 flex flex-col">
            {/* Grabber Handle */}
            <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full mx-auto my-4 shrink-0" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-primary">استكشف منطقتك</h2>
                <p className="text-xs text-muted-foreground font-medium">نصائح وتجار السوق المحلي حولك</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content (Passed Children) */}
            <div className="flex-1 space-y-8 pb-10 overflow-y-auto pr-1">
              {children}
            </div>

            {/* Static Action (Optional) */}
            <div className="pt-4 border-t border-outline-variant/10 shrink-0">
               <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-surface-container-highest text-on-surface-variant rounded-2xl font-black text-sm"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
