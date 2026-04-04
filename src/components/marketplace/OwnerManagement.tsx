'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, 
  Edit3, 
  CheckCircle2, 
  Trash2, 
  EyeOff, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface OwnerManagementProps {
  listingId: string;
  status: string;
  isStale: boolean;
}

export function OwnerManagement({ listingId, status, isStale }: OwnerManagementProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    // In a real app, this would be a Supabase call
    setTimeout(() => {
      setCurrentStatus(newStatus);
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <section className="space-y-6">
      {/* 46. Stale State Prompt (Owner only) */}
      {isStale && (
        <div className="p-6 bg-error/5 border-2 border-error/10 rounded-3xl space-y-3">
          <div className="flex items-center gap-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h4 className="font-black text-sm">العرض قديم نوعاً ما</h4>
          </div>
          <p className="text-xs font-medium text-on-surface-variant/70 leading-relaxed italic text-right">
            لم يتم تحديث هذا العرض منذ فترة. قم بتحديثه الآن ليبقى في أعلى نتائج البحث ويراه عدد أكبر من المشترين.
          </p>
          <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl border-error/20 text-error hover:bg-error/5 font-black text-xs flex items-center justify-center gap-2"
            onClick={() => handleStatusUpdate('active')}
            disabled={isUpdating}
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>تحديث العرض الآن</span>
          </Button>
        </div>
      )}

      <div className="p-8 bg-surface-container-low rounded-[3rem] border-2 border-outline-variant/30 space-y-4">
        <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest italic text-right">إدارة عرضك</h3>
        
        <div className="flex flex-col gap-3">
          <Link href={`/listings/${listingId}/edit`} className="w-full">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-lg border-2 border-outline-variant/60 flex items-center justify-center gap-2">
              <Edit3 className="w-5 h-5" />
              <span>تعديل بيانات العرض</span>
            </Button>
          </Link>

          {currentStatus === 'active' && (
            <Button 
              onClick={() => handleStatusUpdate('sold')}
              disabled={isUpdating}
              className="h-14 rounded-2xl font-black text-lg shadow-xl bg-on-surface text-surface flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>تحديد كـ "تم البيع"</span>
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="ghost" 
              className="text-xs font-black text-on-surface-variant/60 hover:text-error flex items-center justify-center gap-1.5"
              onClick={() => handleStatusUpdate('archived')}
              disabled={isUpdating}
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف نهائي</span>
            </Button>
            <Button 
              variant="ghost" 
              className="text-xs font-black text-on-surface-variant/60 hover:text-primary flex items-center justify-center gap-1.5"
              onClick={() => handleStatusUpdate('inactive')}
              disabled={isUpdating}
            >
              <EyeOff className="w-4 h-4" />
              <span>إخفاء مؤقت</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
