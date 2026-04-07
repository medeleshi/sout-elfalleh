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
import { 
  MapPin, 
  ChevronLeft,
  Sparkles,
  X
} from 'lucide-react';
import Link from 'next/link';
import { getMatchingDemand } from '@/lib/data/get-matching-demand';
import { getFeedItems, type FeedItem } from '@/lib/data/get-feed-items';
import { getCategories, getGovernorates, getUnits } from '@/lib/data/lookups';

export default async function MarketplacePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const profileData = await getCurrentProfile();
  const profile = profileData?.profile;

  // Active filters from URL
  const activeCategoryId = params.category_id as string || null;
  const activeGovernorateId = params.governorate_id as string || null;
  const activeType = params.type as 'listing' | 'purchase_request' | 'post' || null;

  // Fetch Lookups
  const [categoriesData, governoratesData, unitsData] = await Promise.all([
    getCategories(),
    getGovernorates(),
    getUnits(),
  ]);

  const categories = categoriesData as { id: string; name_ar: string }[];
  const governorates = governoratesData as { id: string; name_ar: string }[];
  const units = unitsData as { id: string; name_ar: string }[];

  const activeGovernorate = governorates.find(g => g.id === activeGovernorateId);
  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const isFarmer = profile?.role === 'farmer';
  const userGovernorateId = profile?.governorate_id || null;
  const userGovernorateName = profile?.governorate_name_ar || 'تونس';

  // Real data fetching with filters
  const matchingDemand = profile ? await getMatchingDemand(
    profile.id, 
    profile.activity_type_id || undefined, 
    userGovernorateId || undefined
  ) : [];
  
  const marketplaceItems = await getFeedItems({
    category_id: activeCategoryId,
    governorate_id: activeGovernorateId,
    type: activeType,
    limit: 30
  });

  // Filter for nearby
  const nearbyItems = userGovernorateId ? marketplaceItems.filter(item => 
    item.governorate_id === userGovernorateId
  ).slice(0, 3) : marketplaceItems.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 pb-32 pt-8 px-4 lg:px-8" dir="rtl">
      {/* 1. Personalized Header */}
      <MarketplaceHeader role={(profile?.role as UserRole) || 'buyer'} />

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* 2. Desktop Sidebar */}
        <FilterSidebar 
          categories={categories}
          governorates={governorates}
          units={units}
        />

        <div className="flex-1 w-full space-y-12">
          {/* Mobile/Tablet Controls */}
          <div className="space-y-6">
            <SearchAndFilter 
              categories={categories}
              governorates={governorates}
              units={units}
            />
            
            {/* Active Filter Chips */}
            {(activeCategoryId || activeGovernorateId || activeType) && (
              <div className="flex flex-wrap items-center gap-3">
                {activeGovernorate && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black border border-primary/20">
                      <span>الولاية: {activeGovernorate.name_ar}</span>
                   </div>
                )}
                {activeCategory && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black border border-primary/20">
                      <span>الصنف: {activeCategory.name_ar}</span>
                   </div>
                )}
                {activeType && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-black shadow-lg shadow-primary/20">
                      <span>النوع: {activeType === 'listing' ? 'عروض بيع' : 'طلبات شراء'}</span>
                   </div>
                )}
                <Link href="/marketplace" className="text-xs font-black text-on-surface-variant/40 hover:text-error transition-all uppercase tracking-widest px-2 py-2 flex items-center gap-1">
                   <X className="w-4 h-4" />
                   <span>مسح الكل</span>
                </Link>
              </div>
            )}

            {/* 3. Category Chips */}
            <CategoryChips 
              categories={categories}
              activeCategoryId={activeCategoryId}
            />
          </div>

          {/* 4. Recommended items row */}
          {marketplaceItems.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-on-surface">مقترحات لك</h2>
                 </div>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-6 -mx-1 px-1 scrollbar-hide snap-x">
                 {marketplaceItems.slice(0, 5).map((item: FeedItem) => (
                   <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                      {item.type === 'purchase_request' ? <RequestCard request={item as any} /> : <ListingCard listing={item as any} />}
                   </div>
                 ))}
              </div>
            </section>
          )}

          {/* 6. Nearby opportunities */}
          {nearbyItems.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-on-surface">فرص في {userGovernorateName}</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {nearbyItems.map((item: FeedItem) => (
                  item.type === 'purchase_request' ? <RequestCard key={item.id} request={item as any} /> : <ListingCard key={item.id} listing={item as any} />
                ))}
              </div>
            </section>
          )}

          {/* Matching Demand */}
          {isFarmer && matchingDemand.length > 0 && (
            <section className="bg-primary/5 rounded-[3rem] p-10 border-2 border-primary/10 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                     <h2 className="text-3xl font-black text-on-surface font-serif italic leading-tight">طلبات شراء تطابق محاصيلك</h2>
                     <p className="text-on-surface-variant/60 font-medium italic">بناءً على نشاطك، هؤلاء المشترون يبحثون عن منتجاتك:</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {matchingDemand.map((req: any) => (
                    <RequestCard key={req.id} request={req as any} />
                  ))}
               </div>
            </section>
          )}

          {/* Main listing grid */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-10">
                <Link 
                  href="/marketplace?type=purchase_request"
                  className={`relative px-2 py-2 text-2xl font-black transition-all ${activeType === 'purchase_request' ? 'text-primary' : 'text-on-surface-variant/30'}`}
                >
                   طلبات شراء
                   {activeType === 'purchase_request' && <div className="absolute -bottom-[1px] left-0 right-0 h-1.5 bg-primary rounded-full shadow-lg" />}
                </Link>
                <Link 
                  href="/marketplace?type=listing"
                  className={`relative px-2 py-2 text-2xl font-black transition-all ${activeType === 'listing' ? 'text-primary' : 'text-on-surface-variant/30'}`}
                >
                   عروض بيع
                   {activeType === 'listing' && <div className="absolute -bottom-[1px] left-0 right-0 h-1.5 bg-primary rounded-full shadow-lg" />}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {marketplaceItems.map((item: FeedItem) => (
                item.type === 'purchase_request' ? <RequestCard key={item.id} request={item as any} /> : <ListingCard key={item.id} listing={item as any} />
              ))}
            </div>

            {marketplaceItems.length === 0 && (
              <EmptyMarketplace type="no-results" />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
