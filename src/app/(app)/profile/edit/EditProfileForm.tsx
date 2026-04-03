// src/app/(app)/profile/edit/EditProfileForm.tsx
'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction } from '@/lib/auth/actions';
import { AvatarUpload } from '@/app/onboarding/AvatarUpload';
import { 
  User, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Save, 
  X,
  BadgeCheck,
  Phone,
  LayoutGrid,
  TextCursorInput,
  Info,
  Sprout,
  Store,
  ShoppingBasket
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

interface EditProfileFormProps {
  initialData: any;
  governorates: any[];
  activityTypes: any[];
}

export function EditProfileForm({ initialData, governorates, activityTypes }: EditProfileFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(updateProfileAction, null);
  
  const [formData, setFormData] = useState({
    fullName: initialData.full_name || "",
    role: initialData.role || "",
    bio: initialData.bio || "",
    phone: initialData.phone || "",
    governorateId: initialData.governorate_id || "",
    activityTypeId: initialData.activity_type_id || "",
    avatarUrl: initialData.avatar_url || "",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (state?.success) {
      router.push(ROUTES.PROFILE);
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => form.append(k, v));
    React.startTransition(() => action(form));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* 1. Identity Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-primary">
           <User className="w-5 h-5" />
           <h2 className="text-xl font-black">المعلومات الشخصية</h2>
        </div>
        
        <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 p-8 space-y-8 shadow-sm">
           <AvatarUpload 
             userId={initialData.id}
             initialUrl={formData.avatarUrl}
             onUploadComplete={(url) => updateField('avatarUrl', url)}
           />

           <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">الاسم الكامل</label>
              <div className="relative group">
                 <BadgeCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/20 group-focus-within:text-primary transition-colors" />
                 <input 
                   type="text" 
                   value={formData.fullName}
                   onChange={(e) => updateField('fullName', e.target.value)}
                   className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pr-12 pl-6 focus:border-primary/20 focus:bg-white transition-all font-black text-on-surface outline-none"
                   placeholder="الاسم الثلاثي..."
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">النبذة التعريفية</label>
              <div className="relative">
                 <TextCursorInput className="absolute right-4 top-4 w-5 h-5 text-on-surface-variant/20" />
                 <textarea 
                   value={formData.bio}
                   onChange={(e) => updateField('bio', e.target.value)}
                   className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pr-12 pl-6 focus:border-primary/20 focus:bg-white transition-all font-medium text-on-surface outline-none min-h-[120px] resize-none"
                   placeholder="أخبر المستخدمين عن مجال عملك وخبرتك..."
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">رقم الهاتف التواصل</label>
              <div className="relative group">
                 <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/20 group-focus-within:text-primary transition-colors" />
                 <input 
                   type="tel" 
                   value={formData.phone}
                   onChange={(e) => updateField('phone', e.target.value)}
                   className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pr-12 pl-6 focus:border-primary/20 focus:bg-white transition-all font-black text-on-surface outline-none"
                   placeholder="5x xxx xxx"
                   dir="ltr"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* 2. Professional Details */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-primary">
           <Briefcase className="w-5 h-5" />
           <h2 className="text-xl font-black">التصنيف المهني</h2>
        </div>

        <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 p-8 space-y-8 shadow-sm">
           <div className="space-y-4">
              <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">نوع الحساب / الدور</label>
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { id: 'farmer', label: 'فلاح', Icon: Sprout },
                   { id: 'merchant', label: 'تاجر', Icon: Store },
                   { id: 'buyer', label: 'مشتري', Icon: ShoppingBasket },
                 ].map((r) => (
                   <button
                     key={r.id}
                     type="button"
                     onClick={() => updateField('role', r.id)}
                     className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                       formData.role === r.id 
                         ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/20' 
                         : 'bg-surface-container-low border-transparent text-on-surface-variant hover:border-outline-variant'
                     }`}
                   >
                     <r.Icon className="w-6 h-6" />
                     <span className="text-xs font-black">{r.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">النشاط الرئيسي</label>
              <div className="relative">
                 <LayoutGrid className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/20" />
                 <select 
                   value={formData.activityTypeId}
                   onChange={(e) => updateField('activityTypeId', e.target.value)}
                   className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pr-12 pl-6 focus:border-primary/20 focus:bg-white transition-all font-black text-on-surface outline-none appearance-none cursor-pointer"
                 >
                    <option value="">اختر النشاط الأصلي...</option>
                    {activityTypes.map(a => (
                      <option key={a.id} value={a.id}>{a.name_ar}</option>
                    ))}
                 </select>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Location Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-primary">
           <MapPin className="w-5 h-5" />
           <h2 className="text-xl font-black">الموقع الجغرافي</h2>
        </div>

        <div className="bg-white rounded-[2.5rem] border-2 border-outline-variant/30 p-8 space-y-4 shadow-sm">
           <div className="space-y-2">
              <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest px-1">المجاورة / المحافظة</label>
              <div className="relative">
                 <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/20" />
                 <select 
                   value={formData.governorateId}
                   onChange={(e) => updateField('governorateId', e.target.value)}
                   className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-4 pr-12 pl-6 focus:border-primary/20 focus:bg-white transition-all font-black text-on-surface outline-none appearance-none cursor-pointer"
                 >
                    <option value="">اختر الولاية...</option>
                    {governorates.map(g => (
                      <option key={g.id} value={g.id}>{g.name_ar}</option>
                    ))}
                 </select>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Trust & Security info */}
      <section className="p-6 bg-surface-container-low rounded-[2rem] border-2 border-dashed border-outline-variant/40 flex items-start gap-4">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-black text-on-surface">إشارات الموثوقية</h4>
            <p className="text-xs font-medium text-on-surface-variant/60 leading-relaxed italic">
               يتم عرض تاريخ انضمامك وحالة التحقق تلقائياً في صفحة ملفك الشخصي لتعزيز الثقة في التعاملات التجارية.
            </p>
         </div>
      </section>

      {/* Error Message */}
      {state?.error && (
        <div className="p-5 bg-error/5 border-2 border-error/10 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
           <Info className="w-6 h-6 text-error shrink-0" />
           <p className="text-sm font-black text-error">{state.error}</p>
        </div>
      )}

      {/* 5. Sticky Actions Bar (Mobile) / Absolute (Desktop) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 p-6 z-50 md:sticky md:bottom-8 md:rounded-[2.5rem] md:border-2 md:shadow-2xl">
         <div className="max-w-2xl mx-auto flex items-center gap-4">
            <button 
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-primary text-on-primary rounded-2xl py-4 font-black flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
               {isPending ? (
                 <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
               ) : (
                 <>
                   <Save className="w-5 h-5" />
                   حفظ التغييرات
                 </>
               )}
            </button>
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-4 bg-surface-container-high text-on-surface-variant rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-surface-container-highest active:scale-95 transition-all"
            >
               <X className="w-5 h-5" />
               <span className="hidden sm:inline">إلغاء</span>
            </button>
         </div>
      </div>
    </form>
  );
}
