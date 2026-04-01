'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { updatePasswordAction } from '@/lib/auth/actions';
import { Feedback } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';

export default function UpdatePasswordPage() {
  const [state, action, isPending] = useActionState(updatePasswordAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] p-6">
      <div className="w-full max-w-md space-y-10 bg-white p-10 rounded-3xl shadow-2xl border border-outline-variant">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-black text-primary font-serif italic leading-tight">خطوة واحدة إضافية</h1>
          <p className="text-xl text-on-surface-variant font-medium leading-relaxed">يرجى تعيين كلمة سر جديدة قوية لحماية حسابك والاحتفاظ ببياناتك آمنة.</p>
        </div>

        {state?.error && (
          <Feedback type="error" message={state.error} />
        )}

        {state?.success && (
          <div className="space-y-6">
            <Feedback type="success" message="تم تحديث كلمة السر بنجاح! يمكنك الآن تسجيل الدخول باستخدام بياناتك الجديدة." />
            <Link href="/login" className="block">
              <Button variant="secondary">العودة لتسجيل الدخول</Button>
            </Link>
          </div>
        )}

        {!state?.success && (
          <form action={action} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-black text-primary/80 uppercase tracking-wider mr-1">
              كلمة السر الجديدة
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl border-2 border-outline-variant bg-white hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-medium"
              dir="ltr"
              required
            />
          </div>

          <Button type="submit" isLoading={isPending}>
            تحديث كلمة السر
          </Button>
        </form>
        )}
      </div>
    </div>
  );
}
