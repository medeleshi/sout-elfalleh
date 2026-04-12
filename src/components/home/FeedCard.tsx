'use client';

import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Tag, 
  ShoppingBag, 
  Calendar,
  ChevronLeft,
  User as UserIcon,
  TrendingUp,
  Package
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { type FeedItem } from "@/lib/data/get-feed-items";

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const isListing = item.type === 'listing';
  const isPost = item.type === 'post';
  const isRequest = item.type === 'purchase_request';

  const href = isListing 
    ? `/listings/${item.id}` 
    : isRequest 
      ? `/marketplace/requests/${item.id}`
      : `/posts/${item.id}`;
  
  // Metadata extraction
  const governorate = !isPost && (item as any).governorates?.name_ar 
    ? (item as any).governorates.name_ar 
    : 'المجتمع العام';
  const timeAgo = formatDistanceToNow(new Date(item.created_at), { 
    addSuffix: true, 
    locale: ar 
  });
  
  // Format price/budget for marketplace items
  const value = isListing ? item.price : isRequest ? (item as any).budget : null;
  const formattedValue = value ? new Intl.NumberFormat('ar-TN', { 
    style: 'currency', 
    currency: 'TND' 
  }).format(Number(value)) : (isPost ? null : 'حسب الاتفاق');

  // Specific metadata
  const quantity = isListing ? item.quantity : isRequest ? (item as any).quantity : null;
  const unit = (item as any).unit || 'وحدة';

  return (
    <Link href={href} className="block group">
      <article className="bg-surface rounded-[2rem] border border-outline-variant/10 p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 relative overflow-hidden flex flex-col sm:flex-row gap-6">
        
        {/* Visual Content Block */}
        <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto sm:h-auto shrink-0 rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/5">
          {isListing && item.listing_images?.[0] ? (
            <img 
              src={item.listing_images[0].storage_path} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
              isListing ? 'bg-primary/5 text-primary' : 
              isRequest ? 'bg-secondary/5 text-secondary' : 
              'bg-tertiary/5 text-tertiary'
            }`}>
              {isListing ? <Tag className="w-10 h-10 opacity-40" /> : 
               isRequest ? <ShoppingBag className="w-10 h-10 opacity-40" /> :
               <TrendingUp className="w-10 h-10 opacity-40" />}
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-center px-2">
                {isListing ? 'صورة العرض' : isRequest ? 'طلب شراء' : 'منشور مجتمعي'}
              </span>
            </div>
          )}
          
          {/* Item Type Badge Overlay */}
          <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 shadow-sm backdrop-blur-md border border-white/10 ${
            isListing ? 'bg-primary/90 text-on-primary' : 
            isRequest ? 'bg-secondary/90 text-on-secondary' :
            'bg-tertiary/90 text-on-tertiary'
          }`}>
            {isListing ? <Tag className="w-3 h-3" /> : 
             isRequest ? <ShoppingBag className="w-3 h-3" /> :
             <TrendingUp className="w-3 h-3" />}
            <span>
              {isListing ? 'عرض للبيع' : 
               isRequest ? 'طلب شراء' : 
               (item as any).post_type === 'question' ? 'سؤال فني' : 'نقاش زراعي'}
            </span>
          </div>
        </div>

        {/* Content Block */}
        <div className="flex-1 flex flex-col justify-between py-1 text-right">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>
              {formattedValue && (
                <p className="text-primary font-black text-lg whitespace-nowrap">
                  {formattedValue}
                </p>
              )}
            </div>
            
            <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed opacity-80">
              {isPost ? (item as any).content : (item.description || 'لا يوجد وصف متاح لهذا العنصر...')}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-[11px] font-bold text-on-surface-variant/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary/60" />
                <span>{governorate}</span>
              </div>
              {!isPost && (
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-primary/60" />
                  <span>
                    {quantity} {unit}
                  </span>
                </div>
              )}
              <div className={`flex items-center gap-2 ${isPost ? 'col-span-1' : 'lg:col-span-1 col-span-2'}`}>
                <Calendar className="w-3.5 h-3.5 text-primary/60" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* User & Action Bottom Bar */}
          <div className="mt-6 pt-4 border-t border-outline-variant/5 flex items-center justify-between flex-row-reverse">
            <div className="flex items-center gap-2.5 flex-row-reverse">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/10 overflow-hidden flex items-center justify-center">
                {item.profiles?.avatar_url ? (
                  <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-on-surface-variant/40" />
                )}
              </div>
              <span className="text-xs font-bold text-on-surface/80">{item.profiles?.full_name || 'مستخدم'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-primary text-xs font-black group-hover:translate-x-[-4px] transition-transform flex-row-reverse">
              <span>{isPost ? 'اقرأ المزيد' : 'عرض التفاصيل'}</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hover Accent Glow */}
        <div className="absolute top-0 right-0 w-1 h-full bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      </article>
    </Link>
  );
}
