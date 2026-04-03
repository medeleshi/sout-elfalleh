'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Scale, 
  Clock, 
  ShieldCheck, 
  Heart, 
  MoreVertical,
  MessageSquare,
  TrendingDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { getFreshnessInfo } from '@/lib/utils/freshness';

interface PurchaseRequest {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  budget?: number;
  location: string;
  publisher: string;
  isVerified?: boolean;
  createdAt: string;
  timing?: string; // e.g., "عاجل"
  freshnessLabel?: string;
}

interface RequestCardProps {
  request: PurchaseRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="group bg-white rounded-[2.5rem] border-2 border-secondary/10 hover:border-secondary/40 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full relative" dir="rtl">
      {/* Top Banner Info */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
         <button className="p-2.5 bg-white/90 backdrop-blur rounded-2xl text-on-surface/30 hover:text-secondary transition-all shadow-lg active:scale-90">
           <Heart className="w-5 h-5" />
         </button>
      </div>

      <div className="p-6 pt-10 space-y-6 flex-1 flex flex-col">
        {/* Header: Request Type & Freshness */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>طلب شراء</span>
           </div>
            <div className={`flex items-center gap-2 text-[10px] font-black px-3 py-1 rounded-lg ${getFreshnessInfo(request.createdAt || (request as any).created_at).colorClass}`}>
               <Clock className="w-3.5 h-3.5" />
               <span>{getFreshnessInfo(request.createdAt || (request as any).created_at).label}</span>
            </div>
        </div>

        {/* Title & Trust */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{request.publisher}</span>
                    <div className="flex items-center gap-1.5 text-on-surface-variant/30 font-bold text-[9px]">
                       <span>5 صفقات • موثق</span>
                    </div>
                 </div>
              </div>
          </div>
          
          <Link href={`/marketplace/requests/${request.id}`}>
            <h3 className="text-2xl font-black text-on-surface line-clamp-2 leading-tight font-serif italic hover:text-secondary transition-colors">
              {request.title}
            </h3>
          </Link>
        </div>

        {/* Precise Needs Specs */}
        <div className="grid grid-cols-2 gap-4 flex-1">
           <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10 flex flex-col justify-center space-y-1">
              <span className="text-[9px] font-black text-secondary/60 uppercase tracking-widest">الكمية المطلوبة</span>
              <p className="text-lg font-black text-on-surface">{request.quantity} {request.unit}</p>
           </div>
           <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-center space-y-1">
              <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">الموقع المفضل</span>
              <p className="text-lg font-black text-on-surface">{request.location}</p>
           </div>
        </div>

        {/* Budget & Timing Context */}
        <div className="pt-6 border-t border-outline-variant/20 space-y-4">
           <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                 <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest block">الميزانية المقدرة</span>
                 <p className="text-2xl font-black text-secondary font-serif italic">
                    {request.budget ? `${request.budget} د.ت` : 'حسب الاتفاق'}
                 </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <div className="flex items-center gap-2 text-error font-black text-[10px] bg-error/5 px-3 py-1 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{request.timing || 'جاهز للدفع'}</span>
                 </div>
              </div>
           </div>

           {/* Primary Action */}
           <Link href={`/marketplace/requests/${request.id}`} className="block">
             <button className="w-full py-4 bg-secondary text-on-secondary rounded-[1.5rem] font-black text-sm shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <MessageSquare className="w-5 h-5" />
                <span>الرد على الطلب الآن</span>
             </button>
           </Link>
        </div>
      </div>
    </div>
  );
}
