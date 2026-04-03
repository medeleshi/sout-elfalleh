'use client';

import React, { useState } from 'react';
import { PublishingShell } from '@/components/publishing/PublishingShell';
import { FormField } from '@/components/publishing/FormField';
import { POST_CATEGORIES } from '@/lib/constants/post-categories';
import { updatePostAction, deletePostAction } from '@/lib/posts/actions';
import { useRouter } from 'next/navigation';
import { HelpCircle, MessageCircle, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EditPostFormProps {
  post: any;
  governorates: { id: string; name_ar: string }[];
}

export function EditPostForm({ post, governorates }: EditPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<'updated' | 'deleted' | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: post.title || '',
    content: post.content || '',
    type: post.type || 'question',
    categoryId: post.category_id || '',
    governorateId: post.governorate_id || '',
    images: post.images || [],
  });

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value?.toString() || '');
      }
    });

    const result = await updatePostAction(post.id, fd);
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

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setIsSubmitting(true);
    const result = await deletePostAction(post.id);
    if (result.success) {
      setSuccess('deleted');
      setTimeout(() => {
        router.push('/activity');
        router.refresh();
      }, 1500);
    } else {
      setError(result.error || 'حدث خطأ أثناء حذف المنشور.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    const isQuestion = formData.type === 'question';
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in" dir="rtl">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-on-surface mb-4">
          {success === 'deleted' ? 'تم الحذف بنجاح' : (isQuestion ? 'تم تحديث السؤال' : 'تم تحديث المنشور')}
        </h2>
        <p className="text-on-surface-variant font-medium max-w-sm mx-auto">
          {success === 'deleted' ? 'تمت إزالة مشاركتك من المجتمع بنجاح.' : 
           'شكراً لمشاركتك الإيجابية في مجتمع صوت الفلاح! يتم الآن تحويلك...'}
        </p>
      </div>
    );
  }

  return (
    <PublishingShell
      title={formData.type === 'question' ? 'تعديل السؤال' : 'تعديل المنشور'}
      subtitle="قم بتحديث مشاركتك لتكون أكثر وضوحاً وفائدة للمجتمع"
      type={formData.type === 'question' ? 'question' : 'post'}
      isSubmitting={isSubmitting}
      onCancel={() => router.back()}
      primaryActionLabel="حفظ التغييرات"
      onPrimaryAction={handleSave}
      secondaryActions={
        <div className="flex gap-2">
          <button 
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

      <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
        {/* Post Type Selection */}
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-1.5 h-8 bg-primary rounded-full" />
             <h3 className="text-xl font-black text-on-surface italic font-serif">نوع المشاركة</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'question' })}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all ${
                formData.type === 'question' 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm scale-[1.02]' 
                  : 'border-transparent bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <HelpCircle className="w-8 h-8" />
              <span className="font-bold text-sm">سؤال زراعي</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'discussion' })}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all ${
                formData.type === 'discussion' 
                  ? 'border-secondary bg-secondary/5 text-secondary-dark shadow-sm scale-[1.02]' 
                  : 'border-transparent bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <MessageCircle className="w-8 h-8" />
              <span className="font-bold text-sm">نقاش / خبرة</span>
            </button>
          </div>
        </div>

        <div className="h-px bg-outline-variant/10 w-full" />

        {/* Categories and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <FormField label="التصنيف" required>
            <select 
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat"
            >
              <option value="">اختر الفئة...</option>
              {POST_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>
          </FormField>

          <FormField label="المنطقة (اختياري)">
            <select 
              value={formData.governorateId}
              onChange={(e) => setFormData({ ...formData, governorateId: e.target.value })}
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat"
            >
              <option value="">كل الولايات</option>
              {governorates.map(gov => <option key={gov.id} value={gov.id}>{gov.name_ar}</option>)}
            </select>
          </FormField>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-6">
          <FormField label="العنوان" required>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: مشكلة في اصفرار أوراق الليمون"
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner"
            />
          </FormField>

          <FormField 
            label={formData.type === 'question' ? 'تفاصيل السؤال' : 'محتوى المنشور'} 
            required
          >
            <textarea 
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={formData.type === 'question' ? 'اشرح مشكلتك بالتفصيل...' : 'شارك خبرتك مع المجتمع...'}
              className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-3xl px-6 py-4 text-sm font-medium outline-none transition-all shadow-inner resize-none"
            />
          </FormField>
        </div>
      </div>
    </PublishingShell>
  );
}
