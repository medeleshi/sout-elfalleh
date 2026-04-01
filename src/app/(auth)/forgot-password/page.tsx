'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resetPasswordAction } from '@/lib/auth/actions';
import { ROUTES } from '@/lib/constants/routes';
import { Feedback } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(resetPasswordAction, null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFCF9]">
      {/* Branding Side */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-primary p-12 flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <Image
            src="/home/medeleshi/.gemini/antigravity/brain/8a18e89d-bdcb-47ef-b012-8f4275c7de2b/hero_agriculture_tunisia_1774909058376.png"
            alt="Agriculture"
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-primary/40" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3 text-on-primary">
          <span className="text-2xl font-black font-serif">صوت الفلاح</span>
        </Link>

        <div className="relative z-10 text-on-primary/60 text-sm">
          &copy; 2026 جميع الحقوق محفوظة لـ صوت الفلاح
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4 text-center md:text-right">
            <h1 className="text-4xl font-black text-primary font-serif italic leading-tight text-balance">
              استعادة الوصول إلى حسابك
            </h1>
            <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
              لا تقلق، سنساعدك على العودة! أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لتعيين كلمة سر جديدة.
            </p>
          </div>

          {state?.error && (
            <Feedback type="error" message={state.error} />
          )}

          {state?.success && (
            <Feedback 
              type="success" 
              message="تم إرسال رابط الاستعادة بنجاح! يرجى التحقق من بريدك الإلكتروني (بما في ذلك المجلدات غير المرغوب فيها) واتباع التعليمات." 
            />
          )}

          <form action={action} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-black text-primary/80 uppercase tracking-wider mr-1">
                البريد الإلكتروني المسجل
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-8 py-5 rounded-2xl border-2 border-outline-variant bg-white hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-xl font-medium"
                dir="ltr"
                required
              />
            </div>

            <Button type="submit" isLoading={isPending}>
              {isPending ? 'جاري إرسال الرابط...' : 'إرسال رابط استعادة كلمة السر'}
            </Button>
          </form>

          <div className="text-center pt-6">
            <Link href={ROUTES.LOGIN} className="text-primary font-black hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
