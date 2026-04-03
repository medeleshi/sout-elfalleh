// src/components/search/ProfileCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Users, MapPin, Star, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type UserRole } from '@/types/database';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  location: string;
  isVerified?: boolean;
  activityType?: string;
  rating?: number;
}

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="group bg-white rounded-[2.5rem] border-2 border-outline-variant/30 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 p-6 flex flex-col items-center text-center relative h-full" dir="rtl">
      {/* Verification Badge */}
      {profile.isVerified && (
        <div className="absolute top-4 right-4 p-1.5 bg-primary/10 text-primary rounded-xl" title="موثق">
          <ShieldCheck className="w-4 h-4" />
        </div>
      )}

      {/* Avatar */}
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-[2rem] bg-surface-container-highest overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-500 shadow-inner">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Users className="w-8 h-8 text-primary/30" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-amber-500 text-white shadow-lg">
          <Star className="w-3 h-3 fill-current" />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 mb-6 flex-1">
        <Link href={`/profile/${profile.id}`}>
          <h3 className="text-xl font-black text-on-surface group-hover:text-primary transition-colors line-clamp-1 leading-tight">
            {profile.full_name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-surface-container-highest text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
            {profile.role === 'farmer' ? 'فلاح' : profile.role === 'merchant' ? 'تاجر' : 'مشتري'}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/60 font-bold">
            <MapPin className="w-3 h-3 text-primary/50" />
            <span>{profile.location}</span>
          </div>
        </div>
        <p className="text-xs font-medium text-on-surface-variant/40 mt-2 line-clamp-1 italic">
          {profile.activityType || 'نشاط تجاري متنوع'}
        </p>
      </div>

      {/* Action */}
      <Link href={`/profile/${profile.id}`} className="w-full">
        <button className="w-full py-4 bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-3 group/btn shadow-sm">
          <span>عرض الملف</span>
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  );
}
