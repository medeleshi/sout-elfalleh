// src/components/settings/SettingsSection.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ 
  title, 
  description, 
  icon: Icon, 
  children,
  className
}: SettingsSectionProps) {
  return (
    <section className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", className)}>
      {/* Label Area */}
      <div className="lg:col-span-4 space-y-4 pt-2">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-surface-container-high rounded-2xl text-on-surface-variant">
               <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-on-surface">{title}</h2>
         </div>
         <p className="text-sm font-medium text-on-surface-variant/60 leading-relaxed italic pr-12">
            {description}
         </p>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-8">
        {children}
      </div>
    </section>
  );
}
