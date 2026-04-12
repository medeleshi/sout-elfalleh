'use client';

import React, { useRef, useTransition, useState, useEffect } from 'react';
import { PublishingShell } from '@/components/publishing/PublishingShell';
import { FormField } from '@/components/publishing/FormField';
import { ImagePicker } from '@/components/publishing/ImagePicker';
import { createListingAction } from '@/lib/listings/actions';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

interface CreateListingFormProps {
  categories: any[];
  units: any[];
  governorates: any[];
  categoryUnits: any[];
}

export function CreateListingForm({ categories, units, governorates, categoryUnits }: CreateListingFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Filter units based on category
  const filteredUnits = selectedCategoryId 
    ? units.filter(u => categoryUnits.some(cu => cu.category_id === selectedCategoryId && cu.unit_id === u.id))
    : units;

  // Fallback: if selected category has no units mapped, show all units to prevent broken UX
  const displayUnits = (selectedCategoryId && filteredUnits.length === 0) ? units : filteredUnits;

  // Prevent catastrophic runtime navigations or tab closing while an active network payload is uploading
  useEffect(() => {
    if (!isPending) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Required for legacy browsers to show confirmation dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPending]);

  const handleAction = async (formData: FormData) => {
    setError(null);
    const result = await createListingAction(formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/listings/${result.id}`);
    }
  };

  return (
    <form action={handleAction} ref={formRef}>
      <PublishingShell
        title="إضافة عرض جديد"
        subtitle="قم بعرض محاصيلك ومنتجاتك للبيع"
        type="listing"
        onCancel={() => window.history.back()}
        isSubmitting={isPending}
        submittingLabel="جاري الحفظ ورفع الصور..."
        onPrimaryAction={() => {
          if (formRef.current && !isPending) {
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
      {/* Product Identity */}
      <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-1.5 h-8 bg-primary rounded-full transition-all group-hover:h-10" />
           <h3 className="text-xl font-black text-on-surface italic font-serif">هوية المنتج</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <FormField 
            label="ما الذي تبيعه اليوم؟" 
            hint="العناوين الواضحة التي تشمل المنطقة والجودة تجذب المشترين أسرع." 
            required
          >
            <input 
              type="text" 
              name="title"
              placeholder="مثال: تمور دقلة النور قبلي 'عرجون'"
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner"
            />
          </FormField>

          <FormField label="تصنيف المنتج" hint="التصنيف الدقيق يضعك أمام المشتري الصحيح." required>
            <select 
              name="category_id" 
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat"
            >
              <option value="">اختر الفئة...</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_ar}</option>)}
            </select>
          </FormField>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <FormField label="الكمية الجاهزة للتسليم" hint="كن صادقاً في الكمية لتجنب إلغاء الطلبات لاحقاً." required>
              <input 
                type="number" 
                name="quantity"
                placeholder="0"
                className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner text-center"
              />
            </FormField>

            <FormField label="وحدة القياس" hint="توحيد القياس يسهل المقارنة للمشتري." required>
              <select name="unit_id" className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-black outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_20px_center] bg-no-repeat text-primary/80">
                <option value="">اختر الوحدة...</option>
                {displayUnits.map(u => <option key={u.id} value={u.id}>{u.name_ar}</option>)}
              </select>
            </FormField>
          </div>


          <FormField label="السعر المقترح (TND)" hint="الأسعار الواقعية تسرّع الاتفاق. اتركه فارغاً للتفاوض.">
            <div className="relative">
              <input 
                type="text" 
                name="price"
                placeholder="0.00"
                className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 pl-16 text-sm font-medium outline-none transition-all shadow-inner text-left"
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">TND</span>
            </div>
          </FormField>
        </div>
      </div>

      {/* Media Upload */}
      <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-1.5 h-8 bg-primary rounded-full transition-all" />
           <h3 className="text-xl font-black text-on-surface italic font-serif">الإعلام والتوثيق</h3>
        </div>
        
        <FormField label="أضف صوراً واقعية للمحصول" hint="الصور في ضوء النهار الطبيعي تبني ثقة فورية مع المشترين.">
          <ImagePicker presetName="listing" />
        </FormField>
      </div>

      {/* Description & Quality */}
      <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-1.5 h-8 bg-primary rounded-full transition-all" />
           <h3 className="text-xl font-black text-on-surface italic font-serif">تفاصيل الجودة</h3>
        </div>

        <FormField label="صف جودة منتجك بالتفصيل" hint="هذا هو 'حديث البيع' الخاص بك. اذكر المميزات الفريدة مثل (سقي بئر، جني يدوي، عضوي).">
          <textarea 
            rows={5}
            name="description"
            placeholder="مثال: محصول طبيعي 100%، تم جنيه حديثاً وبجودة عالية، حموضة أقل من 0.5%..."
            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-3xl px-6 py-4 text-sm font-medium outline-none transition-all shadow-inner resize-none"
          />
        </FormField>

        <FormField label="أين يوجد المنتج حالياً؟" hint="القرب الجغرافي عامل أساسي في قرار الشراء وتقليل تكاليف النقل." required>
          <select name="governorate_id" className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat">
            <option value="">اختر الولاية...</option>
            {governorates.map(gov => <option key={gov.id} value={gov.id}>{gov.name_ar}</option>)}
          </select>
        </FormField>
      </div>
      </PublishingShell>
    </form>
  );
}
