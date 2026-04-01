'use client';

import React, { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { saveOnboardingAction } from "@/lib/auth/actions";
import { AvatarUpload } from "./AvatarUpload";
import {
  // Navigation
  ArrowRight, ArrowLeft, CheckCircle2, Check,
  // Step icons
  HandMetal, MapPin, LayoutGrid, UserCircle2, ClipboardCheck,
  // Field icons
  BadgeCheck, Phone, Map, Milestone, TextCursorInput,
  // Role icons
  Sprout, Store, ShoppingBasket,
  // Info / Help
  Info, ShieldCheck, Compass,
  // Activity icons
  Leaf, Trees, Droplets, Recycle, UtensilsCrossed, PawPrint, Flower2, Wheat, Layers3,
  // Misc
  Pencil, CheckCheck, ArrowUpRight, Bell, TrendingUp, MessageSquare,
  // Logo
  Leaf as LeafLogo,
} from "lucide-react";

interface OnboardingFormProps {
  user: any;
  governorates: any[];
  activityTypes: any[];
}

// Unique icons for activity type cards (cycles)
const ACTIVITY_ICONS = [Leaf, Trees, Droplets, Recycle, UtensilsCrossed, PawPrint, Flower2, Wheat, Layers3, Sprout];

const ROLE_LABELS: Record<string, string> = {
  farmer: 'فلاح',
  merchant: 'تاجر',
  buyer: 'مشتري',
};

// Step metadata
const STEPS = [
  { Icon: HandMetal,      label: 'التعريف'   },
  { Icon: MapPin,         label: 'الموقع'    },
  { Icon: LayoutGrid,     label: 'النشاط'    },
  { Icon: UserCircle2,    label: 'الملف'     },
  { Icon: ClipboardCheck, label: 'المراجعة'  },
];

export function OnboardingForm({ user, governorates, activityTypes }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [state, action, isPending] = useActionState(saveOnboardingAction, null);

  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || "",
    role: "" as 'farmer' | 'buyer' | 'merchant' | "",
    phone: "",
    governorateId: "",
    region: "",
    activityTypeId: "",
    bio: "",
    avatarUrl: "",
  });

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.fullName.trim().length >= 3 && formData.role !== "";
      case 2: return formData.governorateId !== "";
      case 3: return formData.activityTypeId !== "";
      default: return true;
    }
  };

  const nextStep = () => { if (isStepValid()) setStep(s => Math.min(s + 1, 6)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const updateField = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Enter' && isStepValid() && step < 6 && !isPending) {
        if (step === 5) {
          const form = new FormData();
          Object.entries(formData).forEach(([k, v]) => form.append(k, v));
          React.startTransition(() => action(form));
        } else nextStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, formData, isPending]);

  useEffect(() => { if (state?.success) setStep(6); }, [state]);

  const valid = isStepValid();

  return (
    <div className="min-h-screen flex flex-col bg-surface" dir="rtl">

      {/* ── Header ── */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <LeafLogo className="text-primary w-5 h-5" />
            <span className="text-xl font-bold text-primary font-serif italic">صوت الفلاح</span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
            {step < 6 ? `خطوة ${step} من 5` : (
              <span className="flex items-center gap-1 text-primary font-bold">
                <Check className="w-4 h-4" /> اكتمل التسجيل
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center px-4 pt-10 pb-36">
        <div className="max-w-xl w-full space-y-10">

          {/* ── Progress Stepper ── */}
          {step < 6 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                {STEPS.map(({ Icon, label }, i) => {
                  const sNum = i + 1;
                  const isDone = sNum < step;
                  const isActive = sNum === step;
                  return (
                    <div key={sNum} className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDone    ? 'bg-primary text-on-primary' :
                        isActive  ? 'bg-primary/15 text-primary ring-2 ring-primary/40' :
                                    'bg-surface-container-highest text-on-surface-variant/40'
                      }`}>
                        {isDone
                          ? <Check className="w-4 h-4" />
                          : <Icon className="w-4 h-4" />
                        }
                      </div>
                      <span className={`text-[10px] font-bold hidden sm:block ${
                        isActive ? 'text-primary' : isDone ? 'text-on-surface-variant' : 'text-on-surface-variant/40'
                      }`}>{label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1.5 px-1">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-surface-container-highest'}`} />
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP 1 ══ */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-3 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
                  <HandMetal className="w-7 h-7" />
                </div>
                <h1 className="text-headline-md text-primary">لنبدأ بالأساسيات</h1>
                <p className="text-body-lg text-on-surface-variant">ساعدنا في تخصيص تجربتك على المنصة</p>
              </div>

              <div className="bg-surface-container rounded-3xl p-6 md:p-10 shadow-sm border border-outline-variant/30 space-y-8">

                {/* Full name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-label-large text-primary/80">
                    <BadgeCheck className="w-4 h-4" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                    placeholder="أدخل اسمك الكامل..."
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                  />
                </div>

                {/* Role */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-label-large text-primary/80">
                    <LayoutGrid className="w-4 h-4" />
                    نوع الحساب
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'farmer',   label: 'فلاح',   Icon: Sprout,          sub: 'مزارع وإنتاج' },
                      { id: 'merchant', label: 'تاجر',   Icon: Store,           sub: 'بيع وتوزيع' },
                      { id: 'buyer',    label: 'مشتري',  Icon: ShoppingBasket,  sub: 'شراء مباشر' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => updateField('role', r.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl transition-all border-2 ${
                          formData.role === r.id
                            ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                            : 'bg-surface-container-high text-on-surface-variant border-transparent hover:border-outline-variant hover:bg-surface-container-highest'
                        }`}
                      >
                        <r.Icon className="w-7 h-7" />
                        <span className="text-title-sm font-bold">{r.label}</span>
                        <span className={`text-[10px] hidden sm:block ${formData.role === r.id ? 'opacity-70' : 'text-on-surface-variant/60'}`}>{r.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-label-large text-primary/80">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف
                    <span className="text-[10px] text-on-surface-variant/60 font-normal">(اختياري)</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all text-body-lg font-medium placeholder:text-on-surface-variant/40"
                    placeholder="5x xxx xxx"
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 ══ */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="text-center space-y-3 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
                  <MapPin className="w-7 h-7" />
                </div>
                <h1 className="text-headline-md text-primary">أين يتركز نشاطك؟</h1>
                <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">
                  يساعدنا تحديد موقعك في تقديم فرص السوق المحلية الأنسب لك.
                </p>
              </div>

              <div className="bg-surface-container rounded-3xl p-6 md:p-10 shadow-sm border border-outline-variant/30 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-label-large text-primary/80">
                    <Map className="w-4 h-4" />
                    الولاية
                  </label>
                  <select
                    className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all text-body-lg font-medium cursor-pointer"
                    value={formData.governorateId}
                    onChange={(e) => updateField('governorateId', e.target.value)}
                  >
                    <option value="">اختر الولاية...</option>
                    {governorates.map(g => (
                      <option key={g.id} value={g.id}>{g.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-label-large text-primary/80">
                    <Milestone className="w-4 h-4" />
                    المنطقة / المعتمدية
                    <span className="text-[10px] text-on-surface-variant/60 font-normal">(اختياري)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all text-body-lg font-medium placeholder:text-on-surface-variant/40"
                    placeholder="مثال: معتمدية الأريانة..."
                    value={formData.region}
                    onChange={(e) => updateField('region', e.target.value)}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 flex items-start gap-3 border-r-4 border-primary">
                  <Compass className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-body-md text-on-surface font-medium leading-relaxed">
                    سيتم تحديد أقرب الأسواق والمشترين تلقائياً بناءً على موقعك.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 3 ══ */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Heading */}
              <div className="text-center space-y-3 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <h1 className="text-headline-md text-primary">أخبرنا عن مجال عملك</h1>
                <p className="text-body-lg text-on-surface-variant max-w-sm mx-auto">
                  اختر النشاط الذي يصف عملك بشكل أدق — هذا يساعدنا في إظهار أفضل الفرص لك.
                </p>
              </div>

              {/* Selection counter badge */}
              <div className="flex items-center justify-between px-1">
                <span className="text-label-large text-on-surface-variant">
                  {activityTypes.length} خيار متاح
                </span>
                {formData.activityTypeId && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-label-large font-bold animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4" />
                    تم الاختيار
                  </div>
                )}
              </div>

              {/* Activity list */}
              <div className="space-y-3">
                {activityTypes.map((type, idx) => {
                  const ActivityIcon = ACTIVITY_ICONS[idx % ACTIVITY_ICONS.length];
                  const isSelected = formData.activityTypeId === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateField('activityTypeId', type.id)}
                      className={`w-full text-right flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 border-2 group ${
                        isSelected
                          ? 'bg-primary/8 border-primary shadow-sm shadow-primary/10'
                          : 'bg-surface-container border-transparent hover:bg-surface-container-high hover:border-outline-variant/60'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                          : 'bg-surface-container-highest text-primary group-hover:bg-primary/10'
                      }`}>
                        <ActivityIcon className="w-5 h-5" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-title-md font-bold leading-tight ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {type.name_ar}
                        </p>
                        {type.description && (
                          <p className="text-body-sm text-on-surface-variant mt-0.5 leading-relaxed line-clamp-2">
                            {type.description}
                          </p>
                        )}
                      </div>

                      {/* Radio indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-outline-variant group-hover:border-primary/50'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-on-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Helper tip */}
              {!formData.activityTypeId && (
                <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 flex items-start gap-3 animate-in fade-in duration-300">
                  <Info className="w-4 h-4 text-on-surface-variant shrink-0 mt-0.5" />
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    يمكنك تغيير نشاطك في أي وقت من إعدادات الملف الشخصي.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 4 ══ */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="text-center space-y-3 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
                  <UserCircle2 className="w-7 h-7" />
                </div>
                <h1 className="text-headline-md text-primary">ملفك الشخصي الموثوق</h1>
                <p className="text-body-lg text-on-surface-variant">الصورة والنبذة تزيد من فرص تواصلك مع الآخرين بنسبة 80%</p>
              </div>

              <div className="bg-surface-container rounded-3xl p-6 md:p-10 shadow-sm border border-outline-variant/30 space-y-10">
                <AvatarUpload
                  userId={user.id}
                  onUploadComplete={(url: string) => updateField('avatarUrl', url)}
                  initialUrl={formData.avatarUrl}
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="flex items-center gap-2 text-label-large text-primary/80">
                      <TextCursorInput className="w-4 h-4" />
                      نبذة تعريفية
                    </label>
                    <span className="text-[10px] text-on-surface-variant/60 font-bold">اختياري</span>
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full bg-surface-container-high border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all text-body-lg font-medium resize-none min-h-[140px] placeholder:text-on-surface-variant/40"
                      placeholder="أخبرنا قليلاً عن شغفك بالزراعة أو ما يميز منتجاتك..."
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value.slice(0, 250))}
                    />
                    <span className="absolute bottom-4 left-5 text-xs text-primary/40 font-bold">{formData.bio.length}/250</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 flex items-start gap-3 border-r-4 border-primary">
                  <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-body-md text-on-surface font-medium leading-relaxed">
                    يُعطى الأولوية للملفات المكتملة في نتائج البحث والتوصيات.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 5 — Review ══ */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="text-center space-y-3 px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2">
                  <ClipboardCheck className="w-7 h-7" />
                </div>
                <h1 className="text-headline-md text-primary">راجع بياناتك</h1>
                <p className="text-body-lg text-on-surface-variant">تأكد من صحة المعلومات قبل الانضمام للمجتمع.</p>
              </div>

              <div className="bg-surface-container rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 space-y-4">
                {/* Name */}
                <ReviewRow
                  Icon={BadgeCheck}
                  label="الاسم الكامل"
                  value={formData.fullName}
                  onEdit={() => setStep(1)}
                />
                {/* Role */}
                <ReviewRow
                  Icon={formData.role === 'farmer' ? Sprout : formData.role === 'merchant' ? Store : ShoppingBasket}
                  label="نوع الحساب"
                  value={ROLE_LABELS[formData.role] ?? '—'}
                  onEdit={() => setStep(1)}
                />
                {/* Location */}
                <ReviewRow
                  Icon={MapPin}
                  label="الموقع والجهة"
                  value={`${governorates.find(g => g.id === formData.governorateId)?.name_ar ?? '—'}${formData.region ? `، ${formData.region}` : ''}`}
                  onEdit={() => setStep(2)}
                />
                {/* Activity */}
                <ReviewRow
                  Icon={LayoutGrid}
                  label="النشاط الرئيسي"
                  value={activityTypes.find(a => a.id === formData.activityTypeId)?.name_ar ?? '—'}
                  onEdit={() => setStep(3)}
                />
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 flex items-start gap-3 border-r-4 border-primary">
                <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-body-md text-on-surface font-medium leading-relaxed">
                  بالتأكيد، ستنشئ ملفك الشخصي وتنضم للمجتمع. يمكنك تعديل بياناتك لاحقاً.
                </p>
              </div>
            </div>
          )}

          {/* ══ STEP 6 — Success ══ */}
          {step === 6 && (
            <div className="space-y-10 text-center animate-in zoom-in duration-700 py-6">
              <div className="relative mx-auto w-44 h-44">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-surface-container shadow-xl border-4 border-surface-container-high flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-inner">
                    <CheckCheck className="w-16 h-16 text-on-primary animate-in slide-in-from-bottom-4 duration-700" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-4">
                <h1 className="text-display-sm text-primary font-serif italic">أنت جاهز تمامًا!</h1>
                <p className="text-body-lg text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  لقد اكتمل ملفك الشخصي بنجاح. أهلاً بك في صوت الفلاح.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 px-4">
                {[
                  { Icon: Store,          label: 'السوق المحلي'    },
                  { Icon: MessageSquare,  label: 'مجتمع الفلاحين' },
                  { Icon: TrendingUp,     label: 'أسعار السوق'    },
                  { Icon: Bell,           label: 'تنبيهات فورية'  },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-label-large">{label}</span>
                  </div>
                ))}
              </div>

              <div className="max-w-xs mx-auto pt-2">
                <Link href="/">
                  <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-full text-title-md font-bold shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all">
                    <span>المتابعة إلى الرئيسية</span>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Error */}
          {state?.error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 text-error mt-6">
              <Info className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-body-md font-medium">{state.error}</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer Nav ── */}
      {step < 6 && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-6 pb-8 pt-5 bg-surface/90 backdrop-blur-md border-t border-outline-variant/20">
          <div className="max-w-xl w-full flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-full text-title-sm transition-all ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-on-surface-variant hover:bg-surface-container-highest active:scale-95'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </button>

            <button
              type="button"
              onClick={step === 5 ? () => {
                const form = new FormData();
                Object.entries(formData).forEach(([k, v]) => form.append(k, v));
                React.startTransition(() => action(form));
              } : nextStep}
              disabled={isPending || !valid}
              className={`flex items-center justify-center gap-2 px-10 py-3.5 rounded-full text-title-md font-bold transition-all min-w-[150px] ${
                isPending || !valid
                  ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'
                  : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95'
              }`}
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>{step === 5 ? 'تأكيد وإكمال' : 'التالي'}</span>
                  {step === 5
                    ? <CheckCircle2 className="w-4 h-4" />
                    : <ArrowLeft className="w-4 h-4" />
                  }
                </>
              )}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

// ── Shared Review Row ──────────────────────────────
function ReviewRow({ Icon, label, value, onEdit }: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-container-high rounded-2xl">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-label-small text-on-surface-variant">{label}</p>
        <p className="text-title-md font-bold truncate">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="flex items-center gap-1 text-primary text-sm font-bold hover:underline shrink-0">
        <Pencil className="w-3.5 h-3.5" />
        تعديل
      </button>
    </div>
  );
}
