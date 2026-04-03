// src/components/settings/SettingsHeader.tsx
'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SettingsHeaderProps {
  profile: Profile;
}

export function SettingsHeader({ profile }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-8 border-b border-outline-variant/20">
      <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
        {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />}
        <AvatarFallback className="text-2xl font-black bg-primary/5 text-primary">
          {profile.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="text-center md:text-right space-y-2">
        <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight leading-tight">الإعدادات</h1>
        <p className="text-sm font-medium text-on-surface-variant/60 italic">
          أهلاً {profile.full_name || 'بكم'}، يمكنك التحكم في تجربتك وحسابك من هنا.
        </p>
      </div>
    </div>
  );
}
