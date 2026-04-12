'use client';

import React, { useState, useRef, useTransition, useEffect } from 'react';
import { PublishingShell } from '@/components/publishing/PublishingShell';
import { FormField } from '@/components/publishing/FormField';
import { ImagePicker } from '@/components/publishing/ImagePicker';
import { updateListingAction, updateListingStatusAction, deleteListingAction } from '@/lib/listings/actions';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditListingFormProps {
  listing: any;
  categories: any[];
  units: any[];
  governorates: any[];
  categoryUnits: any[];
}

export function EditListingForm({ listing, categories, units, governorates, categoryUnits }: EditListingFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<'updated' | 'sold' | 'deleted' | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: listing.title || '',
    category_id: listing.category_id || '',
    quantity: listing.quantity || '',
    unit_id: listing.unit_id || '',
    price: listing.price || '',
    description: listing.description || '',
    governorate_id: listing.governorate_id || '',
    listing_images: listing.listing_images?.map((img: any) => img.storage_path) || listing.listing_images || [],
  });

  // Filter units based on category
  const filteredUnits = formData.category_id 
    ? units.filter(u => categoryUnits.some(cu => cu.category_id === formData.category_id && cu.unit_id === u.id))
    : units;

  // Fallback: if selected category has no units mapped, show all units to prevent broken UX
  const displayUnits = (formData.category_id && filteredUnits.length === 0) ? units : filteredUnits;

  // Prevent tab-close / refresh from interrupting an active upload
  useEffect(() => {
    const isActive = isSubmitting || isPending;
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting, isPending]);

  const handleAction = async (fd: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const result = await updateListingAction(listing.id, fd);
    if (result.success) {
      setSuccess('updated');
      setTimeout(() => {
        router.push('/activity');
        router.refresh();
      }, 2000);
    } else {
      setError(result.error || 'حدث خطأ غير متوقع.');
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    // Guard against concurrent submissions from other handlers (delete, status update)
    if (isSubmitting || isPending) return;
    if (formRef.current) {
      startTransition(() => {
        formRef.current?.requestSubmit();
      });
    }
  };

  const handleStatusUpdate = async (status: 'sold' | 'hidden') => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const result = await updateListingStatusAction(listing.id, status === 'sold' ? 'sold' : 'hidden' as any);
    if (result.success) {
      setSuccess(status === 'sold' ? 'sold' : 'updated');
      setTimeout(() => {
        router.push('/activity');
        router.refresh();
      }, 2000);
    } else {
      setError(result.error || 'حدث خطأ أثناء تحديث الحالة.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setIsSubmitting(true);
    const result = await deleteListingAction(listing.id);
    if (result.success) {
      setSuccess('deleted');
      setTimeout(() => {
        router.push('/activity');
        router.refresh();
      }, 1500);
    } else {
      setError(result.error || 'حدث خطأ أثناء حذف العرض.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in" dir="rtl">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-on-surface mb-4">
          {success === 'sold' ? 'مبروك على البيع!' : 
           success === 'deleted' ? 'تم الحذف بنجاح' : 'تم تحديث العرض بنجاح'}
        </h2>
        <p className="text-on-surface-variant font-medium max-w-sm mx-auto">
          {success === 'sold' ? 'لقد تم تحديث حالة العرض ليكون "تم البيع" بنجاح. نتمنى لك صفقات ناجحة أخرى!' : 
           'يتم الآن تحويلك إلى صفحة نشاطاتي...'}
        </p>
      </div>
    );
  }

  return (
    <form action={handleAction} ref={formRef}>
      <PublishingShell
        title="تعديل العرض"
        subtitle="قم بتحديث معلومات منتجك لزيادة فرص البيع"
        type="listing"
        isSubmitting={isSubmitting || isPending}
        onCancel={() => router.back()}
        primaryActionLabel="حفظ التغييرات"
        onPrimaryAction={handleSave}
        secondaryActions={
          <div className="flex gap-2">
            {listing.status === 'active' && (
              <Button 
                variant="outline" 
                type="button"
                className="flex-1 h-14 rounded-2xl font-black text-[13px] border-primary/20 text-primary hover:bg-primary/5 transition-all"
                onClick={() => handleStatusUpdate('sold')}
                disabled={isSubmitting}
              >
                <CheckCircle2 className="w-4 h-4 ml-2" />
                تم البيع
              </Button>
            )}
            <button 
              type="button"
              onClick={handleDelete}
              className="p-4 text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-2xl transition-all border border-outline-variant/30"
              disabled={isSubmitting}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        }
      >
        {error && (
          <div className="bg-error/5 border border-error/20 rounded-2xl p-4 flex items-center gap-3 text-error text-sm font-black mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Product Identity */}
        <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full transition-all" />
                <h3 className="text-xl font-black text-on-surface italic font-serif">هوية المنتج</h3>
             </div>
             {listing.status === 'sold' && (
               <div className="bg-success/5 text-success px-4 py-1.5 rounded-full text-[10px] font-black border border-success/20">تم البيع</div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <FormField 
              label="اسم المنتج" 
              hint="العناوين الدقيقة تساعد المشترين على العثور عليك." 
              required
            >
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: تمور دقلة النور قبلي"
                className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner"
              />
            </FormField>

            <FormField label="التصنيف" required>
              <select 
                name="category_id"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat"
              >
                <option value="">اختر الفئة...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_ar}</option>)}
              </select>
            </FormField>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <FormField label="الكمية" required>
                <input 
                  type="number" 
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner text-center"
                />
              </FormField>

              <FormField label="الوحدة" required>
                <select 
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                  className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-black outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_20px_center] bg-no-repeat text-primary/80"
                >
                  <option value="">اختر الوحدة...</option>
                  {displayUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.name_ar}</option>)}
                </select>
              </FormField>
            </div>


            <FormField label="السعر (TND)">
              <div className="relative">
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
            <ImagePicker existingImages={formData.listing_images} presetName="listing" />
          </FormField>
        </div>

        {/* Description & Location */}
        <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-1.5 h-8 bg-primary rounded-full transition-all" />
             <h3 className="text-xl font-black text-on-surface italic font-serif">تفاصيل الجودة والموقع</h3>
          </div>

          <FormField label="وصف المنتج">
            <textarea 
              rows={5}
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="مثال: محصول طبيعي، سقي بئر، جودة تصدير..."
              className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-3xl px-6 py-4 text-sm font-medium outline-none transition-all shadow-inner resize-none"
            />
          </FormField>

          <FormField label="الولاية" required>
            <select 
              name="governorate_id"
              value={formData.governorate_id}
              onChange={(e) => setFormData({ ...formData, governorate_id: e.target.value })}
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat"
            >
              <option value="">اختر الولاية...</option>
              {governorates.map(gov => <option key={gov.id} value={gov.id}>{gov.name_ar}</option>)}
            </select>
          </FormField>
        </div>
      </PublishingShell>
    </form>
  );
}
