'use client';

import React from 'react';
import { CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  text: string;
  sender: 'me' | 'them';
  time: string;
  isRead?: boolean;
}

export function MessageBubble({ text, sender, time, isRead }: MessageBubbleProps) {
  return (
    <div className={`flex w-full ${sender === 'me' ? 'justify-start' : 'justify-end'}`}>
      <div className={`
        max-w-[85%] lg:max-w-[70%] space-y-2
        ${sender === 'me' ? 'items-start' : 'items-end flex flex-col'}
      `}>
        <div className={`
           p-4 lg:p-5 rounded-[1.5rem] lg:rounded-[2rem] text-[13px] lg:text-base font-medium leading-relaxed shadow-sm
           ${sender === 'me' 
             ? 'bg-primary text-on-primary rounded-tr-none' 
             : 'bg-white border-2 border-outline-variant/20 text-on-surface rounded-tl-none pr-7 lg:pr-8 relative'}
        `}>
           {sender === 'them' && (
             <div className="absolute right-3 top-5 w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
             </div>
           )}
           {text}
        </div>
        <div className="flex items-center gap-2 px-2">
           <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-tighter">{time}</span>
           {sender === 'me' && <CheckCheck className={`w-3.5 h-3.5 ${isRead ? 'text-primary' : 'text-on-surface-variant/20'}`} />}
        </div>
      </div>
    </div>
  );
}
