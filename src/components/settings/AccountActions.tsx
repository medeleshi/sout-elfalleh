// src/components/settings/AccountActions.tsx
'use client';

import React, { useState } from 'react';
import { LogOut, Trash2, ShieldAlert, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AccountActions() {
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/login');
      router.refresh();
    } catch (error: any) {
      console.error('Sign out error:', error.message);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-12 border-t-2 border-outline-variant/10">
      <div className="lg:col-span-4 space-y-4">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-error/5 rounded-2xl text-error">
               <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-on-surface">إجراءات الحساب</h2>
         </div>
         <p className="text-sm font-medium text-on-surface-variant/60 leading-relaxed italic pr-12">
            التحكم في الجلسة النشطة أو حذف الحساب بشكل دائم.
         </p>
      </div>

      <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4">
         <button 
           onClick={handleSignOut}
           disabled={isSigningOut}
           className="flex-1 bg-surface-container-low border-2 border-outline-variant/30 rounded-[2rem] p-8 flex flex-col items-start gap-4 hover:border-primary/40 hover:bg-white transition-all group active:scale-[0.98] disabled:opacity-50"
         >
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <LogOut className="w-6 h-6" />
            </div>
            <div className="text-right flex-1 w-full space-y-1">
               <div className="flex items-center justify-between w-full">
                  <h3 className="text-lg font-black text-on-surface group-hover:text-primary transition-colors">تسجيل الخروج</h3>
                  <ChevronLeft className="w-5 h-5 text-on-surface-variant/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
               </div>
               <p className="text-xs font-medium text-on-surface-variant/40 italic">الخروج من جلستك الحالية على هذا الجهاز.</p>
            </div>
         </button>

         <button className="flex-1 bg-error/5 border-2 border-error/10 rounded-[2rem] p-8 flex flex-col items-start gap-4 hover:bg-error hover:text-on-error transition-all group active:scale-[0.98]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-error group-hover:scale-110 transition-transform shadow-inner">
               <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-right flex-1 w-full space-y-1">
               <h3 className="text-lg font-black group-hover:text-white transition-colors">حذف الحساب</h3>
               <p className="text-xs font-medium opacity-60 italic group-hover:text-white/80">سيتم مسح كافة بياناتك ونشاطاتك بشكل نهائي.</p>
            </div>
         </button>
      </div>
    </section>
  );
}
