'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { signUpAction } from "@/lib/auth/actions";
import { signInWithGoogle } from "@/lib/auth/client-utils";
import { Feedback } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signUpAction, null);
  const [oauthError, setOauthError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setOauthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setOauthError(err.message || 'فشل الاتصال بـ Google.');
    }
  };

  const benefits = [
    "تواصل مباشر مع فلاحين وتجار من كافة ولايات تونس.",
    "سوق مفتوحة وحيوية على مدار الساعة لمنتجاتك.",
    "أدوات ذكية لإدارة عروضك ومتابعة تقلبات الأسعار."
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFCF9]">
      {/* Branding & Marketing Side (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-primary p-12 flex-col justify-between">
        {/* Abstract Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/auth-farmer.png"
            alt="Agriculture background"
            fill
            className="object-cover opacity-30 grayscale-[0.2] contrast-[1.1]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3 text-on-primary">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
            </svg>
          </div>
          <span className="text-2xl font-black font-serif tracking-tight">صوت الفلاح</span>
        </Link>
        
        <div className="relative z-10 space-y-10 max-w-lg mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-on-primary font-serif leading-[1.2]">
            انضم لمستقبل <br />
            <span className="italic opacity-80 underline decoration-secondary-fixed underline-offset-8">الفلاحة التونسية</span>
          </h2>
          
          <div className="space-y-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl text-on-primary/95 font-medium leading-relaxed font-sans">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-on-primary/60 text-sm">
          &copy; 2026 جميع الحقوق محفوظة لـ صوت الفلاح
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Logo for mobile */}
          <div className="flex justify-center lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-3 text-primary">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <svg className="w-6 h-6 text-on-primary-container" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
                </svg>
              </div>
              <span className="text-2xl font-black font-serif">صوت الفلاح</span>
            </Link>
          </div>

          <div className="space-y-3 text-center md:text-right">
            <h1 className="text-4xl font-black text-primary font-serif italic">إنشاء حساب جديد</h1>
            <p className="text-lg text-on-surface-variant font-medium">ابدأ رحلتك الفلاحية اليوم في أكبر سوق رقمي تونسي.</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-4 w-full py-4 px-6 rounded-2xl border-2 border-outline-variant hover:bg-surface-container-low transition-all font-black text-on-surface group active:scale-[0.98]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 transition-transform group-hover:rotate-12" alt="Google" />
              <span>المتابعة باستخدام Google</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-[#FDFCF9] text-outline-variant font-black uppercase tracking-widest">أو عبر البريد</span>
              </div>
            </div>

            {(state?.error || oauthError) && (
              <Feedback type="error" message={state?.error || oauthError!} />
            )}

            {state?.success && (
              <Feedback type="success" message={state.message} />
            )}

            <form action={action} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-black text-primary/80 uppercase tracking-wider mr-1">
                  البريد الإلكتروني
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-outline-variant bg-white hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-outline-variant text-lg font-medium"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-black text-primary/80 uppercase tracking-wider mr-1">
                  كلمة المرور
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-outline-variant bg-white hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-outline-variant text-lg font-medium"
                  dir="ltr"
                  required
                />
              </div>

              <Button type="submit" isLoading={isPending}>
                إنشاء الحساب
              </Button>
            </form>

            <div className="text-center pt-6 space-y-8">
              <p className="text-lg text-on-surface-variant font-medium">
                لديك حساب بالفعل؟{" "}
                <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
                  تسجيل الدخول
                </Link>
              </p>

              {/* Legal Footer Links */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-10 border-t border-outline-variant text-sm font-bold text-outline-variant">
                <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">شروط الاستخدام</Link>
                <Link href="/rules" className="hover:text-primary transition-colors">قواعد التسجيل</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
