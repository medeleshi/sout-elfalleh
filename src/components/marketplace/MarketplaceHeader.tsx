'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ShoppingBag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { UserRole } from '@/types/database';

interface MarketplaceHeaderProps {
  role: UserRole;
}

export function MarketplaceHeader({ role }: MarketplaceHeaderProps) {
  const isFarmer = role === 'farmer';
  const cta = {
    description: isFarmer ? 'اكتشف طلبات الشراء وقم بعرض محاصيلك.' : 'اكتشف أفضل المحاصيل والمنتجات الفلاحية.',
    href: isFarmer ? ROUTES.LISTINGS_NEW : ROUTES.PURCHASE_REQUESTS_NEW,
    label: isFarmer ? 'أضف عرض جديد' : 'أضف طلب شراء'
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 border-b border-outline-variant/30">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-on-surface flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-primary" />
          <span>سوق الفلاح</span>
        </h1>
        <p className="text-on-surface-variant/60 font-bold text-sm">
          {cta.description}
        </p>
      </div>

      <Link href={cta.href} className="w-full md:w-auto">
        <Button className="w-full md:w-auto h-14 rounded-2xl font-black px-8 text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Plus className="w-5 h-5" />
          </div>
          <span>{cta.label}</span>
        </Button>
      </Link>
    </header>
  );
}
