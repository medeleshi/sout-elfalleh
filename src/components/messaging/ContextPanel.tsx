'use client';

import React from 'react';
import { ChevronRight, ShoppingBag, User, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ContextPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  user: {
    name: string;
    role: string;
    avatar?: string | null;
  };
  linkedItem: {
    id: string;
    title: string;
    price: string;
    image?: string | null;
  };
}

export function ContextPanel({
  isOpen,
  onClose,
  user,
  linkedItem
}: ContextPanelProps) {
  return (
    <div className={`
      w-full lg:w-[320px] bg-white border-r border-outline-variant/20 flex flex-col shrink-0
      ${isOpen ? 'hidden lg:static lg:flex' : 'hidden lg:flex'}
    `}>
      {/* Mobile Header (Now suppressed/hidden visually on actual mobile via parent hidden state) */}
      <div className="lg:hidden p-5 border-b border-outline-variant/10 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-1 h-6 bg-primary rounded-full" />
           <h2 className="text-lg font-black text-on-surface">تفاصيل العرض</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-3 bg-surface-container-low rounded-xl active:scale-90 transition-all text-on-surface-variant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 lg:space-y-10">
        {/* Linked Item Context */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>المنتج المرتبط</span>
          </div>
          <div className="p-4 lg:p-5 bg-surface-container-low border border-outline-variant/20 rounded-[2rem] space-y-4 group cursor-pointer hover:border-primary transition-all shadow-sm">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-outline-variant/10 shadow-inner">
              {linkedItem.image ? (
                <img src={linkedItem.image} alt={linkedItem.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/15">
                  <ShoppingBag className="w-10 h-10 lg:w-12 lg:h-12" />
                </div>
              )}
            </div>
            <div className="space-y-0.5 lg:space-y-1">
              <h4 className="text-[15px] lg:text-base font-black text-on-surface group-hover:text-primary transition-colors leading-snug truncate">{linkedItem.title}</h4>
              <p className="text-[13px] lg:text-sm font-black text-primary italic">{linkedItem.price}</p>
            </div>
            <Link href={`/listings/${linkedItem.id}`}>
              <Button variant="outline" className="w-full h-10 lg:h-11 rounded-lg lg:rounded-xl font-black text-[11px] lg:text-xs border-outline-variant/60 hover:bg-white shadow-sm">عرض الإعلان كاملاً</Button>
            </Link>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="space-y-4 pt-2 lg:pt-0">
          <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">
            <User className="w-3.5 h-3.5" />
            <span>بيانات الطرف الآخر</span>
          </div>
          <div className="space-y-5 lg:space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 lg:w-12 lg:h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm bg-white">
                <User className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[15px] lg:text-base font-black text-on-surface leading-none">{user.name}</h4>
                <p className="text-[9px] lg:text-[10px] font-black text-on-surface-variant/40 uppercase tracking-tight">{user.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-surface-container-low p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-outline-variant/10 space-y-0.5 lg:space-y-1 shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest block">العضوية</span>
                <p className="text-[11px] lg:text-xs font-black text-on-surface">سنتين</p>
              </div>
              <div className="bg-surface-container-low p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-outline-variant/10 space-y-0.5 lg:space-y-1 shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest block">الموقع</span>
                <p className="text-[11px] lg:text-xs font-black text-on-surface truncate">جندوبة</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full h-10 lg:h-11 rounded-lg lg:rounded-xl text-primary font-black text-[9px] lg:text-[10px] hover:bg-primary/5 border border-primary/10 shadow-sm bg-white">زيارة الملف الشخصي</Button>
          </div>
        </div>

        {/* Metadata / Trust Signals */}
        <div className="space-y-3 pt-8 lg:pt-10 border-t border-outline-variant/10">
          <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>توجيهات الأمان</span>
          </div>
          <p className="text-[10px] lg:text-[11px] leading-relaxed text-on-surface-variant/60 font-medium italic pr-3 border-r-4 border-primary/20 bg-surface-container-lowest p-3 rounded-xl shadow-inner">
            لضمان حقك وتجارتك، ننصحك بالتعامل المباشر ومراجعة جودة المنتج في مكان عام وآمن قبل إتمام أي معاملة مالية.
          </p>
        </div>
      </div>
    </div>
  );
}
