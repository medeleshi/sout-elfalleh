'use client';

import React, { useRef, useTransition, useState } from 'react';
import { PublishingShell } from '@/components/publishing/PublishingShell';
import { FormField } from '@/components/publishing/FormField';
import { updateRequestAction } from '@/lib/requests/actions';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { type Tables } from '@/types/database';

interface EditRequestFormProps {
  request: any; // Using any due to Phase 1 type transition
  categories: { id: string; name_ar: string }[];
  units: { id: string; name_ar: string }[];
  governorates: { id: string; name_ar: string }[];
}

export function EditRequestForm({ request, categories, units, governorates }: EditRequestFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (formData: FormData) => {
    setError(null);
    const result = await updateRequestAction(request.id, formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/marketplace/requests/${request.id}`);
    }
  };

  return (
    <form action={handleAction} ref={formRef}>
      <PublishingShell
        title="تعديل طلب الشراء"
        subtitle="قم بتحديث تفاصيل ما تحتاجه"
        type="request"
        onCancel={() => window.history.back()}
        isSubmitting={isPending}
        onPrimaryAction={() => {
          if (formRef.current) {
            startTransition(() => {
              formRef.current?.requestSubmit();
            });
          }
        }}
      >
        {error && (
          <div className="bg-error/5 border border-error/20 rounded-2xl p-4 flex items-center gap-3 text-error text-sm font-black mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Need Details */}
        <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-1.5 h-8 bg-secondary rounded-full" />
             <h3 className="text-xl font-black text-on-surface italic font-serif">ما الذي تحتاجه؟</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <FormField 
              label="عنوان الطلب" 
              hint="الوضوح في الصنف يجذب المنتجين المتخصصين ويحسن دقة العروض." 
              required
            >
              <input 
                type="text" 
                name="title"
                defaultValue={request.title}
                placeholder="مثال: مطلوب 2 طن بطاطا صنف 'سبونتا'"
                className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner"
              />
            </FormField>

            <FormField label="الصنف المطلوب" hint="يساعدنا في إرسال طلبك للفلاحين المناسبين." required>
              <select name="category_id" defaultValue={request.category_id} className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat text-on-surface">
                <option value="">اختر الفئة...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_ar}</option>)}
              </select>
            </FormField>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <FormField label="الكمية المطلوبة" hint="حدد أدنى كمية تقبلها لتوسيع خياراتك من الموردين." required>
                <input 
                  type="number" 
                  name="quantity"
                  defaultValue={request.quantity}
                  placeholder="0"
                  className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner text-center"
                />
              </FormField>

              <FormField label="وحدة القياس" hint="دقة الوحدة تمنع الأخطاء في عروض الأسعار." required>
                <select name="unit_id" defaultValue={request.unit_id} className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-black outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_20px_center] bg-no-repeat text-primary/80">
                  <option value="">اختر الوحدة...</option>
                  {units.map(u => <option key={u.id} value={u.id}>{u.name_ar}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="الميزانية التقديرية (TND)" hint="يساعد في تصفية العروض البعيدة عن قدرتك الشرائية.">
              <div className="relative">
                <input 
                  type="text" 
                  name="budget"
                  defaultValue={request.budget || ''}
                  placeholder="0.00"
                  className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 pl-16 text-sm font-medium outline-none transition-all shadow-inner text-left"
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">TND</span>
              </div>
            </FormField>
          </div>
        </div>

        {/* Logistics */}
        <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-1.5 h-8 bg-secondary rounded-full" />
             <h3 className="text-xl font-black text-on-surface italic font-serif">اللوجستيات</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <FormField label="أين تريد الاستلام؟" hint="عامل حاسم للفلاح لحساب تكلفة النقل وتحديد السعر." required>
              <select name="governorate_id" defaultValue={request.governorate_id} className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat text-on-surface">
                <option value="">اختر الولاية...</option>
                {governorates.map(gov => <option key={gov.id} value={gov.id}>{gov.name_ar}</option>)}
              </select>
            </FormField>

            <FormField label="متى تحتاج البضاعة؟" hint="يساعد الفلاح في ترتيب أولويات الجني والشحن لطلبك." required>
              <input 
                type="text" 
                name="urgency"
                defaultValue={request.urgency || ''}
                placeholder="مثال: خلال الأسبوع القادم، عاجل، قبل نهاية الشهر..."
                className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner"
              />
            </FormField>
          </div>
        </div>

        {/* Quality Conditions */}
        <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-1.5 h-8 bg-secondary rounded-full" />
             <h3 className="text-xl font-black text-on-surface italic font-serif">شروط الجودة</h3>
          </div>

          <FormField label="ذكر المواصفات المطلوبة بدقة" hint="الدقة هنا تجنبك عروضاً غير مناسبة وتسهل عليك الاختيار.">
            <textarea 
              rows={5}
              name="description"
              defaultValue={request.description || ''}
              placeholder="مثال: أبحث عن درجة أولى، حجم كبير، تعبئة في صناديق خشبية..."
              className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-3xl px-6 py-4 text-sm font-medium outline-none transition-all shadow-inner resize-none"
            />
          </FormField>
        </div>
      </PublishingShell>
    </form>
  );
}
