// src/components/search/EmptySearch.tsx
import React from 'react';
import { SearchX, Lightbulb, Compass, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptySearch({ query }: { query: string }) {
  return (
    <div className="py-20 flex flex-col items-center text-center space-y-12 border-2 border-dashed border-outline-variant/30 rounded-[3rem] bg-surface-container-lowest px-6 overflow-hidden relative">
      {/* Decorative Ornaments */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

      <div className="space-y-4 max-w-md mx-auto relative z-10">
        <div className="w-24 h-24 bg-surface-container-low rounded-[2rem] flex items-center justify-center mx-auto text-outline-variant/30 shadow-inner">
          <SearchX className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-on-surface tracking-tight">لم نجد حالياً نتائج لـ "{query}"</h2>
        <p className="text-on-surface-variant/60 font-medium leading-relaxed italic">
          جرب توسيع نطاق البحث أو تصفح مقترحاتنا البديلة من المناطق المجاورة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        <div className="bg-white/80 backdrop-blur p-8 rounded-[3rem] border-2 border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer group shadow-xl shadow-surface-container-highest/20 hover:-translate-y-2 duration-500">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight">استكشاف المناطق المجاورة</h3>
          <p className="text-sm font-medium text-on-surface-variant/60 leading-relaxed italic">عرض العروض المتوفرة في الكاف وسليانة وباجة.</p>
        </div>
        <div className="bg-white/80 backdrop-blur p-8 rounded-[3rem] border-2 border-outline-variant/40 hover:border-secondary/40 transition-all cursor-pointer group shadow-xl shadow-surface-container-highest/20 hover:-translate-y-2 duration-500">
          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight">كيف تبحث بفعالية؟</h3>
          <p className="text-sm font-medium text-on-surface-variant/60 leading-relaxed italic">استخدم كلمات عامة مثل "بطاطا" أو "جرار" بدلاً من الجمل الطويلة.</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pt-8">
        <p className="text-xs font-black text-on-surface-variant/30 uppercase tracking-[0.3em] font-sans">أو جرب تصفح أقسام السوق</p>
        <div className="flex flex-wrap justify-center gap-4">
           {['خضروات', 'فواكه', 'ألبان', 'حبوب', 'مواشي'].map(cat => (
             <button key={cat} className="px-5 py-2.5 rounded-xl border border-outline-variant/50 text-xs font-black text-on-surface-variant hover:border-primary hover:text-primary transition-all">
               {cat}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
