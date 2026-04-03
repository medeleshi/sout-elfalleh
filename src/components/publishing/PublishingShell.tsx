import React, { useState } from 'react';
import { ArrowRight, Home, PlusCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { PublishingHelp } from './PublishingHelp';

interface PublishingShellProps {
  title: string;
  subtitle: string;
  type: 'listing' | 'request' | 'post' | 'question';
  children: React.ReactNode;
  isSubmitting?: boolean;
  onCancel?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActions?: React.ReactNode;
}

export function PublishingShell({
  title,
  subtitle,
  type,
  children,
  isSubmitting,
  onCancel,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActions
}: PublishingShellProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-container-lowest lg:bg-surface pb-32" dir="rtl">
      {/* Mobile-First Floating Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant/10 shadow-sm lg:shadow-none">
        <div className="max-w-4xl mx-auto px-4 h-16 lg:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
             <Link href="/marketplace" className="p-2.5 -mr-2 text-on-surface-variant/60 hover:text-primary transition-all active:scale-90 lg:hidden">
                <ArrowRight className="w-6 h-6 rotate-180" />
             </Link>
             <div className="space-y-0.5">
                <h1 className="text-lg lg:text-3xl font-black text-on-surface italic font-serif leading-none">{title}</h1>
                <p className="text-[10px] lg:text-sm font-black text-on-surface-variant/40 uppercase tracking-widest">{subtitle}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
             <button 
               onClick={() => setIsHelpOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest transition-all"
             >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">دليل النشر</span>
             </button>

             <Link href={ROUTES.HOME} className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-on-surface-variant/60 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all">
                <Home className="w-4 h-4" />
                <span>العودة للرئيسية</span>
             </Link>
          </div>
        </div>
      </div>

      <PublishingHelp 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        defaultType={type} 
      />

      <div className="max-w-3xl mx-auto px-4 lg:px-0 py-8 lg:py-12">
        {/* Type Switcher / Guidance */}
        <div className="mb-10 lg:mb-12 bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 lg:p-8 relative overflow-hidden group shadow-inner">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
           <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                 <h2 className="text-lg font-black text-primary leading-none">اختر ما تريد نشره</h2>
                 <p className="text-[11px] lg:text-sm font-medium text-on-surface-variant/60 leading-relaxed italic pr-1 border-r-4 border-primary/20">
                    يمكنك التبديل بين إنشاء إعلان للبيع، طرح سؤال ومشاركة في المجتمع، أو إنشاء طلب شراء.
                 </p>
              </div>
              <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-2xl border border-outline-variant/10 shadow-sm self-start lg:self-center">
                 <Link href="/listings/new" className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-[11px] lg:text-xs font-black uppercase tracking-widest transition-all ${type === 'listing' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-primary'}`}>
                    عرض بيع
                 </Link>
                 <Link href="/posts/new" className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-[11px] lg:text-xs font-black uppercase tracking-widest transition-all ${(type === 'post' || type === 'question') ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-primary'}`}>
                    نقاش
                 </Link>
                 <Link href="/purchase-requests/new" className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-[11px] lg:text-xs font-black uppercase tracking-widest transition-all ${type === 'request' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-primary'}`}>
                    طلب شراء
                 </Link>
              </div>
           </div>
        </div>

        {/* Main Form Content */}
        <div className="space-y-12">
           {children}
        </div>
      </div>

      {/* Persistent Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-2xl border-t border-outline-variant/10 py-5 lg:py-8 px-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
         <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
            <div className="flex flex-1 w-full gap-3">
               <Button 
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl font-black text-[13px] lg:text-base border-outline-variant/60 hover:bg-surface-container-low transition-all active:scale-95"
                  onClick={onCancel}
                  disabled={isSubmitting}
               >
                  إلغاء
               </Button>
               {secondaryActions}
            </div>
            <Button 
               className="w-full sm:flex-1 h-14 rounded-2xl font-black text-[15px] lg:text-lg shadow-xl shadow-primary/30 transition-all active:scale-95 group relative overflow-hidden"
               disabled={isSubmitting}
               onClick={onPrimaryAction}
            >
               <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? 'جاري الحفظ...' : (
                    <>
                       <span>{primaryActionLabel || `نشر ${type === 'listing' ? 'العرض' : type === 'request' ? 'الطلب' : type === 'question' ? 'السؤال' : 'المنشور'} الآن`}</span>
                       <PlusCircle className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </>
                  )}
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container/20 to-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Button>
         </div>
      </div>
    </div>
  );
}
