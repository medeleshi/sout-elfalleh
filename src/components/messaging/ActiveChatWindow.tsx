'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, User, ShieldCheck, Info, Clock, ShoppingBag } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { TrustSafetyMenu } from './TrustSafetyMenu';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

interface ActiveChatWindowProps {
  conversation: {
    user: {
      name: string;
      isVerified: boolean;
    };
    linkedItem: {
      id: string;
      title: string;
    };
  };
  messages: Message[];
  onBack?: () => void;
  onToggleContext?: () => void;
  onSendMessage: (text: string) => void;
  isHiddenOnMobile?: boolean;
}

export function ActiveChatWindow({
  conversation,
  messages,
  onBack,
  onToggleContext,
  onSendMessage,
  isHiddenOnMobile
}: ActiveChatWindowProps) {
  return (
    <div className={`
      flex-1 flex flex-col min-w-0 bg-surface-container-lowest overflow-hidden h-full
      ${isHiddenOnMobile ? 'hidden lg:flex' : 'flex'}
    `}>
      {/* Mobile Top Bar / Desktop Header */}
      <header className="flex-none bg-white border-b border-outline-variant/10 z-30 shadow-sm lg:shadow-none">
        <div className="h-16 lg:h-24 flex items-center justify-between px-4 lg:px-8 py-2">
          <div className="flex items-center gap-1 lg:gap-4">
            {onBack && (
              <button 
                onClick={onBack}
                className="lg:hidden p-2.5 -mr-1.5 text-on-surface-variant/60 hover:text-primary transition-all active:scale-90"
                aria-label="Back to inbox"
              >
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 rotate-180" />
              </button>
            )}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-primary/5 rounded-xl lg:rounded-2xl flex items-center justify-center text-primary border border-primary/10 shadow-inner transition-transform active:scale-95 cursor-pointer">
                <User className="w-5 h-5 lg:w-8 lg:h-8" />
              </div>
              <div className="space-y-0 lg:space-y-0.5">
                <h2 className="text-[14px] lg:text-lg font-black text-on-surface flex items-center gap-1.5 leading-none">
                  {conversation.user.name}
                  {conversation.user.isVerified && <ShieldCheck className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary" />}
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-success rounded-full" />
                  <span className="text-[7px] lg:text-[10px] font-black text-success uppercase tracking-widest leading-none">متصل</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-3">
            {onToggleContext && (
              <button 
                onClick={onToggleContext}
                className="hidden lg:flex p-3 bg-white border border-outline-variant/20 rounded-xl text-on-surface-variant/60 hover:text-primary transition-all shadow-sm active:scale-95"
              >
                <Info className="w-5 h-5" />
              </button>
            )}
            <TrustSafetyMenu />
          </div>
        </div>

        {/* Compact Integrated Context (Mobile Only) */}
        <div className="lg:hidden px-4 pb-2.5 -mt-1 flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 bg-surface-container-low/50 px-2.5 py-1.5 rounded-lg border border-outline-variant/10 shadow-inner">
             <ShoppingBag className="w-3.5 h-3.5 text-primary/40 shrink-0" />
             <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[8px] font-black text-on-surface-variant/50 uppercase tracking-widest shrink-0">بخصوص:</span>
                <span className="text-[10px] font-black text-on-surface truncate pr-0.5">{conversation.linkedItem.title}</span>
             </div>
          </div>
          <Link href={`/marketplace/listings/${conversation.linkedItem.id}`}>
            <button className="text-[9px] font-black text-primary underline underline-offset-2 uppercase tracking-widest transition-all active:opacity-50 px-2">
              التفاصيل
            </button>
          </Link>
        </div>
      </header>

      {/* Messages Area - Structurally Centralized Scroll */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-8 flex flex-col">
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            time={msg.time}
            isRead={true}
          />
        ))}
        
        {/* Desktop Context Prompts */}
        <div className="hidden lg:block mx-auto max-w-sm w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-[2rem] p-8 text-center space-y-4 mt-12 shadow-sm shrink-0">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-outline-variant/40 shadow-sm">
             <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
             <h4 className="text-sm font-black text-on-surface leading-none">متابعة العرض؟</h4>
             <p className="text-[11px] font-medium text-on-surface-variant/60 leading-relaxed italic">
                هل تريد المتابعة مع {conversation.user.name} بخصوص "{conversation.linkedItem.title}"؟
             </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase border-outline-variant/60">تجاهل</Button>
            <Button className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/20">رد سريع</Button>
          </div>
        </div>
        
        {/* Bottom Padded Area for better scrolling above composer */}
        <div className="h-4 lg:h-8 shrink-0" />
      </div>

      {/* Composer - Flex-none ensures it stays visible at the bottom */}
      <div className="flex-none bg-white border-t border-outline-variant/10">
        <MessageComposer onSend={onSendMessage} />
      </div>
    </div>
  );
}
