'use client';

import React, { useState } from 'react';
import { PublishingShell } from '@/components/publishing/PublishingShell';
import { FormField } from '@/components/publishing/FormField';
import { MessageCircle, HelpCircle, Image as ImageIcon } from 'lucide-react';

export default function CreatePostPage() {
  const [postType, setPostType] = useState<'question' | 'discussion'>('question');

  return (
    <PublishingShell
      title="مشاركة في المجتمع"
      subtitle="اسأل الخبراء أو شارك معارفك الزراعية"
      type={postType === 'question' ? 'question' : 'post'}
      onCancel={() => window.history.back()}
    >
      <div className="bg-white border border-outline-variant/10 rounded-[2.5rem] p-6 lg:p-10 space-y-8 shadow-sm">
        
        {/* Post Type Selection */}
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-1.5 h-8 bg-primary rounded-full" />
             <h3 className="text-xl font-black text-on-surface italic font-serif">نوع المشاركة</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPostType('question')}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all ${
                postType === 'question' 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm scale-[1.02]' 
                  : 'border-transparent bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <HelpCircle className="w-8 h-8" />
              <span className="font-bold text-sm">سؤال زراعي</span>
            </button>
            <button
              onClick={() => setPostType('discussion')}
              className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all ${
                postType === 'discussion' 
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
          <FormField label="التصنيف" hint="اختيار التصنيف الصحيح يوصل مشاركتك للفلاحين المهتمين." required>
            <select className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat">
              <option value="">اختر الفئة...</option>
              <option value="diseases">أمراض وحشرات</option>
              <option value="farming">طرق زراعة</option>
              <option value="market">أسعار السوق</option>
              <option value="irrigation">ري وتسميد</option>
            </select>
          </FormField>

          <FormField label="المنطقة (اختياري)" hint="يساعد إذا كانت مشكلتك الزراعية متعلقة بمنطقتك.">
            <select className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 text-sm font-medium outline-none transition-all shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[position:left_24px_center] bg-no-repeat">
              <option value="">كل الولايات</option>
              <option value="tunis">تونس العاصمة</option>
              <option value="sfax">صفاقس</option>
              <option value="sousse">سوسة</option>
              <option value="sidibouzid">سيدي بوزيد</option>
            </select>
          </FormField>
        </div>

        {/* Main Text Content */}
        <div className="grid grid-cols-1 gap-6">
          <FormField 
            label={postType === 'question' ? 'ما هو سؤالك؟' : 'شارك أفكارك أو خبراتك مع المجتمع'} 
            hint={postType === 'question' ? 'حاول تقديم تفاصيل كافية ليتمكن الخبراء من مساعدتك.' : 'المحتوى الإيجابي والخبرات ترفع من مستوى المجتمع ويجلب التفاعلات.'}
            required
          >
            <textarea 
              rows={6}
              placeholder={postType === 'question' ? 'مثال: السلام عليكم، لاحظت اصفرار على أوراق شجر الليمون، هل من نصيحة للعلاج؟...' : 'مثال: تجربتي الناجحة في التخفيض من استهلاك المياه عن طريق الري قطرة قطرة...'}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-3xl px-6 py-4 text-sm font-medium outline-none transition-all shadow-inner resize-none"
            />
          </FormField>

          <FormField label="إرفاق صورة (اختياري)" hint="الصورة توضح مشكلتك الزراعية بدقة أسرع وتجذب اهتمام أكبر.">
            <div className="w-full border-2 border-dashed border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest rounded-3xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group">
               <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
               </div>
               <div className="text-center">
                  <p className="text-sm font-bold text-on-surface">اضغط لرفع صورة أو اسحبها هنا</p>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">PNG, JPG حتى 5 ميغا بايت</p>
               </div>
            </div>
          </FormField>
        </div>

      </div>
    </PublishingShell>
  );
}
