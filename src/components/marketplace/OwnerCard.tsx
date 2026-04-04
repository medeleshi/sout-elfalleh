'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Share2, 
  Plus,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface OwnerCardProps {
  owner: {
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
  };
  ownerId: string;
}

export function OwnerCard({ owner, ownerId }: OwnerCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <section className="bg-white p-8 rounded-[3rem] border-2 border-outline-variant/30 space-y-6 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-surface-container-low rounded-[1.5rem] overflow-hidden flex items-center justify-center text-primary group-hover:scale-105 transition-transform border-2 border-primary/10">
            {owner.avatar_url ? (
              <img src={owner.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <ShieldCheck className="w-10 h-10" />
            )}
          </div>
          <div className="space-y-1 text-right">
            <h4 className="text-xl font-black text-on-surface">{owner.full_name || 'مستخدم نشط'}</h4>
            <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest italic">{owner.role || 'عضو نشط'}</p>
          </div>
        </div>
        <Button variant="ghost" className="p-2 h-12 w-12 rounded-2xl border-2 border-primary/5 text-primary hover:bg-primary/5">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-right">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest">تاريخ الانضمام</span>
          <p className="text-sm font-black text-on-surface">منذ فترة</p>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest">الصفقات الناجحة</span>
          <p className="text-sm font-black text-on-surface">متعددة</p>
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <Button 
          onClick={() => setIsFollowing(!isFollowing)}
          variant={isFollowing ? "outline" : "primary"}
          className={`w-full h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all ${
            isFollowing ? 'border-primary text-primary hover:bg-primary/5' : ''
          }`}
        >
          {isFollowing ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>متابعة</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>متابعة الفلاح</span>
            </>
          )}
        </Button>
        
        <Link href={`/profile/${ownerId}`} className="block">
          <Button variant="ghost" className="w-full h-12 rounded-xl text-on-surface-variant/60 font-black text-xs hover:bg-surface-container-high border border-outline-variant/20">
            مشاهدة البروفايل الكامل
          </Button>
        </Link>
      </div>
    </section>
  );
}
