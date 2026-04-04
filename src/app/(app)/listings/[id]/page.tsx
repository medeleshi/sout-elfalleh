import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Scale, 
  Clock, 
  ChevronRight,
  ShoppingBag,
  Star,
  Info,
  ArrowRight,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { RequestCard } from '@/components/marketplace/RequestCard';

import { createClient } from '@/lib/supabase/server';
import { getMatchingDemand } from '@/lib/data/get-matching-demand';
import { notFound } from 'next/navigation';
import { getFreshnessInfo } from '@/lib/utils/freshness';

// Client Components
import { ListingGallery } from '@/components/marketplace/ListingGallery';
import { ListingActions } from '@/components/marketplace/ListingActions';
import { OwnerCard } from '@/components/marketplace/OwnerCard';
import { OwnerManagement } from '@/components/marketplace/OwnerManagement';

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const profileData = await getCurrentProfile();
  
  // 1. Fetch Main Listing
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id(full_name, avatar_url, role),
      listing_images(storage_path),
      governorates:governorate_id(name_ar)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const listing = data as any;
  const isOwner = profileData?.user?.id === listing.user_id;

  if (!isOwner && listing.status !== 'active') {
    return notFound();
  }

  // 2. Fetch Similar Listings (Same Category, excluding current)
  const { data: similarListings } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:user_id(full_name),
      listing_images(storage_path),
      governorates:governorate_id(name_ar)
    `)
    .eq('category', listing.category)
    .neq('id', listing.id)
    .eq('status', 'active')
    .limit(4);

  // 3. Fetch Matching Demand (Personalization)
  const matchingRequests = await getMatchingDemand(
    profileData?.user?.id || '',
    listing.category,
    listing.governorate_id,
    3
  );

  const freshness = getFreshnessInfo(listing.created_at);
  const isFresh = freshness.label === 'جديد';

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8 space-y-12" dir="rtl">
      {/* 0. Breadcrumbs & Back */}
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-on-surface-variant/40 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/marketplace" className="hover:text-primary transition-colors flex items-center gap-1">
             <ShoppingBag className="w-3 h-3" />
             <span>السوق</span>
          </Link>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-on-surface-variant/60">{listing.category}</span>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-on-surface truncate max-w-[150px]">{listing.title}</span>
        </div>
        <Link href="/marketplace" className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Media & Description (60%) */}
        <div className="lg:col-span-8 space-y-12">
          {/* 1. Image Gallery (Client Component) */}
          <ListingGallery 
            images={listing.listing_images?.map((img: any) => img.storage_path) || []} 
            title={listing.title} 
            isFresh={isFresh} 
          />

          {/* 3. Description Section */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <div className="p-2 bg-surface-container-low rounded-xl">
                   <Info className="w-5 h-5 text-on-surface-variant/60" />
                </div>
                <h2 className="text-2xl font-black text-on-surface">نبذة عن العرض</h2>
             </div>
             <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic pr-4 border-r-4 border-primary/20 text-right">
                {listing.description || 'لا يوجد وصف مفصل لهذا العرض...'}
             </p>
          </section>

          {/* 4. Metadata Section (Structured) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2 text-right">
                <Scale className="w-5 h-5 text-primary mr-auto" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">الكمية المتوفرة</span>
                <p className="text-xl font-black text-on-surface">{listing.quantity} {listing.unit}</p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2 text-right">
                <MapPin className="w-5 h-5 text-secondary mr-auto" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">المنطقة</span>
                <p className="text-xl font-black text-on-surface">
                  {(listing.governorates as any)?.name_ar || 'تونس'}
                  {listing.region ? ` - ${listing.region}` : ''}
                </p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2 text-right">
                <Clock className="w-5 h-5 text-tertiary mr-auto" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">حالة العرض</span>
                <p className="text-xl font-black text-on-surface">{freshness.label}</p>
             </div>
             <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 space-y-2 text-right">
                <Star className="w-5 h-5 text-primary mr-auto" />
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest block">التصنيف</span>
                <p className="text-xl font-black text-on-surface">{listing.category}</p>
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Info & Actions (40%) */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {/* 2. Listing Core Info */}
          <section className="space-y-4 text-right">
             <div className="flex items-center justify-end gap-3 text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">
                <span>المُشاهدات: {Math.floor(Math.random() * 200)}</span>
                <span>•</span>
                <span>نُشر {new Date(listing.created_at).toLocaleDateString('ar-TN')}</span>
             </div>
             <h1 className="text-3xl lg:text-4xl font-black text-on-surface font-serif italic leading-tight">
                {listing.title}
             </h1>
          </section>

          {/* 6. Action Area (Client Component) */}
          <ListingActions 
            listingId={listing.id} 
            isOwner={isOwner} 
            price={listing.price} 
            unit={listing.unit} 
            isNegotiable={listing.is_price_negotiable}
          />

          {/* 4b. Owner Management (Client Component) */}
          {isOwner && (
            <OwnerManagement 
              listingId={listing.id} 
              status={listing.status} 
              isStale={freshness.label === 'قديم'} 
            />
          )}

          {/* 5. Owner Card (Client Component) */}
          <OwnerCard 
            owner={listing.profiles} 
            ownerId={listing.user_id} 
          />
        </div>
      </div>

      {/* 8. Relevant Demand / Matching Requests */}
      {matchingRequests.length > 0 && (
        <section className="bg-secondary/5 rounded-[3rem] p-10 border-2 border-secondary/10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 text-right">
            <div className="space-y-2 flex-1">
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
      )}

      {/* 7. Similar Listings */}
      <section className="space-y-8">
         <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 flex-row-reverse">
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
               <p className="text-sm font-black uppercase tracking-widest leading-relaxed">اكتشف المزيد من الخضروات<br/>في منطقتك</p>
            </div>
         </div>
      </section>
      
      {/* Mobile Persistent Action Bar (PRD: High Intent) */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 z-[60] lg:hidden flex gap-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
           <Button className="flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
             <span>تواصل مع الفلاح</span>
           </Button>
           <Button variant="outline" className="w-16 h-16 rounded-2xl border-2 border-primary/20 p-0 flex items-center justify-center bg-white">
              <Phone className="w-6 h-6 text-primary" />
           </Button>
        </div>
      )}
    </div>
  );
}
