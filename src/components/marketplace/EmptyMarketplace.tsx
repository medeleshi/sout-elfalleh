'use client';

import React from 'react';
import { ShoppingBag, Search, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyMarketplaceProps {
  type: 'no-results' | 'no-listings' | 'no-requests';
  onReset?: () => void;
}

export function EmptyMarketplace({ type, onReset }: EmptyMarketplaceProps) {
  const configs = {
    'no-results': {
      icon: Search,
      title: 'لم نجد نتائج مطابقة',
      description: 'حاول تغيير معايير البحث أو تصفية النتائج بشكل أوسع للوصول إلى خيارات أكثر.',
      action: onReset ? (
        <Button onClick={onReset} variant="outline" className="rounded-xl font-black">
          مسح التصفية
        </Button>
      ) : null
    },
    'no-listings': {
      icon: ShoppingBag,
      title: 'لا توجد عروض حالياً',
      description: 'يبدو أن هذا القسم فارغ حالياً. كن أول من ينشر عرضاً في هذه المنطقة!',
      action: (
        <Button className="rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" />
          <span>إضافة عرض جديد</span>
        </Button>
      )
    },
    'no-requests': {
      icon: MapPin,
      title: 'لا توجد طلبات شراء',
      description: 'لم يقم أحد بنشر طلبات شراء في هذا القسم بعد. يمكنك نشر طلبك الآن.',
      action: (
        <Button className="rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" />
          <span>إضافة طلب شراء</span>
        </Button>
      )
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-6 bg-surface-container-lowest rounded-[3rem] border-2 border-dashed border-outline-variant/30">
      <div className="p-8 bg-white rounded-[2rem] shadow-sm text-primary/20">
        <Icon className="w-16 h-16" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-black text-on-surface">{config.title}</h3>
        <p className="text-on-surface-variant/60 font-medium leading-relaxed italic">
          {config.description}
        </p>
      </div>
      {config.action}
    </div>
  );
}
