'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  AlertCircle, 
  MessageCircle, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ListingActionsProps {
  listingId: string;
  isOwner: boolean;
  ownerId: string;
  price: string;
  unit: string;
  isNegotiable?: boolean;
}

export function ListingActions({ listingId, isOwner, ownerId, price, unit, isNegotiable }: ListingActionsProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isReported, setIsReported] = useState(false);

  if (isOwner) return null;

  return (
    <section className="space-y-4 p-8 bg-primary/5 rounded-[3rem] border-2 border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="space-y-2 relative z-10 text-right">
        <div className="flex items-center justify-between mb-1">
          {isNegotiable && (
            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
              قابل للتفاوض
            </span>
          )}
          <h3 className="text-sm font-black text-primary uppercase tracking-widest italic mr-auto">هل أنت مهتم؟</h3>
        </div>
        <div className="flex items-baseline justify-end gap-2 pt-2">
          {price != null && price !== '' ? (
            <>
              <p className="text-4xl font-black text-primary font-serif italic">{price}</p>
              <p className="text-sm font-black text-on-surface-variant/60">د.ت / {unit}</p>
            </>
          ) : (
            <p className="text-2xl font-black text-primary font-serif italic">للتفاوض</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10 mt-6">
        <Button 
          className="h-16 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
          onClick={() => router.push(`/messages?recipientId=${ownerId}`)}
        >
          <MessageCircle className="w-6 h-6 rotate-180" />
          <span>بدء محادثة فورية</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 rounded-2xl font-black text-xl border-2 border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center gap-3"
          onClick={() => router.push(`/messages?recipientId=${ownerId}`)}
        >
          <Phone className="w-6 h-6" />
          <span>اتصال مباشر</span>
        </Button>
      </div>

      <div className="flex items-center justify-between pt-4 px-2 relative z-10">
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center gap-2 text-xs font-black transition-colors ${
            isSaved ? 'text-primary' : 'text-on-surface-variant/40 hover:text-primary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          <span>{isSaved ? 'تم الحفظ' : 'حفظ العرض'}</span>
        </button>
        
        <button 
          onClick={() => setIsReported(true)}
          className={`flex items-center gap-2 text-xs font-black transition-colors ${
            isReported ? 'text-error' : 'text-on-surface-variant/40 hover:text-error'
          }`}
          disabled={isReported}
        >
          {isReported ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{isReported ? 'تم التبليغ' : 'تبليغ عن محتوى'}</span>
        </button>
      </div>
    </section>
  );
}
