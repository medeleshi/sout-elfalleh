import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { 
  MapPin, 
  Scale, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Share2, 
  MessageCircle, 
  Phone, 
  AlertCircle,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  Zap,
  Star,
  Info,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RequestCard } from '@/components/marketplace/RequestCard';

import { createClient } from '@/lib/supabase/server';
import { getMatchingDemand } from '@/lib/data/get-matching-demand';
import { notFound } from 'next/navigation';
import { getFreshnessInfo } from '@/lib/utils/freshness';

export default async function ListingDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const profileData = await getCurrentProfile();
  
  // 1. Fetch Main Listing
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id(full_name, avatar_url, role),
      categories:category_id(name_ar)
    `)
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const listing = data as any;

  // 2. Fetch Similar Listings (Same Category, excluding current)
  const { data: similarListings } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id(full_name)
    `)
    .eq('category_id', listing.category_id)
    .neq('id', listing.id)
    .eq('status', 'active')
    .limit(4);

  // 3. Fetch Matching Demand
  const matchingRequests = await getMatchingDemand(
    profileData?.user?.id || '',
    listing.category_id,
    listing.governorate_id,
    3
  );

  const isOwner = profileData?.user?.id === listing.user_id;
  const freshness = getFreshnessInfo(listing.created_at);

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8 space-y-12" dir="rtl">
      {/* 0. Breadcrumbs & Back */}
      <nav className="flex items-center gap-2 text-xs font-black text-on-surface-variant/40 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
         <Link href="/marketplace" className="hover:text-primary transition-colors flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            <span>السوق</span>
         </Link>
         <ChevronRight className="w-3 h-3 rotate-180" />
         <span className="text-on-surface-variant/60">{(listing as any).categories?.name_ar}</span>
         <ChevronRight className="w-3 h-3 rotate-180" />
         <span className="text-on-surface truncate max-w-[150px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Media & Description (60%) */}
        <div className="lg:col-span-8 space-y-12">
          {/* 1. Image Gallery */}
          <section className="relative rounded-[2.5rem] overflow-hidden bg-surface-container-low border-2 border-outline-variant/30 group">
             <div className="aspect-[16/10] overflow-hidden">
                <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" alt={listing.title} />
             </div>
             
             {/* Gallery Controls Overlay */}
             <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex gap-2">
                   {(listing.images as string[]).map((_: any, i: number) => (
                     <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                   ))}
                </div>
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                   1 / {(listing.images as string[])?.length || 1} صورة
                </div>
             </div>

             {/* Action Badges Over Media */}
             <div className="absolute top-6 right-6 bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-black shadow-2xl flex items-center gap-2">
                <Zap className="w-4 h-4 fill-current" />
                <span>عرض بيع مباشر</span>
             </div>
          </section>

          {/* 3. Description Section */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                   <Info className="w-5 h-5 text-on-surface-variant/60" />
                </div>
                <h2 className="text-2xl font-black text-on-surface">نبذة عن العرض</h2>
             </div>
             <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic pr-4 border-r-4 border-primary/20">
                {listing.description}
             </p>
          </section>

          {/* 4. Metadata Section (Structured) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2">
                <Scale className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">الكمية المتوفرة</span>
                <p className="text-xl font-black text-on-surface">{listing.quantity} {listing.quantity_unit}</p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">المنطقة</span>
                <p className="text-xl font-black text-on-surface">{listing.location_text || 'تونس'}</p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2">
                <Clock className="w-5 h-5 text-tertiary" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">حالة العرض</span>
                <p className="text-xl font-black text-on-surface">{freshness.label}</p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">التصنيف</span>
                <p className="text-xl font-black text-on-surface">{(listing as any).categories?.name_ar}</p>
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Info & Actions (40%) */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {/* 2. Listing Core Info */}
          <section className="space-y-4">
             <div className="flex items-center gap-3 text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">
                <span>نُشر {new Date(listing.created_at).toLocaleDateString('ar-TN')}</span>
                <span>•</span>
                <span>المُشاهدات: {Math.floor(Math.random() * 200)}</span>
             </div>
             <h1 className="text-3xl lg:text-4xl font-black text-on-surface font-serif italic leading-tight">
                {listing.title}
             </h1>
             <div className="flex items-baseline gap-2 pt-2">
                <p className="text-4xl font-black text-primary font-serif italic">{listing.price}</p>
                <p className="text-sm font-black text-on-surface-variant/60">د.ت / {listing.quantity_unit}</p>
             </div>
          </section>

          {/* 6. Action Area (Buyer vs Owner) */}
          {!isOwner ? (
             <section className="space-y-4 p-8 bg-primary/5 rounded-[3rem] border-2 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="space-y-2 relative z-10">
                   <h3 className="text-sm font-black text-primary uppercase tracking-widest italic">هل أنت مهتم؟</h3>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                   <Button className="h-16 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <MessageCircle className="w-6 h-6 rotate-180" />
                      <span>بدء محادثة فورية</span>
                   </Button>
                   <Button variant="outline" className="h-16 rounded-2xl font-black text-xl border-2 border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center gap-3">
                      <Phone className="w-6 h-6" />
                      <span>اتصال مباشر</span>
                   </Button>
                </div>
                <div className="flex items-center justify-between pt-4 px-2 relative z-10">
                   <button className="flex items-center gap-2 text-xs font-black text-on-surface-variant/40 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>حفظ العرض</span>
                   </button>
                   <button className="flex items-center gap-2 text-xs font-black text-on-surface-variant/40 hover:text-error transition-colors">
                      <AlertCircle className="w-4 h-4" />
                      <span>تبليغ</span>
                   </button>
                </div>
             </section>
          ) : (
             <section className="space-y-6">
                {/* 46. Stale State Prompt (Owner only) */}
                <div className="p-6 bg-error/5 border-2 border-error/10 rounded-3xl space-y-3">
                   <div className="flex items-center gap-3 text-error">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <h4 className="font-black text-sm">العرض قديم نوعاً ما</h4>
                   </div>
                   <p className="text-xs font-medium text-on-surface-variant/70 leading-relaxed italic">لم يتم تحديث هذا العرض منذ 7 أيام. قم بتحديثه الآن ليبقى في أعلى نتائج البحث.</p>
                   <Button variant="outline" className="w-full h-11 rounded-xl border-error/20 text-error hover:bg-error/5 font-black text-xs">تحديث العرض الآن</Button>
                </div>

                <div className="p-8 bg-surface-container-low rounded-[3rem] border-2 border-outline-variant/30 space-y-4">
                   <h3 className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest italic">إدارة عرضك</h3>
                   <div className="flex flex-col gap-3">
                      <Button variant="outline" className="h-14 rounded-2xl font-black text-lg border-2 border-outline-variant/60">تعديل البيانات</Button>
                      <Button className="h-14 rounded-2xl font-black text-lg shadow-xl bg-on-surface text-surface">تحديد كمباع</Button>
                      <div className="grid grid-cols-2 gap-3">
                         <Button variant="ghost" className="text-xs font-black text-on-surface-variant/60 hover:text-error">حذف نهائي</Button>
                         <Button variant="ghost" className="text-xs font-black text-on-surface-variant/60 hover:text-primary">إخفاء مؤقت</Button>
                      </div>
                   </div>
                </div>
             </section>
          )}

          {/* 5. Owner Card */}
          <section className="bg-white p-8 rounded-[3rem] border-2 border-outline-variant/30 space-y-6 group">
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-surface-container-low rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-105 transition-transform border-2 border-primary/10">
                      <ShieldCheck className="w-10 h-10" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xl font-black text-on-surface">{(listing as any).profiles?.full_name}</h4>
                      <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest italic">{(listing as any).profiles?.role || 'عضو نشط'}</p>
                   </div>
                </div>
                <Button variant="ghost" className="p-2 h-12 w-12 rounded-2xl border-2 border-primary/5 text-primary hover:bg-primary/5">
                   <Share2 className="w-5 h-5" />
                </Button>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest">تاريخ الانضمام</span>
                   <p className="text-sm font-black text-on-surface">منذ فترة</p>
                </div>
                <div className="space-y-1">
                   <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest">الصفقات الناجحة</span>
                   <p className="text-sm font-black text-on-surface">متعددة</p>
                </div>
             </div>

             <div className="pt-2">
                <Button variant="ghost" className="w-full h-12 rounded-xl text-primary font-black text-xs hover:bg-primary/5 border border-primary/10">مشاهدة البروفايل الكامل</Button>
             </div>
          </section>
        </div>
      </div>

      {/* 8. Relevant Demand / Matching Requests */}
      <section className="bg-secondary/5 rounded-[3rem] p-10 border-2 border-secondary/10 space-y-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-on-surface font-serif italic italic">طلب شراء مطابق لمنتجك</h2>
               <p className="text-on-surface-variant/60 font-medium italic">هؤلاء المشترون يبحثون عن نفس الصنف في نفس منطقتك:</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {matchingRequests.map((req: any) => (
              <RequestCard key={req.id} request={req} />
            ))}
         </div>
      </section>

      {/* 7. Similar Listings */}
      <section className="space-y-8">
         <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <h2 className="text-2xl font-black text-on-surface">عروض مشابهة قد تهمك</h2>
            <Link href="/marketplace" className="text-sm font-black text-primary hover:underline">عرض الكل</Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarListings && similarListings.map((item: any) => (
              <ListingCard key={item.id} listing={item as any} />
            ))}
            {/* Nearby Suggestion Call to Action */}
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline-variant/30 rounded-[2.5rem] bg-surface-container-lowest text-on-surface-variant/40 text-center gap-4 group cursor-pointer hover:border-primary transition-all">
               <div className="p-4 bg-white rounded-2xl shadow-sm text-outline-variant/50 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-10 h-10" />
               </div>
               <p className="text-sm font-black uppercase tracking-widest leading-relaxed">اكتشف المزيد من الخضروات<br/>في جندوبة</p>
            </div>
         </div>
      </section>
      
      {/* Mobile Persistent Action Bar (PRD: High Intent) */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur border-t border-outline-variant/20 z-[60] lg:hidden flex gap-4">
           <Button className="flex-1 h-14 rounded-2xl font-black shadow-xl">تواصل مع الفلاح</Button>
           <Button variant="outline" className="w-14 h-14 rounded-2xl border-2 p-0 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
           </Button>
        </div>
      )}
    </div>
  );
}
