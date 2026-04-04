import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { type UserRole } from '@/types/database';
import { SearchAndFilter } from '@/components/marketplace/SearchAndFilter';
import { CategoryChips } from '@/components/marketplace/CategoryChips';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RequestCard } from '@/components/marketplace/RequestCard';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { EmptyMarketplace } from '@/components/marketplace/EmptyMarketplace';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Compass, 
  Star, 
  ArrowLeft, 
  ChevronLeft,
  Sparkles,
  Zap,
  ShieldCheck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { getMatchingDemand } from '@/lib/data/get-matching-demand';
import { getFeedItems, type FeedItem } from '@/lib/data/get-feed-items';

// Mock Data
const MOCK_LISTINGS = [
  { id: '1', title: 'بطاطا طازجة من فلاحي جندوبة', category: 'خضروات', price: 1200, quantity: 500, unit: 'كغ', location: 'جندوبة', image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?auto=format&fit=crop&q=80&w=400', isNegotiable: true, publisher: 'فلاح سليم', isVerified: true, createdAt: 'منذ ساعتين' },
  { id: '2', title: 'زيت زيتون بكر ممتاز - عصرة أولى', category: 'ألبان', price: 25, quantity: 100, unit: 'لتر', location: 'سوسة', image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc88b5?auto=format&fit=crop&q=80&w=400', publisher: 'معصرة الأمل', isVerified: true, createdAt: 'منذ 5 ساعات' },
  { id: '3', title: 'تمور دجلة نور ممتازة من قبلي', category: 'فواكه', price: 8500, quantity: 200, unit: 'كغ', location: 'قبلي', image: 'https://images.unsplash.com/photo-1588615419957-bf66d53c6b49?auto=format&fit=crop&q=80&w=400', publisher: 'واحة الخير', isVerified: true, createdAt: 'منذ 8 ساعات' },
];

const SPONSORED_LISTINGS = [
  { id: 's1', title: 'بذور قمـح ممتازة - صنف جديد عالي المردودية', category: 'حبوب', price: 150, quantity: 1000, unit: 'كغ', location: 'باجة', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400', publisher: 'توزيع فلاحي', isVerified: true, createdAt: 'مصلح إشهاري' }
];

export default async function MarketplacePage() {
  const profileData = await getCurrentProfile();
  const profile = profileData?.profile;
  const isFarmer = profile?.role === 'farmer';
  const governorateId = profile?.governorate_id || null;
  const governorateName = profile?.governorate_name_ar || 'تونس';

  // Real data fetching
  const matchingDemand = profile ? await getMatchingDemand(
    profile.id, 
    profile.activity_type_id || undefined, 
    governorateId || undefined
  ) : [];
  
  const allFeedItems = await getFeedItems(24);
  const marketplaceItems = allFeedItems.filter(item => 
     (item.type === 'listing' || item.type === 'purchase_request') && 
     item.status === 'active' // Public visibility enforcement
  );

  // Filter for nearby (demo logic)
  const nearbyItems = governorateId ? marketplaceItems.filter(item => 
    item.governorate_id === governorateId
  ).slice(0, 3) : marketplaceItems.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-32 pt-8 px-4 lg:px-8" dir="rtl">
      {/* 1. Personalized Header with role-based CTA */}
      <MarketplaceHeader role={(profile?.role as UserRole) || 'buyer'} />

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* 2. Search and advanced filters (Desktop Sidebar) */}
        <FilterSidebar />

        <div className="flex-1 w-full space-y-12">
          {/* 2. Search and advanced filters (Mobile/Tablet Controls) */}
          <div className="space-y-6">
            <SearchAndFilter />
            
            {/* Active Filter Chips (PRD: Feedback and State Clarity) */}
            <div className="flex flex-wrap items-center gap-3">
               <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black border border-primary/20 group hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
                  <span>الولاية: {governorateName}</span>
                  <X className="w-3.5 h-3.5" />
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-black shadow-lg shadow-primary/20 cursor-pointer">
                  <span>نوع المحتوى: {isFarmer ? 'طلبات شراء' : 'عروض بيع'}</span>
                  <X className="w-3.5 h-3.5" />
               </div>
               <button className="text-xs font-black text-on-surface-variant/40 hover:text-error transition-all uppercase tracking-widest px-2 py-2">
                 مسح الكل
               </button>
            </div>

            {/* 3. Category Chips */}
            <CategoryChips />
          </div>

          {/* 4. Recommended items row */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-black text-on-surface">مقترحات لك</h2>
               </div>
               <Link href="#" className="text-sm font-black text-primary hover:underline flex items-center gap-2">
                  <span>مشاهدة الكل</span>
                  <ChevronLeft className="w-4 h-4 mt-0.5" />
               </Link>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-6 -mx-1 px-1 scrollbar-hide snap-x">
               {marketplaceItems.slice(0, 5).map((item: FeedItem) => (
                 <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                    {item.type === 'purchase_request' ? <RequestCard request={item as any} /> : <ListingCard listing={item as any} />}
                 </div>
               ))}
            </div>
          </section>

          {/* 8. Sponsored but relevant commercial slots (Minority check: 1 slot) */}
          <section className="bg-surface-container-low rounded-[2.5rem] p-6 border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-center shadow-inner relative overflow-hidden">
             <div className="absolute top-2 left-6 bg-white/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase border border-outline-variant/30">إعلان ممول</div>
             <div className="w-full md:w-40 aspect-square rounded-2xl overflow-hidden shrink-0">
                <img src={SPONSORED_LISTINGS[0].image} className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                   <Zap className="w-4 h-4" />
                   <span>فرصة حصرية</span>
                </div>
                <h3 className="text-xl font-black text-on-surface leading-tight italic">{SPONSORED_LISTINGS[0].title}</h3>
                <p className="text-sm font-medium text-on-surface-variant/70 italic">بذور عالية الجودة لزيادة مردودية محصولك بنسبة 20% هذا الموسم.</p>
             </div>
             <Button className="w-full md:w-auto h-12 rounded-xl px-10 font-black shrink-0 shadow-lg">تعرف أكثر</Button>
          </section>

          {/* 6. Nearby opportunities */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-on-surface">فرص في {governorateName}</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {nearbyItems.map((item: FeedItem) => (
                item.type === 'purchase_request' ? <RequestCard key={item.id} request={item as any} /> : <ListingCard key={item.id} listing={item as any} />
              ))}
              {nearbyItems.length === 0 && (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-outline-variant/50 rounded-[2.5rem] bg-surface-container-lowest text-on-surface-variant/40 text-center flex-col gap-3 group hover:border-primary/30 transition-all cursor-pointer">
                   <div className="p-4 bg-white rounded-2xl shadow-sm text-outline-variant group-hover:scale-110 transition-transform">
                      <Compass className="w-8 h-8" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest leading-relaxed">كن أول من يضيف عرضاً<br/>في {governorateName}</p>
                </div>
              )}
            </div>
          </section>

          {/* 7. Matching demand section (Crucial for Farmers) */}
          {isFarmer && matchingDemand.length > 0 && (
            <section className="bg-primary/5 rounded-[3rem] p-10 border-2 border-primary/10 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black text-on-surface font-serif italic leading-tight">طلبات شراء تطابق محاصيلك</h2>
                     <p className="text-on-surface-variant/60 font-medium italic">بناءً على نشاطك، هؤلاء المشترون يبحثون عن منتجاتك:</p>
                  </div>
                  <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-primary/20 text-primary font-black hover:bg-primary/5">تخصيص التنبيهات</Button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {matchingDemand.map((req: any) => (
                    <RequestCard key={req.id} request={req as any} />
                  ))}
               </div>
            </section>
          )}

          {/* 5. Main listing grid or list */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-10">
                <button className="relative px-2 py-2 text-2xl font-black text-primary transition-all group">
                   {isFarmer ? 'طلبات نشطة' : 'أحدث العروض'}
                   <div className="absolute -bottom-[1px] left-0 right-0 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                </button>
                <button className="px-2 py-2 text-2xl font-black text-on-surface-variant/30 hover:text-on-surface transition-all">
                   الكل
                </button>
              </div>
              
              <div className="hidden lg:flex items-center gap-3 text-xs font-black text-on-surface-variant/40 tracking-widest uppercase">
                 <span>الترتيب:</span>
                 <select className="bg-transparent border-none outline-none font-black text-primary cursor-pointer appearance-none px-2 pr-4 bg-[url('https://api.iconify.design/lucide:chevron-down.svg?color=%231b6d39')] bg-no-repeat bg-[right_center]">
                    <option>الأحدث أولاً</option>
                    <option>الأقل سعراً</option>
                    <option>الأقرب جغفرافياً</option>
                 </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {marketplaceItems.map((item: FeedItem) => (
                item.type === 'purchase_request' ? <RequestCard key={item.id} request={item as any} /> : <ListingCard key={item.id} listing={item as any} />
              ))}
            </div>
            
            {/* 5. Pagination / Load More */}
            <div className="py-16 flex flex-col items-center gap-6">
               <div className="w-16 h-1 w-full bg-outline-variant/20 rounded-full max-w-[200px]" />
               <button className="px-14 py-5 bg-white border-2 border-outline-variant rounded-[2rem] font-black text-xl text-on-surface hover:border-primary hover:text-primary transition-all active:scale-[0.98] shadow-sm">
                 مشاهدة المزيد من الحصاد
               </button>
            </div>
          </section>

          {/* Zero Result Example (Conditional Placeholder) */}
          {/* 9. Zero-result and low-supply handling (PRD Implementation) */}
          <section className="py-20 flex flex-col items-center text-center space-y-10 border-2 border-dashed border-outline-variant/30 rounded-[3rem] bg-surface-container-lowest">
             <div className="space-y-4 max-w-md mx-auto">
                <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-outline-variant/40">
                   <ShoppingBag className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-on-surface">لم نجد حالياً نتائج مطابقة تماماً</h2>
                <p className="text-on-surface-variant/60 font-medium leading-relaxed italic">
                   جرب توسيع نطاق البحث أو تصفح مقترحاتنا البديلة من المناطق المجاورة.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-8">
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-outline-variant/30 hover:border-primary transition-all cursor-pointer group shadow-sm">
                   <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <MapPin className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-black text-on-surface mb-2">استكشاف المناطق المجاورة</h3>
                   <p className="text-sm font-medium text-on-surface-variant/60">عرض العروض المتوفرة في الكاف وسليانة وباجة.</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-outline-variant/30 hover:border-secondary transition-all cursor-pointer group shadow-sm">
                   <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                      <TrendingDown className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-black text-on-surface mb-2">أضف طلب شراء</h3>
                   <p className="text-sm font-medium text-on-surface-variant/60">أخبر التجار بما تبحث عنه وسيتصلون بك عند توفره.</p>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
