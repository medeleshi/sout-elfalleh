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
  MessageCircle,
  Eye,
  TrendingUp,
  Zap
} from 'lucide-react';
import { getFreshnessInfo } from '@/lib/utils/freshness';

interface Listing {
  id: string;
  title: string;
  category: string;
  price?: number;
  quantity: number;
  unit: string;
  location: string;
  image?: string;
  isNegotiable?: boolean;
  publisher: string;
  isVerified?: boolean;
  createdAt: string;
  freshnessLabel?: string; // e.g., "جديد جدًا"
}

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="group bg-white rounded-[2.5rem] border-2 border-outline-variant/30 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full relative" dir="rtl">
      {/* Top Banner: Listing Type Tag */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
         <button className="p-2.5 bg-white/90 backdrop-blur rounded-2xl text-on-surface/30 hover:text-error transition-all shadow-lg active:scale-90">
           <Heart className="w-5 h-5" />
         </button>
         <button className="p-2.5 bg-white/90 backdrop-blur rounded-2xl text-on-surface/30 hover:text-primary transition-all shadow-lg active:scale-90">
           <MoreVertical className="w-5 h-5" />
         </button>
      </div>

      {/* Media & Quick Info Overlay */}
      <Link href={`/marketplace/listings/${listing.id}`} className="block relative aspect-[4/3] overflow-hidden bg-surface-container-low group-hover:cursor-pointer">
        <img 
          src={listing.image || 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?auto=format&fit=crop&q=80&w=400'} 
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Freshness Badge */}
        <div className="absolute top-4 right-4 bg-primary text-on-primary px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg flex items-center gap-2">
           <Zap className="w-3 h-3 fill-current" />
           <span>عرض بيع</span>
        </div>

        <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
           <div className={`flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black ${getFreshnessInfo(listing.createdAt || (listing as any).created_at).colorClass} bg-white/80`}>
              <Clock className="w-3 h-3" />
              <span>{getFreshnessInfo(listing.createdAt || (listing as any).created_at).label}</span>
           </div>
           <div className="bg-white text-primary px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg">
              {listing.category}
           </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Title & Trust */}
        <div className="space-y-1">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
               <div className="p-1 w-fit rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="w-3 h-3" />
               </div>
               <span className="text-[9px] font-black text-on-surface-variant/40 tracking-widest uppercase">{listing.publisher}</span>
            </div>
            {listing.isVerified && (
              <span className="text-[8px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">هوية موثقة</span>
            )}
          </div>
          <Link href={`/marketplace/listings/${listing.id}`}>
            <h3 className="text-xl font-black text-on-surface line-clamp-1 group-hover:text-primary transition-colors leading-tight">
              {listing.title}
            </h3>
          </Link>
        </div>

        {/* Commercial Metadata */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 flex items-center gap-3 group-hover:border-primary/20 transition-colors">
            <Scale className="w-5 h-5 text-on-surface-variant/40" />
            <div className="space-y-0.5">
               <span className="text-[8px] font-black text-on-surface-variant/30 uppercase block">الكمية</span>
               <p className="text-sm font-black text-on-surface">{listing.quantity} {listing.unit}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 flex items-center gap-3 group-hover:border-primary/20 transition-colors">
            <MapPin className="w-5 h-5 text-on-surface-variant/40" />
            <div className="space-y-0.5">
               <span className="text-[8px] font-black text-on-surface-variant/30 uppercase block">الموقع</span>
               <p className="text-sm font-black text-on-surface">{listing.location}</p>
            </div>
          </div>
        </div>

        {/* Footer: Price & Quick Action */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary font-serif italic">{listing.price}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60">د.ت</span>
          </div>
          
          <Link href={`/marketplace/listings/${listing.id}`}>
            <button className="flex items-center gap-2 px-5 py-3 bg-primary/5 hover:bg-primary text-primary hover:text-on-primary rounded-xl font-black text-xs transition-all active:scale-95 group/btn">
               <span>التفاصيل</span>
               <MessageCircle className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform rotate-180" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
