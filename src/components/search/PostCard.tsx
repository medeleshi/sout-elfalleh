// src/components/search/PostCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Clock, User, ArrowLeft, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'question' | 'discussion';
  author: string;
  createdAt: string;
  repliesCount: number;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const isQuestion = post.type === 'question';

  return (
    <div className="group bg-white rounded-[2.5rem] border-2 border-outline-variant/30 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 p-6 flex flex-col h-full relative" dir="rtl">
      {/* Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg flex items-center gap-2",
          isQuestion ? "bg-amber-500 text-white" : "bg-primary text-on-primary"
        )}>
          {isQuestion ? <HelpCircle className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
          <span>{isQuestion ? 'سؤال فلاحي' : 'نقاش مجتمعي'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40">
          <Clock className="w-3.5 h-3.5" />
          <span>{post.createdAt}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 flex-1">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-black text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm font-medium text-on-surface-variant/60 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant/40">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-on-surface-variant/60">{post.author}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.repliesCount} ردود</span>
          </div>
          <Link href={`/posts/${post.id}`}>
            <button className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
