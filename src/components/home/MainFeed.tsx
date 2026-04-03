import React from "react";
import { getFeedItems } from "@/lib/data/get-feed-items";
import FeedCard from "./FeedCard";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default async function MainFeed() {
  const items = await getFeedItems();

  if (!items || items.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-[2.5rem] p-12 text-center border border-outline-variant/5">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">ليس هناك نشاط حالياً</h3>
        <p className="text-on-surface-variant text-sm mb-8 max-w-xs mx-auto">
          كن أول من يضيف عرضاً أو طلباً في منطقتك لتبدأ الحركة التجارية.
        </p>
        <Link 
          href={ROUTES.LISTINGS_NEW}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          <span>أضف عرضك الأول</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold text-on-surface">آخر العروض والطلبات</h2>
        </div>
        <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/5 rounded-full">
          {items.length} نتائج جديدة
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item, index) => (
          <React.Fragment key={`${item.type}-${item.id}`}>
            <FeedCard item={item} />
            
            {/* Inline Recommendation Module - PRD 11.1 Section 6 */}
            {index === 1 && (
              <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-on-surface mb-2">تجار موثوقون بالقرب منك</h4>
                <p className="text-xs text-on-surface-variant font-medium mb-6">اكتشف بائعين معتمدين في ولايتك تم التحقق من هويتهم.</p>
                <button className="px-6 py-3 bg-primary text-on-primary rounded-2xl text-xs font-black shadow-lg shadow-primary/10 hover:scale-105 transition-all">
                  عرض القائمة
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Load More Button Placeholder */}
      <div className="pt-8 text-center">
        <button className="px-8 py-4 bg-surface-container-high text-on-surface-variant rounded-2xl font-bold text-sm hover:bg-primary hover:text-on-primary transition-all shadow-sm">
          تحميل المزيد من النتائج
        </button>
      </div>
    </div>
  );
}
