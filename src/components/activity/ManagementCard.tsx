// src/components/activity/ManagementCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MoreVertical, 
  Eye, 
  MessageCircle, 
  RefreshCw, 
  Edit3, 
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';

interface ManagementCardProps {
  item: {
    id: string;
    title: string;
    type: 'listing' | 'request' | 'post';
    status: 'active' | 'stale' | 'closed';
    createdAt: string;
    views: number;
    engagement: number;
    image?: string;
  };
}

export function ManagementCard({ item }: ManagementCardProps) {
  const isStale = item.status === 'stale';
  const isClosed = item.status === 'closed';

  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 overflow-hidden flex flex-col md:flex-row h-full group hover:border-primary/40 transition-all duration-500 shadow-sm">
      {/* Media / Type Icon */}
      {item.type === 'listing' && item.image ? (
        <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden shrink-0 bg-surface-container-low border-l border-outline-variant/10">
          <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
      ) : (
        <div className="w-full md:w-48 h-48 md:h-auto flex items-center justify-center bg-surface-container-low shrink-0 border-l border-outline-variant/10">
           {item.type === 'post' ? <MessageCircle className="w-10 h-10 text-on-surface-variant/20" /> : <RefreshCw className="w-10 h-10 text-on-surface-variant/20" />}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-2",
              isClosed ? "bg-surface-container-high text-on-surface-variant/40" :
              isStale ? "bg-error/5 text-error" : "bg-primary/5 text-primary"
            )}>
              {isClosed ? <CheckCircle2 className="w-3 h-3" /> :
               isStale ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>{isClosed ? 'مغلق' : isStale ? 'قديم - يحتاج تحديث' : 'نشط'}</span>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-black text-on-surface-variant/40">
               <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.views}</span>
               </div>
               <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{item.engagement}</span>
               </div>
            </div>
          </div>

          <h3 className="text-xl font-black text-on-surface line-clamp-1 leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            {item.type === 'listing' ? 'عرض بيع' : item.type === 'request' ? 'طلب شراء' : 'منشور مجتمعي'} • نُشر {item.createdAt}
          </p>
        </div>

         {/* Management Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
           {item.type === 'listing' ? (
             <Link 
               href={ROUTES.LISTING_EDIT(item.id)}
               className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-on-primary rounded-xl font-black text-xs transition-all active:scale-95 group/btn"
             >
                <Edit3 className="w-4 h-4" />
                <span>تعديل</span>
             </Link>
           ) : item.type === 'post' ? (
             <Link 
               href={ROUTES.POST_EDIT(item.id)}
               className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-on-primary rounded-xl font-black text-xs transition-all active:scale-95 group/btn"
             >
                <Edit3 className="w-4 h-4" />
                <span>تعديل</span>
             </Link>
           ) : (
             <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-on-primary rounded-xl font-black text-xs transition-all active:scale-95 group/btn">
                <Edit3 className="w-4 h-4" />
                <span>تعديل</span>
             </button>
           )}
           
           {isStale && (
             <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-black text-xs transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                <RefreshCw className="w-4 h-4" />
                <span>تحديث</span>
             </button>
           )}

           <button className="p-3 text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-xl transition-all">
              <Trash2 className="w-4 h-4" />
           </button>
           
           <button className="p-3 text-on-surface-variant/40 hover:bg-surface-container-high rounded-xl transition-all">
              <MoreVertical className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
